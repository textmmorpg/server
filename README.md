# Project Title Here
MMO text adventure game using socket.io and mongodb

### Setup

Install javascript dependencies
```
npm install
```

Setup mongodb tables (I'm using MongoDB server version: 4.4.13)
```
mongod
use project_title_here_db // create db if it doesn't exist
db.createCollection('user') // create user collection
db.createCollection('world') // create environment collection
```

Generate world
```
npm run new_world
```

### Running the server and exposing the client

```
npm run start
```

### Using the client

Navigate to https://localhost:3000

For details on gameplay, view the github wiki: https://github.com/beefy/project_title_here/wiki

### Deployment (automation is a WIP)

```
docker build -t textmmo .
docker tag textmmo us-central1-docker.pkg.dev/project-title-here/textmmo/textmmo-image
docker push us-central1-docker.pkg.dev/project-title-here/textmmo/textmmo-image
```
