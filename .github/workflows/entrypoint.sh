#!/bin/sh

set -x
set -e

npm run-script migrate:deploy
npm run-script start
