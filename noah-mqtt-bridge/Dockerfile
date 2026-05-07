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

# 4. Der wichtigste Teil: Den Startbefehl explizit als Shell-Ausführung deklarieren
# Das verhindert, dass Node versucht, die .sh Datei zu fressen
ENTRYPOINT [ "/usr/bin/env" ]
CMD [ "/app/run.sh" ]