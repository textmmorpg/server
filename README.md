# Project Title Here
MMO text adventure using socket.io and mongodb

### Setup

Install javascript dependencies
```
npm install
```

Setup mongodb tables (I'm using MongoDB server version: 4.4.13)
```
mongod
use project_title_here_db // creation db if it doesn't exist
db.createCollection('user') // create user db
db.createCollection('world') // create environment db
```

Create a user (Incase signup autoincrement isn't working)
```
db.user.insert({"user_id":1,"username":"test","password":"test","x":0,"y":0,"angle":0,"socket_id":null})
```

Generate world
```
cd server
node world_generator.js
```

### Running the server

```
cd server
node main.js
```

### Running the client

```
node client.js
```
