#!/bin/bash
set -eu

hash=$(git rev-parse HEAD | head -c 7)

mkdir -pv "./.out/$hash"
cp -rv ./* ./.well-known "./.out/$hash"