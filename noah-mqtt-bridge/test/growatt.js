const { GrowattClient } = require("../src/GrowattClient");
const { MqttHandler } = require("../src/MqttHandler");
const configHandler = require("../src/ConfigHandler");
const { Check } = require("../src/Check");

// Hilfsfunktion für die Pause
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function start() {
  // Konfiguration laden
  const config = configHandler.load();
  let plantId = null;
  let deviceSn = null;
  let eToday = null;
  let intervalID = null;

  // pruefungen
  const checker = new Check();

  // mqtt
  const mqtt = new MqttHandler(config.mqtt_server, {
    username: config.mqtt_user,
    password: config.mqtt_password,
  });

  await mqtt.connect();

  const growatt = new GrowattClient();
  // anmelden

  let success = await growatt.login(config.username, config.password);

  const loop = async () => {
    try {
      // interval stopen
      if (this.intervalID) {
        clearInterval(this.intervalID);
      }
      console.error("Loop ", this.intervalID);

      if (!this.plantId) {
        const plants = await growatt.getPlants();
        this.plantId = checker.checkPlantData(plants);
        console.log("plantId", this.plantId);
      }

      if (this.plantId) {
        const devices = await growatt.getPlantDevices(this.plantId);
        console.log("devices", devices);

        const { sn, eToday } = checker.checkPlantDevices(devices);

        this.deviceSn = sn;
        this.eToday = eToday; // Falls du diesen Wert global speichern willst

        console.log("deviceSn", this.deviceSn, this.eToday);
      }

      if (this.deviceSn && this.plantId) {
        const data = await growatt.getNoahStatusData(
          this.plantId,
          this.deviceSn,
        );
        console.log("data", data);

        /*
        const data2 = await growatt.getNoahTotalData(
          this.deviceSn,
          "2026-05-08",
          "2026-05-08",
        );

        console.log("getNoahTotalData", data2.obj.datas[0]);

        const data3 = await growatt.getNoahList(this.plantId, this.deviceSn);

        console.log("getNoahList", data3);
*/
        const daten = {
          totalBatteryPackSoc: data.obj.totalBatteryPackSoc,
          pac: data.obj.pac,
          ppv: data.obj.ppv,
          totalBatteryPackChargingPower: data.obj.totalBatteryPackChargingPower,
          totalBatteryPackChargingEnergy: this.eToday,
        };

        mqtt.publishState(daten);
      }

      // interval wieder starten
      this.intervalID = setInterval(loop, config.interval * 1000);
    } catch (err) {
      console.error("❌ Fehler:", err.message);
      clearInterval(this.intervalID);

      if (err.message.indexOf("Sitzung ist abgelaufen.") != -1) {

        await wait(60000); // Kurz warten vor Re-Start

        console.warn(
          "Sitzung abgelaufen. Warte 1 min. Beende Prozess für Neustart durch Watchdog...",
        );

        // Prozess hart beenden
        process.exit(1);
      }
    }
  };

  if (success) {
    loop();
  }
}

start();
