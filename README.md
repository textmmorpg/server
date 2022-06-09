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

Create a user (Incase signup autoincrement isn't working)
```
db.user.insert({"user_id":1,"username":"test","password":"test","x":0,"y":0,"angle":0,"posture":"standing","energy":1,"last_cmd_ts":$currentDate,"socket_id":null})
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
npm run start
```
And then navigate to https://localhost:3000

Or open the `client/index.html` file directly
