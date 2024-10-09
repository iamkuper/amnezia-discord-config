/**
 * Create Amnezia VPN Discord IP list
 */
import fs from 'fs';
import { Resolver } from 'dns/promises'; // Используем promises API

// Разделитель строк в TXT
const DELIMITER = "\r\n";

// DNS сервер для резолвинга
const DNS_SERVER = "8.8.8.8";


let mainServers = [];
let voiceServers = {
    brazil: [],
    bucharest: [],
    hongkong: [],
    india: [],
    japan: [],
    rotterdam: [],
    russia: [],
    singapore: [],
    warsaw: [],
    southafrica: [],
    stockholm: [],
    "tel-aviv": [],
    sydney: [],
    seattle: [],
    "us-central": [],
    "us-east": [],
    "us-south": [],
    "us-west": [],
    atlanta: [],
    "buenos-aires": [],
    "south-korea": [],
    dubai: [],
    finland: [],
    frankfurt: [],
    madrid: [],
    milan: [],
    newark: [],
    "santa-clara": [],
    santiago: [],
}

// Устанавливаем кастомные DNS-серверы
const resolver = new Resolver();
resolver.setServers([ DNS_SERVER ]);

(async () => {


    // Загружаем домены
    const domainsIps = fs.readFileSync('data/main.txt')
        .toString()
        .split(DELIMITER);

    // Получаем списки IP из DNS
    const dnsPromises = domainsIps.map(async (hostname) => {
        try {
            const addresses = await resolver.resolve4(hostname);
            addresses.forEach((hostname) => {
                mainServers.push(hostname);
            });
        } catch (err) {
            console.error(`Ошибка при разрешении DNS для ${hostname}:`, err);
        }
    });

    // Ждем завершения всех DNS-запросов
    await Promise.all(dnsPromises);


    for (const region in voiceServers) {
        if (voiceServers.hasOwnProperty(region)) {

            console.log(`Проверка региона: ${ region } ...`);
            for (let i = 1; i <= 15000; i++) {
                const domain = `${region}${i}.discord.gg`;
                try {
                    const addresses = await resolver.resolve4(domain);
                    addresses.forEach((hostname) => {
                        console.log(domain + ': ' +hostname)
                        voiceServers[region].push(domain);
                    });
                } catch (err) {}
            }

        }
    }

    // Преобразуйте массив в строку JSON
  /**  const uniqueIPs = [...new Set(mainServers)].sort();
    console.log(uniqueIPs);
    const jsonConfig = uniqueIPs.map((hostname) => {
        return {
            hostname,
            ip: ""
        }
    }); */

    for (const region in voiceServers) {
        if (voiceServers.hasOwnProperty(region)) {
            fs.writeFile(`data/voices/${region}.txt`, voiceServers[region].join(DELIMITER), (err) => {
                if (err) console.error('Ошибка записи в файл', err);
                else console.log(`Регион ${region} успешно сохранен.`);
            });

        }
    }

/*
    fs.writeFile('configs/amnezia.json', JSON.stringify(jsonConfig, null, 2), (err) => {
        if (err) console.error('Ошибка записи в файл', err);
        else console.log('Файл успешно сохранен.');
    });

    fs.writeFile('configs/openwrt.txt', uniqueIPs.join(DELIMITER), (err) => {
        if (err) console.error('Ошибка записи в файл', err);
        else console.log('Файл успешно сохранен.');
    });
*/

})();