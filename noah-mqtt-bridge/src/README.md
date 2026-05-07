# ☀️ Growatt Noah 2000 MQTT Bridge

Dieses Add-on verbindet dein **Growatt Noah 2000** Speichersystem lokal mit Home Assistant. Es fragt die Daten über die Growatt API ab und sendet sie per MQTT an Home Assistant, wo sie dank **MQTT Discovery** automatisch als Gerät erkannt werden.

---

## 🚀 Features
- **Einfache Einrichtung**: Einmalige Eingabe der Zugangsdaten, der Rest geht von allein.
- **Energie-Dashboard**: Sensoren sind vorkonfiguriert für die Nutzung im HA Energie-Management.
- **Automatische Erkennung**: Erstellt automatisch ein Gerät mit Sensoren für:
  - Batterie-Ladestand (SOC in %)
  - PV-Eingangsleistung (W)
  - Ausgangsleistung (W)
  - Batterie-Ladeleistung (W)

---

## 🛠 Installation

1. **Repository hinzufügen**: Füge die URL deines GitHub-Repositories in den Home Assistant Add-on Store unter "Repositories" hinzu.
2. **Installieren**: Suche nach "Noah MQTT Bridge" und klicke auf **Installieren**.
3. **Konfigurieren**: Gehe zum Reiter **Konfiguration** (siehe unten).
4. **Starten**: Klicke auf **Starten** und prüfe das Protokoll (Log) auf Fehlermeldungen.

---

## ⚙️ Konfiguration

Beispiel für die Einstellungen im Add-on:

| Option | Beschreibung |
| :--- | :--- |
| `username` | Dein Benutzername für die Growatt ShinePhone App. |
| `password` | Dein Passwort für die Growatt ShinePhone App. |
| `mqtt_server` | Die Adresse deines Brokers (meist `mqtt://core-mosquitto`). |
| `mqtt_user` | Benutzername für MQTT (falls benötigt). |
| `mqtt_password` | Passwort für MQTT (falls benötigt). |
| `interval` | Abfrage-Intervall in Sekunden (Minimum 60 empfohlen). |

---

## 📊 Sensoren in Home Assistant

Sobald das Add-on läuft, findest du unter **Einstellungen > Geräte & Dienste > MQTT** ein neues Gerät namens **Growatt Noah 2000**. 

Folgende Entitäten werden bereitgestellt:
*   `sensor.growatt_noah_2000_soc`
*   `sensor.growatt_noah_2000_ppv`
*   `sensor.growatt_noah_2000_pac`
*   `sensor.growatt_noah_2000_charging_power`

---

## ⚠️ Wichtige Hinweise
- **Rate Limiting**: Growatt ist streng bei zu vielen Anfragen. Ein Intervall unter 60 Sekunden kann zu temporären Sperren deines Accounts führen.
- **Lokalität**: Dieses Add-on benötigt eine aktive Internetverbindung, da die Daten über die Growatt Cloud (API) abgerufen werden.

---

## 📄 Lizenz
Dieses Projekt ist unter der MIT-Lizenz veröffentlicht. Es steht in keiner offiziellen Verbindung zu Growatt.