/**
 * Create Amnezia VPN Discord IP list
 */

import fs from 'fs';
import { promises as dns } from 'dns';


const DELIMITER = "\r\n";


(async () => {

    // Читаем построчно данные из списка IP и форматируем в массив
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



})

// Читаем построчно данные из списка IP и форматируем в массив
const config = fs
    .readFileSync('data/ips.txt')
    .toString()
    .split(DELIMITER)
    .map((hostname) => {
        return {
            hostname,
            ip: ""
        }
    })


const domainsIps = fs.readFileSync('data/domains.txt')
    .toString()
    .split(DELIMITER);


const dnsConfig = [];
const dnsPromises = domainsIps.map(async (hostname) => {
    try {
        const addresses = await dns.resolve4(hostname);
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