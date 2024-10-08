# Что и зачем?

Этот репозиторий содержит список IP-адресов/доменов, используемых мессенджером Discord, а так же готовые конфиги для Amnezia VPN и GoodbyeDPI. 

## Структура репозитория

- [x] `data/ips.txt` - список всех IP адресов, принадлежащих Discord.
- [x] `data/domains.txt` - список всех доменных имен, принадлежащих Discord.
<br><br>
- [x] `configs/amnezia.json` - готовый конфиг для раздельного туннелирования в Amnezia VPN
<br><br>
- [x] `index.js` - NodeJS скрипт для генерации конфига из TXT 


## Как добавить адреса в GoodbyeDPI

1. Перейти в папку GoodbyeDPI
2. Добавить содержимое файла `data/domains.txt` из репозитория в файл `russia-blacklist.txt` 
3. Profit

## Как добавить адреса в Amnezia VPN

1. Перейти в настройки Amenzia VPN
2. Пункт **Раздельное туннелирование сайтов**
3. Выполнить **Импорт** файла `configs/amnezia.json`
4. Profit


## Поддержать автора

- **USDT (TRC20):** TQANwUtCf9UmLZyM3Ty18hDsYpPAVmrpbH
- **BTC:** bc1quvv5knvrvya5hn4xzpsfp5tpm5n9yuvmscmg6t
- **ETH:** 0xF6a93e81A7cf88b22F5Cec3ABfC0A2295A5Aa7A3