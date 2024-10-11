import inquirer from 'inquirer';
import chalk from 'chalk';
import { Separator } from '@inquirer/prompts';
import path from "path";
import fs from "fs/promises";

// Определяем типы регионов
const regionTypes = {
    America: [
        'atlanta',
        'brazil',
        'buenos-aires',
        'newark',
        'santa-clara',
        'santiago',
        'seattle',
        'us-central',
        'us-east',
        'us-south',
        'us-west',
    ],
    Europe: [
        'bucharest',
        'finland',
        'frankfurt',
        'madrid',
        'milan',
        'rotterdam',
        'russia',
        'stockholm',
        'warsaw',
    ],
    Asia: [
        'dubai',
        'hongkong',
        'india',
        'japan',
        'singapore',
        'south-korea',
        'tel-aviv',
    ],
    Africa: [
        'southafrica',
    ],
    Oceania: [
        'sydney',
    ]
};

async function saveResult(filePath, data) {
    // Извлекаем директорию из пути файла
    const dir = path.dirname( filePath);

    try {
        // Создаем директорию, если ее не существует
        await fs.mkdir(dir, { recursive: true });

        // Записываем файл в указанную директорию
        await fs.writeFile( filePath, data);

    } catch (err) {
        console.error(`Ошибка при записи файла: ${err}`);
    }
}

let choices = [];
for (const region in regionTypes) {
    choices.push(new Separator(`─ ${region} ────────────`));
    for (let name in regionTypes[region]) {
        choices.push({ name: `${ regionTypes[region][name]}`, value: regionTypes[region][name] })
    }
}



const questions = [
    {
        type: 'checkbox',
        name: 'regions',
        message: chalk.cyan('Voice chat regions:'),
        choices,
        pageSize: choices.length
    },
    {
        type: 'list',
        name: 'resultType',
        message: chalk.cyan('Format:'),
        choices: [
            { name: '1. Domains', value: 'domains' },
            { name: '2. IP adresses', value: 'ips' },
            { name: '3. Subnets', value: 'subnets' }
        ],
    }
];

const questionsFormat = {
    type: 'list',
    name: 'format',
    message: chalk.cyan('Result format:'),
    choices: [
        { name: '1. Text (other)', value: 'txt' },
        { name: '2. GoodbyeDPI', value: 'config' },
        { name: '3. Zapret', value: 'config' },
        { name: '4. Amnezia VPN', value: 'json' },
    ],
};

const log = console.log.bind(console);


(async () => {

    log(chalk.bgCyan.black('VPN config generator (Discord)'));

    const regions = await inquirer.prompt(questions);

    let updatedFormatChoices = (regions.resultType == 'ips' || regions.resultType == 'subnets')
        ? questionsFormat.choices.filter(choice => choice.value !== 'config')
        : questionsFormat.choices;

    const format = await inquirer.prompt({
        ...questionsFormat,
        ...{ choices: updatedFormatChoices }
    });

    let result = [];

    // Чтение основных данных
    const main = await fs.readFile(`./configs/all.${regions.resultType}.txt`, 'utf-8');
    result = [...result, ...main.split("\r\n")];

    for (const region of regions.regions) {
        // Чтение региона
        const data = await fs.readFile(`./configs/${region}/${regions.resultType}.txt`, 'utf-8');
        result = [...result, ...data.split("\r\n")];
    }


    if (format.format === 'config' || format.format === 'txt' ) {
        await saveResult(`./dest/config.txt`, [...new Set(result)].join("\r\n"));
    } else {
        await saveResult(`./dest/config.json`, JSON.stringify([...new Set(result)].map(hostname => {
            return {
                hostname,
                ip: ""
            }
        }), null, 2));
    }


})();
