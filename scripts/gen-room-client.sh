#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "No arguments supplied, please supply either localhost or a valid service hostname"
    exit
fi

export OPENAPI_YML=https://raw.githubusercontent.com/Galactus-Player/roomservice/main/api/openapi.yaml
export HOST_OPENAPI_YML=scripts/host_openapi_room.yml
curl $OPENAPI_YML > openapi_room.yml
yq write openapi_room.yml "servers[*].url" "http://$1/api" > ./host_openapi_room.yml

docker run --rm -v "${PWD}/../:/local" openapitools/openapi-generator-cli generate -i /local/$HOST_OPENAPI_YML -g typescript-fetch --output /local/src/api/room
