#!/usr/bin/env bash
#
# Entrypoint
#

npm install -g argparse@1.0.10
. ./build.sh

exec "$@"
