# How to use nginx with roomservice and the web frontend

First, run both roomservice and the web frontend. It doesn't matter whether or not these are running in dockerfiles or anything else
for now, just make sure they are running with the default ports.
Then, run `docker build . -t galactusnginx`.
Once the image is done building, run `docker run galactusnginx`

## Running on linux
If you run into issues, try running `docker run --network=host galactusnginx`.
Sometimes docker does not properly link the host networking, so this might be an issue on some linux distributions.
