#!/bin/bash 

set -e # Exit immediately if a simple command exits with a nonzero exit value.
set -u # Makes Bash check whether you have initialised all your variables. If you haven't, Bash will throw an error about unbound variables.

# VARIABLES 
# ----------
BASE_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
BASE_NAME=$(basename $BASE_DIR)

cd $BASE_DIR
./node_modules/.bin/webpack --display-modules --display-chunk $@

# Para mudar o ambiente use:
# NODE_ENV=production ./node_modules/.bin/webpack --display-modules --display-chunk
