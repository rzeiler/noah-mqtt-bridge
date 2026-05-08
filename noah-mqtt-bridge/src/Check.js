class Check {
  /**
   * Prüft die Antwort der Geräteliste (typischerweise für den Noah 2000)
   * Erwartet die komplette API-Response
   */
  checkPlantDevices(response) {
    if (!response || typeof response !== "object") {
        throw new Error(`API Antwort ist kein gültiges Objekt. Result ist ${response}`);
    }

    if (response.result !== 1) {
        // Oft result: -1 wenn Session abgelaufen oder result: 0 bei Fehlern
        throw new Error(`API Fehler: Result ist ${response.result}. Eventuell Session abgelaufen?`);
    }

    const obj = response.obj;
    if (!obj || typeof obj !== "object") {
        throw new Error(`API Antwort enthält kein gültiges Daten-Objekt (obj). Result ist ${response}`);
    }

    if (!Array.isArray(obj.datas) || obj.datas.length < 1) {
        throw new Error(`Keine Geräte (datas) in der Liste gefunden. Result ist ${response}`);
    }

    const firstDevice = obj.datas[0];
    if (!firstDevice.sn) {
        throw new Error(`Das gefundene Gerät hat keine gültige Seriennummer (sn). Result ist ${response}`);
    }

    // Alles okay, wir geben die SN zurück
    return firstDevice.sn;
  }

  /**
   * Prüft die Liste der Anlagen (Plants)
   * Erwartet das Array aus response.obj.datas
   */
  checkPlantData(response) {
    if (!Array.isArray(response)) {
      throw new Error(`Anlagendaten sind kein Array. Result ist ${response}`);
    }

    if (response.length === 0) {
      throw new Error(`Die Liste der Anlagen ist leer. Result ist ${response}`);
    }

    if (!response[0].id) {
      throw new Error(`Die erste Anlage im Profil hat keine gültige ID. Result ist ${response}`);
    }

    // Alles okay, wir geben die ID zurück
    return response[0].id;
  }
}

module.exports = { Check };