#!/bin/bash
# Run this once from the project root to download fonts for Satori
# Usage: bash scripts/get-fonts.sh

mkdir -p public/fonts

echo "Downloading Cormorant Garamond Light..."
curl -L "https://github.com/googlefonts/cormorant/raw/main/fonts/ttf/Cormorant-Light.ttf" \
  -o public/fonts/Cormorant-Light.ttf

echo "Downloading JetBrains Mono Regular..."
curl -L "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf" \
  -o public/fonts/JetBrainsMono-Regular.ttf

echo "Done. Fonts saved in public/fonts/"
