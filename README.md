# Что и зачем?

Этот репозиторий содержит список IP-адресов/доменов, используемых мессенджером Discord, а так же готовые конфиги для Amnezia VPN и GoodbyeDPI. 

**Через GoodbyeDPI работает только чат. Голосовые чаты работать не будут.... возможно пока.**

## Структура репозитория

- [x] `data/ips.txt` - список всех IP адресов, принадлежащих Discord.
- [x] `data/domains.txt` - список всех доменных имен, принадлежащих Discord.
<br><br>
- [x] `configs/amnezia.json` - готовый конфиг для раздельного туннелирования в Amnezia VPN
- [x] `configs/openwrt.txt` - готовый IP Set для раздельного туннелирования в OpenWRT
<br><br>
- [x] `index.js` - NodeJS скрипт для генерации конфига из TXT 


## Как добавить в GoodbyeDPI

1. Перейти в папку GoodbyeDPI
2. Добавить содержимое файла `data/domains.txt` из репозитория в файл `russia-blacklist.txt` 
3. Profit

## Как добавить в Amnezia VPN

1. Перейти в настройки Amenzia VPN
2. Пункт **Раздельное туннелирование сайтов**
3. Выполнить **Импорт** файла `configs/amnezia.json`
4. Profit

## Как добавить в правила роутера (OpenWRT)

1. Перейти в веб-морду роутера `192.168.1.1`
2. Добавить `IP Sets` в настройки сети (`Networks` > `Firewall`)
- `Name`: <любое>
- `Family`: IPv4
- `Packet Field Match`: dest_ip
- `Include File`: загрузить файл из репозитория `configs/openwrt.txt`
- Сохранить настройки.
3. Добавить `Traffic Rules` в настройки сети (`Networks` > `Firewall`)
- `Source zone`: lan
- `Destination zone`: Any zone
- `Action`: apply firewall mark
- `Set mark`: 0x1
- `Adavanced Settings` > `Restrict to address family`: IPv4 only
- `Adavanced Settings` > `Use ipset`: <название сета из п.2>
- Сохранить настройки.
4. Перезагрузить сеть (или роутер).


## Поддержать автора

- **USDT (TRC20):** TQANwUtCf9UmLZyM3Ty18hDsYpPAVmrpbH
- **BTC:** bc1quvv5knvrvya5hn4xzpsfp5tpm5n9yuvmscmg6t
- **ETH:** 0xF6a93e81A7cf88b22F5Cec3ABfC0A2295A5Aa7A3
