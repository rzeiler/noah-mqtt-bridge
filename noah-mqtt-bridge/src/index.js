const { GrowattClient } = require("./GrowattClient");
const { MqttHandler } = require("./MqttHandler");
const configHandler = require("./ConfigHandler");
const { Check } = require("./Check");

async function start() {
  // parameter
  let plantId = null;
  let deviceSn = null;
  let intervalID = null;

  // Konfiguration laden
  const config = configHandler.load();

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
      // get plants
      if (!this.plantId) {
        var plants = await growatt.getPlants();
        this.plantId = checker.checkPlantData(plants);
      }

      // get device
      if (!this.deviceSn && this.plantId) {
        const devices = await growatt.getPlantDevices(this.plantId);
        this.deviceSn = checker.checkPlantDevices(devices);
      }

      // get data
      if (this.deviceSn && this.plantId) {
        const data = await growatt.getNoahStatusData(
          this.plantId,
          this.deviceSn,
        );

        // build object
        const daten = {
          totalBatteryPackSoc: data.obj.totalBatteryPackSoc,
          pac: data.obj.pac,
          ppv: data.obj.ppv,
          totalBatteryPackChargingPower: data.obj.totalBatteryPackChargingPower,
        };

        // send object
        mqtt.publishState(daten);
      }
    } catch (err) {
      console.error("❌ Fehler:", err.message);
      clearInterval(this.intervalID);
    }
  };

  if (success) {
    loop();
    this.intervalID = setInterval(loop, config.interval * 1000);
  }
}

start();
