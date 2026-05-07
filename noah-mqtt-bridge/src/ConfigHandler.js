const fs = require("fs");
const path = require("path");

class ConfigHandler {
  constructor() {
    this.config = {};
  }

  load() {
    const haOptionsPath = "/data/options.json";
    // Wir schauen im Hauptverzeichnis des Projekts nach der Datei
    const localConfigPath = path.join(process.cwd(), "options.json");

    let rawData;

    // 1. Versuch: Home Assistant Add-on Pfad
    if (fs.existsSync(haOptionsPath)) {
      console.log("🚀 Lade HA-Konfiguration...");
      rawData = fs.readFileSync(haOptionsPath, "utf8");
    } 
    // 2. Versuch: Lokale Datei
    else if (fs.existsSync(localConfigPath)) {
      console.log("🏠 Lade lokale Test-Konfiguration...");
      rawData = fs.readFileSync(localConfigPath, "utf8");
    } 
    else {
      console.error("‼️ Keine Konfiguration gefunden! (Weder /data/options.json noch ./options.json)");
      process.exit(1);
    }

    try {
      this.config = JSON.parse(rawData);
      this.validate();
      return this.config;
    } catch (err) {
      console.error("❌ Fehler beim Parsen der JSON-Datei:", err.message);
      process.exit(1);
    }
  }

  // Kleine Hilfsfunktion, um sicherzustellen, dass wichtige Felder da sind
  validate() {
    const required = ["username", "password", "mqtt_server"];
    required.forEach(field => {
      if (!this.config[field]) {
        console.warn(`⚠️ Warnung: Feld '${field}' fehlt in der Konfiguration!`);
      }
    });
  }
}

module.exports = new ConfigHandler(); // Wir exportieren eine Instanz (Singleton)