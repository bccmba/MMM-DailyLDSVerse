#!/bin/bash

# Setup script to generate verse lists from LDS Documentation Project data
# This script should be run once to generate the verse list files

echo "============================================================"
echo "MMM-DailyLDSVerse - Verse List Setup"
echo "============================================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js (v14 or higher) and try again"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo ""

# Check if input file is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-verse-lists.sh <path-to-lds-scriptures-json.txt>"
    echo ""
    echo "Example:"
    echo "  ./setup-verse-lists.sh ~/Downloads/lds-scriptures-2020.12.08/json/lds-scriptures-json.txt"
    echo ""
    echo "Or if you have the file in the current directory:"
    echo "  ./setup-verse-lists.sh lds-scriptures-json.txt"
    echo ""
    exit 1
fi

INPUT_FILE="$1"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not found: $INPUT_FILE"
    echo ""
    echo "Please download the LDS scriptures data from:"
    echo "  https://scriptures.nephi.org"
    echo ""
    echo "The file should be: lds-scriptures-json.txt"
    echo "Located in: <download-dir>/json/lds-scriptures-json.txt"
    exit 1
fi

echo "Input file: $INPUT_FILE"
echo "Output directory: verses/"
echo ""

# Ensure verses directory exists
mkdir -p verses

# Run conversion
echo "Converting data..."
node convert-lds-data.js "$INPUT_FILE" verses/

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Verse lists generated successfully!"
    echo ""
    echo "Generated files:"
    ls -lh verses/*.json
    echo ""
    echo "You can now use the module in Magic Mirror!"
else
    echo ""
    echo "✗ Conversion failed. Please check the error messages above."
    exit 1
fi

