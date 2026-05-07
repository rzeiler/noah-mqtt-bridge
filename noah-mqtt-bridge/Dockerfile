FROM node:20-alpine

# HA Add-ons nutzen oft Bashio für einfacheres Logging
RUN apk add --no-cache jq

WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --production

# Quellcode und Start-Skript kopieren
COPY . .

# Berechtigungen für das Start-Skript setzen
RUN chmod a+x /app/run.sh

# Wir starten jetzt über die run.sh statt direkt über node
CMD [ "./run.sh" ]