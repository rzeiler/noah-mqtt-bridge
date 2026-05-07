#!/bin/sh

# Falls du Bashio nutzt (Standard in HA Add-ons), kannst du hier 
# super einfach Debug-Infos ausgeben
echo "🚀 Noah MQTT Bridge wird gestartet..."

# Hier starten wir dein Node.js Programm
# Wir nutzen 'exec', damit Node.js die Prozess-ID 1 übernimmt 
# (wichtig für das korrekte Stoppen des Add-ons)
exec node /app/src/index.js