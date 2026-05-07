FROM node:20-alpine

# HA Add-ons nutzen oft Bashio für einfacheres Logging
RUN apk add --no-cache jq

WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --production

# Quellcode und Start-Skript kopieren
COPY . .

# Sicherstellen, dass die Datei im Root von /app liegt und ausführbar ist
RUN mv /app/noah-mqtt-bridge/run.sh /app/run.sh || true
RUN chmod a+x /app/run.sh

# Wir starten jetzt über die run.sh statt direkt über node
CMD [ "/app/run.sh" ]