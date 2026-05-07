const { GrowattClient } = require("./GrowattClient");
const { MqttHandler } = require("./MqttHandler");
const configHandler = require("./ConfigHandler");

async function start() {
  // Konfiguration laden
  const config = configHandler.load();

  const mqtt = new MqttHandler(config.mqtt_server, {
    username: config.mqtt_user,
    password: config.mqtt_password,
  });

  await mqtt.connect();

  const growatt = new GrowattClient();
  const success = await growatt.login(config.username, config.password);

  const loop = async () => {
    try {

      var plants = await growatt.getPlants();

      const plant = plants.data ? plants.data[0] : plants[0];

      const devices = await growatt.getPlantDevices(plant.id);

      const device = devices.obj.datas[0];

      const data = await growatt.getNoahStatusData(plant.id, device.sn);

      const daten = {
        totalBatteryPackSoc: data.obj.totalBatteryPackSoc,
        pac: data.obj.pac,
        ppv: data.obj.ppv,
        totalBatteryPackChargingPower: data.obj.totalBatteryPackChargingPower,
      };

      mqtt.publishState(daten);
    } catch (err) {
      console.error("❌ Fehler:", err.message);
    }
  };

  if (success) {
    loop();
    setInterval(loop, config.interval * 1000);
  }
}

start();
