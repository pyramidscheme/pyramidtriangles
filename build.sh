#!/bin/sh

# Python dependencies
poetry install

# Builds frontend
cd web/frontend
npm install
npm run build
