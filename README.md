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

Or open the `client/index.html` file directly
