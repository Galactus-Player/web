#!/bin/bash

export OPENAPI_YML=https://raw.githubusercontent.com/Galactus-Player/roomservice/main/api/openapi.yaml

openapi-generator-cli generate --enable-post-process-file -i $OPENAPI_YML -g typescript-fetch
