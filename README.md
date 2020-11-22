# Galactus Web
Galactus web is the web frontend for the galactus service. It uses a microservice architecture to manage rooms, sync videos, and
keep track of videos in a queue.
The Galactus web interface uses [Next.js](https://nextjs.org/) for the frontend, and client code is generated using
[OpenAPI](https://github.com/OAI/OpenAPI-Specification) specs that are written for two services, [queueservice](https://github.com/galactus-player/queueservice) and [roomservice](https://github.com/galactus-player/roomservice).

## Galactus layout
There are two main pages, one is the room page and the other is the index page.
The index page shows a button to create a new room and a text field for inputting a room code.
New rooms are generated by calls to the roomservice API.
![](https://imgur.com/MZRwCXa)
When the user clicks the "Play or Queue" button, they are brought to the queue interface, where they can add and remove videos to
the watching queue.
![](https://imgur.com/6JA1Xk1)
Once the user is in a room, a video can be played after adding it to the queue.
These operations are done through calls to the queueservice API.
![](https://imgur.com/pp032xq)

# Running Galactus in Docker
In order to run galactus, you need Docker and docker-compose. 
To start up the entire service, run:
```
docker-compose -f docker-compose-dev.yml up
```
Then, the service should be available at `localhost:80`.

# Screenshots
![](https://i.imgur.com/llyiWp8.png)

![](https://i.imgur.com/uoKhdqc.png)

![](https://i.imgur.com/wGmkbPw.png)

![](https://i.imgur.com/dUtzPYD.jpg)
