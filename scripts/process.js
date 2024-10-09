import fs from 'fs/promises';
import path from 'path';
import { Resolver } from 'dns/promises'; // Используем promises API


const DELIMITER = "\r\n";
const DNS_SERVER = "8.8.8.8";
const PATH = './data/voices';


let allIps = [];
let allSubnets = [];
let allDomains = [];

// Устанавливаем кастомные DNS-серверы
const resolver = new Resolver();
resolver.setServers([ DNS_SERVER ]);

function ipToBinary(ip) {
    return ip.split('.')
        .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
        .join('');
}

function binaryToIp(bin) {
    const octets = bin.match(/.{1,8}/g);
    return octets.map(octet => parseInt(octet, 2)).join('.');
}

function mergePrefixes(ips) {
    // Преобразуем все IP-адреса в двоичный формат
    const binaries = ips.map(ip => ipToBinary(ip));

    // Найдем общий префикс
    let commonPrefix = '';
    for (let i = 0; i < binaries[0].length; i++) {
        const bit = binaries[0][i];
        if (binaries.every(b => b[i] === bit)) {
            commonPrefix += bit;
        } else {
            break;  // Остановимся, когда найдем первую разницу
        }
    }

    // Вычисляем длину префикса
    const subnetMaskLength = commonPrefix.length;

    // Дополняем общую часть до полной длины 32 бит (4 байта)
    const networkAddressBinary = commonPrefix.padEnd(32, '0');

    // Преобразуем обратно в IP-адрес
    const networkAddress = binaryToIp(networkAddressBinary);

    return `${networkAddress}/${subnetMaskLength}`;
}

function splitIntoSubnets(ips) {
    // Сортируем IP-адреса по двоичному представлению
    ips.sort((a, b) => {
        const binaryA = ipToBinary(a);
        const binaryB = ipToBinary(b);
        return binaryA.localeCompare(binaryB);
    });

    let subnets = [];
    let currentGroup = [ips[0]];

    // Идем по массиву IP-адресов и пытаемся их сгруппировать
    for (let i = 1; i < ips.length; i++) {
        const merged = mergePrefixes([currentGroup[0], ips[i]]);
        const [network, maskLength] = merged.split('/');

        // Если маска стала слишком короткой, создаем новую группу
        if (parseInt(maskLength) < 24) {  // Подсеть слишком большая — остановимся на /24
            subnets.push(mergePrefixes(currentGroup));
            currentGroup = [ips[i]];
        } else {
            currentGroup.push(ips[i]);
        }
    }

    // Добавим последнюю группу
    if (currentGroup.length > 0) {
        subnets.push(mergePrefixes(currentGroup));
    }

    return subnets;
}

async function saveResult(filePath, data) {
    // Извлекаем директорию из пути файла
    const dir = path.dirname('./configs/' + filePath);

    try {
        // Создаем директорию, если ее не существует
        await fs.mkdir(dir, { recursive: true });

        // Записываем файл в указанную директорию
        await fs.writeFile('./configs/' + filePath, data);

    } catch (err) {
        console.error(`Ошибка при записи файла: ${err}`);
    }
}

// Функция для обработки одного файла с async/await
async function processRegionFile(filePath) {
    try {
        // Чтение файла
        const data = await fs.readFile(filePath, 'utf-8');
        allDomains = [ ...allDomains, ...data ];

        // Получаем название файла без расширения (регион)
        const region = path.basename(filePath, path.extname(filePath));


        // Пересохраняем домены
        await saveResult(`${region}/domains.txt`, data);

        // Разделение содержимого файла по разделителю
        const domains = data.split(DELIMITER);


        let ips = [];
        // Перебираем домены
        for (const domain of domains) {
            // DNS Resolve
            const addresses = await resolver.resolve4(domain);
            ips = [ ...ips, ...addresses ];
        }

        // Сохраняем IP адреса
        await saveResult(`${region}/ips.txt`, ips.join(DELIMITER));
        allIps = [ ...allIps, ...ips ];

        // Сохраняем подсети
        const subnets = splitIntoSubnets(ips);
        await saveResult(`${region}/subnets.txt`, subnets.join(DELIMITER));
        allSubnets = [ ...allSubnets, ...subnets ];


        console.log(subnets);

    } catch (err) {
        console.error(err);
    }
}

// Функция для обработки одного файла с async/await
async function processMainFile() {
    try {
        // Чтение файла
        const data = await fs.readFile(`./data/domains.txt`, 'utf-8');

        // Разделение содержимого файла по разделителю
        const domains = data.split(DELIMITER);
        allDomains = [ ...allDomains, ...domains ];

        let ips = [];
        // Перебираем домены
        for (const domain of domains) {
            // DNS Resolve
            const addresses = await resolver.resolve4(domain);
            ips = [ ...ips, ...addresses ];
        }

        allIps = [ ...allIps, ...ips ];

        // Сохраняем подсети
        const subnets = splitIntoSubnets(ips);
        allSubnets = [ ...allSubnets, ...subnets ];


    } catch (err) {
        console.error(err);
    }
}

// Функция для чтения директории и последовательной обработки файлов
async function processDirectory(directoryPath) {
    // Чтение директории
    const files = await fs.readdir(directoryPath);

    // Обрабатываем каждый файл последовательно
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        await processRegionFile(filePath); // Ожидаем завершения обработки каждого файла
    }
}


(async () => {

    // Обработка основных серверов
    await processMainFile();

    // Обработка голосовых серверов
    await processDirectory(PATH);

    // Пересохраняем общие файлы
    await saveResult(`all.domains.txt`, [...new Set(allDomains)].join(DELIMITER));
    await saveResult(`all.ips.txt`, [...new Set(allIps)].join(DELIMITER));
    await saveResult(`all.subnets.txt`, [...new Set(allSubnets)].join(DELIMITER));

    // Пересохраняем JSON
    await saveResult(`all.domains.json`, JSON.stringify([...new Set(allDomains)].map(hostname => {
        return {
            hostname,
            ip: ""
        }
    }), null, 2));
    await saveResult(`all.ips.json`, JSON.stringify([...new Set(allIps)].map(ip => {
        return {
            hostname: "",
            ip
        }
    }), null, 2));
    const fullSubnets = splitIntoSubnets([...new Set(allIps)]);
    await saveResult(`all.subnets.json`, JSON.stringify([...new Set(fullSubnets)].map(ip => {
        return {
            hostname: "",
            ip
        }
    }), null, 2));

})();