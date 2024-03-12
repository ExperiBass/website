#!/bin/bash
set -eu

hash=$(git rev-parse HEAD | head -c 7)

mkdir -pv "../$hash"
cp -rv ./* "../$hash"