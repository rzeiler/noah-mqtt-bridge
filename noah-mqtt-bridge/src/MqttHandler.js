const mqtt = require("mqtt");

class MqttHandler {
  constructor(host, options = {}) {
    this.host = host;
    this.options = options;
    this.client = null;
    this.deviceId = "growatt_noah_2000"; // Einzigartige ID für HA
    this.stateTopic = "noah2mqtt/state"; // Hier landen die Live-Daten
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log(`⏳ Verbinde mit MQTT Broker: ${this.host}...`);
      this.client = mqtt.connect(this.host, this.options);

      this.client.on("connect", async () => {
        console.log("✅ MQTT erfolgreich verbunden!");
        try {
          // Sobald die Verbindung steht, melden wir die Sensoren bei HA an
          await this.announceDevice();
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });

      this.client.on("error", (err) => {
        console.error("❌ MQTT Verbindungsfehler:", err.message);
        reject(err);
      });
    });
  }

  async announceDevice() {
    // Gemeinsame Geräte-Definition (wichtig für die Gruppierung in HA)
    const deviceDefinition = {
      identifiers: [this.deviceId],
      name: "Growatt Noah 2000",
      model: "Noah 2000",
      manufacturer: "Growatt",
      sw_version: "1.0.0",
    };

    // Liste aller Sensoren, die wir in HA sehen wollen
    const sensors = [
      {
        id: "soc",
        name: "Batterie SOC",
        key: "totalBatteryPackSoc",
        unit: "%",
        device_class: "battery",
        state_class: "measurement",
      },
      {
        id: "pac",
        name: "Ausgangsleistung (AC)",
        key: "pac",
        unit: "W",
        device_class: "power",
        state_class: "measurement",
      },
      {
        id: "ppv",
        name: "PV Eingangsleistung",
        key: "ppv",
        unit: "W",
        device_class: "power",
        state_class: "measurement",
      },
      {
        id: "charging_power",
        name: "Batterieladeleistung",
        key: "totalBatteryPackChargingPower",
        unit: "W",
        device_class: "power",
        state_class: "measurement",
      },
      {
        id: "total_charging_energy",
        name: "Batterieladung Heute",
        key: "totalBatteryPackChargingEnergy", // Hier muss der Key aus der API rein (eToday)
        unit: "kWh",
        device_class: "energy",
        state_class: "total_increasing",
      },
    ];

    // Schleife durch alle Sensoren, um das jeweilige Config-Topic zu bespielen
    for (const sensor of sensors) {
      const configTopic = `homeassistant/sensor/${this.deviceId}/${sensor.id}/config`;

      const configPayload = {
        name: sensor.name,
        unique_id: `${this.deviceId}_${sensor.id}`,
        state_topic: this.stateTopic,
        value_template: `{{ value_json.${sensor.key} }}`,
        unit_of_measurement: sensor.unit,
        device_class: sensor.device_class,
        state_class: sensor.state_class,
        device: deviceDefinition,
      };

      // Mit 'retain: true' merkt sich der Broker die Konfiguration dauerhaft
      this.client.publish(configTopic, JSON.stringify(configPayload), {
        retain: true,
        qos: 1,
      });
    }

    console.log(
      "📢 MQTT Discovery: Alle 4 Sensoren erfolgreich an Home Assistant übermittelt.",
    );
  }

  // Funktion zum Senden der echten Live-Daten
  publishState(data) {
    if (this.client && this.client.connected) {
      // JS-Objekt zwingend in einen String umwandeln!
      const payload = JSON.stringify(data);
      this.client.publish(this.stateTopic, payload, { qos: 1 });
      console.log("⚡ Live-Daten an MQTT gesendet:", payload);
    } else {
      console.log("⚠️ Senden fehlgeschlagen: MQTT-Client ist offline.");
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = { MqttHandler };
