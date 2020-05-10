#!/bin/bash

if ! hash poetry
then
  echo "Installing poetry"
  curl -fsSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
fi

echo "Installing python dependencies with poetry"
poetry install

# Builds frontend
cd js/frontend
npm install
npm run build
