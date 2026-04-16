#!/usr/bin/env bash

set -euo pipefail

URL="http://localhost:5173"

CYAN='\033[1;36m'
PURPLE='\033[1;35m'
GREEN='\033[1;32m'
RESET='\033[0m'

printf "${PURPLE}========================================${RESET}\n"
printf "${CYAN}Accediendo al núcleo de DevQuest...${RESET}\n"
printf "${GREEN}%s${RESET}\n" "$URL"
printf "${PURPLE}========================================${RESET}\n"

if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 &
else
  printf "${CYAN}No se encontró un comando para abrir el navegador automáticamente.${RESET}\n"
fi
