const { GrowattClient } = require("../src/GrowattClient");
const { MqttHandler } = require("../src/MqttHandler");
const configHandler = require("../src/ConfigHandler");
const { Check } = require("../src/Check");

async function start() {
  // Konfiguration laden
  const config = configHandler.load();
  let plantId = null;
  let deviceSn = null;
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
  const success = await growatt.login(config.username, config.password);

  const loop = async () => {
    try {
      if (!this.plantId) {
        var plants = await growatt.getPlants();
        this.plantId = checker.checkPlantData(plants);
        console.log("plantId", this.plantId);
      }

      if (!this.deviceSn && this.plantId) {
        const devices = await growatt.getPlantDevices(this.plantId);
        console.log("devices", devices);
        this.deviceSn = checker.checkPlantDevices(devices);
        console.log("deviceSn", this.deviceSn);
      }

      if (this.deviceSn && this.plantId) {
        const data = await growatt.getNoahStatusData(
          this.plantId,
          this.deviceSn,
        );

        console.log("data", data);

        const daten = {
          totalBatteryPackSoc: data.obj.totalBatteryPackSoc,
          pac: data.obj.pac,
          ppv: data.obj.ppv,
          totalBatteryPackChargingPower: data.obj.totalBatteryPackChargingPower,
        };

        mqtt.publishState(daten);

        clearInterval(this.intervalID);
      }
    } catch (err) {
      console.error("❌ Fehler:", err.message);
      clearInterval(this.intervalID);
      mqtt.disconnect();
    }
  };

  if (success) {
    loop();
    this.intervalID = setInterval(loop, config.interval * 1000);
  }
}

start();
