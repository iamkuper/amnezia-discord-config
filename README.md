![preview](https://github.com/iamkuper/amnezia-discord-config/raw/main/preview.png)


Этот репозиторий содержит конфигуратора адресов, используемых мессенджером Discord, а так же готовые конфиги для VPN и DPI систем. 

> **Для ленивых:** релиз 1.0.1 включены готовые файлы конфигурации в **JSON** и **TXT** (папка **configs**). Они содержат основные адреса + все (найденные) адреса голосовых серверов.

> Если что-то не работает или не хватает адресов читаем [`Issues`](https://github.com/iamkuper/amnezia-discord-config/issues). Если решения нет - создаем топик и описываем проблему.


## Как создать файл конфигурации

1. Установить NodeJS и Git
2. Выполнить клонирование репозитория через `Терминал`
```console
~# git clone git@github.com:iamkuper/amnezia-discord-config.git .
```
3. Перейти в папку
```console
~# cd ./amnezia-discord-config
```
4. Установить зависимости
```console
~# npm install
```
5. Запустить конфигуратор
```console
~# npm run create
```
6. Готовый файл конфигурации сохраняется в директорию `dest`


### Как добавить в DPI
 > **Необходимый формат:** `Domains` -> `Text (other)`
1. Перейти в папку c DPI системой
2. Добавить файл конфигурации в `russia-blacklist.txt` / `list-general.txt`
3. Перезапустить DPI систему

### Как добавить в AmneziaVPN
 > **Необходимый формат:** `IP adresses` или `Subnets` -> `Amnezia VPN`
1. Перейти в настройки Amenzia VPN
2. Пункт **Раздельное туннелирование сайтов**
3. Выполнить **Импорт** файла конфигурации
4. Перезапустить VPN

### Как добавить в OpenWRT
  > **Необходимый формат:** `IP adresses` -> `Text (other)`

1. Перейти в веб-морду роутера `192.168.1.1`
2. Добавить `IP Sets` в настройки сети (`Networks` > `Firewall`)
	- `Name`: <любое>
	- `Family`: IPv4
	- `Packet Field Match`: dest_ip
	- `Include File`: загрузить файл конфигурации
	- Сохранить настройки.
3. Добавить `Traffic Rules` в настройки сети (`Networks` > `Firewall`)
	- `Source zone`: lan
	- `Destination zone`: Any zone
	- `Action`: apply firewall mark
	- `Set mark`: 0x1
	- `Adavanced Settings > Restrict to address family`: IPv4 only
	- `Adavanced Settings > Use ipset`: <название сета из п.2>
	- Сохранить настройки.
4. Перезагрузить сеть (или роутер).

### Поддерживаемые регионы голосовых чатов

- America
	- [x] Atlanta
	- [x] Brazil
	- [x] Buenos Aires
	- [x] Newark
	- [x] Santa-Clara
	- [x] Santiago
	- [x] Seattle
	- [x] US Central
	- [x] US East
	- [x] US South
	- [x] US West
- Europe
	- [x] Bucharest
	- [x] Dubai
	- [x] Finland
	- [x] Frankfurt
	- [x] Madrid
	- [x] Milan
	- [x] Rotterdam
	- [x] Russia
	- [x] Stockholm
	- [x] Warsaw
- Asia
	- [x] Hong Kong
	- [x] India
	- [x] Japan
	- [x] Singapore
	- [x] South Korea
- Africa
	- [x] South Africa
- Oceania
	- [x] Sydney


### TODO

- [x] Собрать IP адреса методом перебора + DNS Resolve
- [x] Скрипт объединения IP-адресов в подсети (для слабых устройств) 
- [x] Конфигуратор с возможностью выбора необходимых голосовых серверов


### Поддержать проект

- **USDT (TRC20):** TQANwUtCf9UmLZyM3Ty18hDsYpPAVmrpbH
- **BTC:** bc1quvv5knvrvya5hn4xzpsfp5tpm5n9yuvmscmg6t
- **ETH:** 0xF6a93e81A7cf88b22F5Cec3ABfC0A2295A5Aa7A3
