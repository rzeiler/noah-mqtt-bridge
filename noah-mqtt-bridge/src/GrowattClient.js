const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");

class GrowattClient {
  constructor() {
    this.cookiePath = path.join("./", "cookies.json");
    this.jar = new CookieJar();
    this.client = wrapper(
      axios.create({
        jar: this.jar,
        /*baseURL: "https://server.growatt.com",*/
        baseURL: "https://openapi.growatt.com",
        withCredentials: true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    );
  }

  // Speichert den aktuellen Jar in eine Datei
  saveCookies() {
    const cookies = this.jar.serializeSync();
    fs.writeFileSync(this.cookiePath, JSON.stringify(cookies));
    console.log("💾 Cookies wurden gespeichert.");
  }

  // Lädt Cookies aus der Datei
  loadCookies() {
    if (fs.existsSync(this.cookiePath)) {
      const data = fs.readFileSync(this.cookiePath, "utf-8");
      this.jar = CookieJar.fromJSON(data);
      console.log("📂 Cookies wurden aus Datei geladen.");
    }
  }

  async login(user, pass) {
    // Erst prüfen, ob wir evtl. schon eingeloggt sind
    const alreadyLoggedIn = await this.checkSession();
    if (alreadyLoggedIn) {
      console.log("✅ Session ist noch gültig, kein Login nötig.");
      return true;
    }

    const params = new URLSearchParams();
    params.append("account", user);
    params.append("password", pass);
    params.append("validateCode", "");

    try {
      const response = await this.client.post("/login", params.toString());
      const success =
        response.data &&
        (response.data.result === 1 || response.status === 200);

      if (success) {
        this.saveCookies(); // Bei Erfolg speichern
      }
      return success;
    } catch (err) {
      console.error("Login-Fehler:", err.message);
      return false;
    }
  }

  // Hilfsfunktion: Testet, ob die aktuelle Session noch lebt
  async checkSession() {
    try {
      const data = this.getPlants();
      const indexOf = data.indexOf(
        '<a href="/login" target="_top" id="login">Login Page</a>',
      );
      if (indexOf > 200) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }

  async getPlants() {
    const response = await this.client.get("/index/getPlantListTitle");
    return response.data;
  }

  async getPlantDevices(plantId) {
    const params = new URLSearchParams();
    params.append("plantId", plantId);
    params.append("currPage", 1);
    const response = await this.client.post(
      "/panel/getDevicesByPlantList",
      params.toString(),
    );
    return response.data;
  }

  async getNoahList(plantId) {
    const params = new URLSearchParams();
    params.append("plantId", plantId);
    params.append("currPage", 1);
    const response = await this.client.post(
      "/device/getNoahList",
      params.toString(),
    );
    return response.data;
  }

  async getNoahList(plantId, serial) {
    const params = new URLSearchParams();
    params.append("plantId", plantId);
    params.append("deviceSn", serial);
    params.append("currPage", 1);
    const response = await this.client.post(
      "/device/getNoahList",
      params.toString(),
    );
    return response.data;
  }

  async getNoahStatusData(plantId, serial) {
    const params = new URLSearchParams();
    params.append("deviceSn", serial);
    const response = await this.client.post(
      `/panel/noah/getNoahStatusData?plantId=${plantId}`,
      params.toString(),
    );
    return response.data;
  }

  async getNoahTotalData(plantId, serial) {
    const params = new URLSearchParams();
    params.append("deviceSn", serial);
    const response = await this.client.post(
      `/panel/noah/getNoahTotalData?plantId=${plantId}`,
      params.toString(),
    );
    return response.data;
  }

  async getNoahTotalData(serial, startDate, endDate) {
    const params = new URLSearchParams();
    params.append("deviceSn", serial);
    params.append("start", "0");
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    const response = await this.client.post(
      `/device/getNoahHistory`,
      params.toString(),
    );
    return response.data;
  }

  async getNoahInfoBySn(serial) {
    const params = new URLSearchParams();
    params.append("deviceSn", serial);
    const response = await this.client.post(
      `/noahDeviceApi/noah/getNoahInfoBySn`,
      params.toString(),
    );
    return response.data;
  }
}

module.exports = { GrowattClient };
