/**
 * Create Amnezia VPN Discord IP list
 */
import fs from 'fs';
import { Resolver } from 'dns/promises'; // Используем promises API

// Разделитель строк в TXT
const DELIMITER = "\r\n";
const DNS_SERVER = "8.8.8.8";

// Устанавливаем кастомные DNS-серверы
const resolver = new Resolver();
resolver.setServers([ DNS_SERVER ]);

(async () => {

    // Читаем построчно данные из списка IP и форматируем конфиг
    let config = fs
        .readFileSync('data/ips.txt')
        .toString()
        .split(DELIMITER)
        .map((hostname) => {
            return {
                hostname,
                ip: ""
            }
        })

    // Загружаем домены
    const domainsIps = fs.readFileSync('data/domains.txt')
        .toString()
        .split(DELIMITER);

    // Получаем списки IP из DNS
    const dnsConfig = [];
    const dnsPromises = domainsIps.map(async (hostname) => {
        try {
            const addresses = await resolver.resolve4(hostname);
            console.log(addresses);
            addresses.forEach((hostname) => {
                dnsConfig.push({
                    hostname,
                    ip: ""
                });
            });
        } catch (err) {
            console.error(`Ошибка при разрешении DNS для ${hostname}:`, err);
        }
    });

    // Ждем завершения всех DNS-запросов
    await Promise.all(dnsPromises);

    // Преобразуйте массив в строку JSON
    const jsonConfig = JSON.stringify([ ...config, ...dnsConfig ], null, 2);


    fs.writeFile('configs/amnezia.json', jsonConfig, (err) => {
        if (err) console.error('Ошибка записи в файл', err);
        else console.log('Файл успешно сохранен.');
    });


})();