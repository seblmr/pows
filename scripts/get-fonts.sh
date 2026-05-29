#!/bin/bash
set -e

mkdir -p public/fonts

echo "Downloading Cormorant Light..."
curl -fL \
  "https://raw.githubusercontent.com/googlefonts/cormorant/main/fonts/ttf/Cormorant-Light.ttf" \
  -o public/fonts/Cormorant-Light.ttf

echo "Downloading JetBrains Mono Regular..."
curl -fL \
  "https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/JetBrainsMono-Regular.ttf" \
  -o public/fonts/JetBrainsMono-Regular.ttf

echo "Verifying fonts..."
file public/fonts/Cormorant-Light.ttf
file public/fonts/JetBrainsMono-Regular.ttf

echo "Done."
