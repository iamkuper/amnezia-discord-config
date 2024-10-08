/**
 * Create Amnezia VPN Discord IP list
 */

import fs from 'fs';

const DELIMITER = "\r\n";

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


// Преобразуйте массив в строку JSON
const jsonConfig = JSON.stringify(config, null, 2);


fs.writeFile('configs/amnezia.json', jsonConfig, (err) => {
    if (err) console.error('Ошибка записи в файл', err);
    else console.log('Файл успешно сохранен.');
});