#!/bin/bash

source .env

# Build the Frontend
pushd frontend
npm run build
popd

# Sync
rsync -rv \
    --exclude=expenditures.sqlite \
    --exclude=node_modules/* \
    --exclude=.*/* \
    --exclude=__*/* \
    ./ "$DEPLOY_HOST:$DEPLOY_PATH"
