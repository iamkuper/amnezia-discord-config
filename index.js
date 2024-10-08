/**
 * Create Amnezia VPN Discord IP list
 */
import fs from 'fs';
import { Resolver } from 'dns/promises'; // Используем promises API

// Разделитель строк в TXT
const DELIMITER = "\r\n";

// DNS сервер для резолвинга
const DNS_SERVER = "8.8.8.8";

let ips = [];

// Устанавливаем кастомные DNS-серверы
const resolver = new Resolver();
resolver.setServers([ DNS_SERVER ]);

(async () => {

    // Читаем построчно данные из списка IP и форматируем конфиг
    fs.readFileSync('data/ips.txt')
        .toString()
        .split(DELIMITER)
        .forEach((hostname) => {
            ips.push(hostname);
        })

    // Загружаем домены
    const domainsIps = fs.readFileSync('data/domains.txt')
        .toString()
        .split(DELIMITER);

    // Получаем списки IP из DNS
    const dnsPromises = domainsIps.map(async (hostname) => {
        try {
            const addresses = await resolver.resolve4(hostname);
            addresses.forEach((hostname) => {
                ips.push(hostname);
            });
        } catch (err) {
            console.error(`Ошибка при разрешении DNS для ${hostname}:`, err);
        }
    });

    // Ждем завершения всех DNS-запросов
    await Promise.all(dnsPromises);

    // Преобразуйте массив в строку JSON
    const uniqueIPs = [...new Set(ips)].sort();
    const jsonConfig = uniqueIPs.map((hostname) => {
        return {
            hostname,
            ip: ""
        }
    });


    fs.writeFile('configs/amnezia.json', JSON.stringify(jsonConfig, null, 2), (err) => {
        if (err) console.error('Ошибка записи в файл', err);
        else console.log('Файл успешно сохранен.');
    });

    fs.writeFile('configs/openwrt.txt', uniqueIPs.join(DELIMITER), (err) => {
        if (err) console.error('Ошибка записи в файл', err);
        else console.log('Файл успешно сохранен.');
    });


})();