# Noah 2000 MQTT Bridge

Diese Add-on verbindet dein Growatt Noah 2000 Speichersystem über die Growatt API mit Home Assistant via MQTT.

## Features
- **Plug & Play**: Automatische Erkennung (MQTT Discovery) in Home Assistant.
- **Echtzeit-Daten**: SOC (Batterie), PV-Eingang, AC-Ausgang und Ladeleistung.
- **Energie-Dashboard**: Kompatibel mit dem Home Assistant Energie-Management.

## Installation

1. Füge dieses Repository zu deinem Home Assistant Add-on Store hinzu.
2. Installiere das Add-on **Noah MQTT Bridge**.
3. Stelle sicher, dass du einen funktionierenden MQTT Broker (z.B. Mosquitto Add-on) hast.
4. Trage deine Growatt-Zugangsdaten in der Konfiguration ein.

## Konfiguration

| Option | Beschreibung |
| :--- | :--- |
| `username` | Dein Growatt Login-Name |
| `password` | Dein Growatt Passwort |
| `mqtt_server` | Adresse deines Brokers (Standard: `mqtt://core-mosquitto`) |
| `mqtt_user` | MQTT Benutzername (optional) |
| `mqtt_password` | MQTT Passwort (optional) |
| `interval` | Abfrage-Intervall in Sekunden (Minimum 60s empfohlen) |

## Disclaimer
Dieses Projekt steht in keiner Verbindung zu Growatt. Die Nutzung erfolgt auf eigene Gefahr. Zu häufige Abfragen können zur Sperrung des Growatt-Accounts führen.