# TextMMO
MMO text adventure game using socket.io and mongodb

### Setup

Install javascript dependencies
```
npm install
```

Setup mongodb tables
```
node server/scripts/run_migration.js init up DEV
```

Generate world
```
npm run new_world_dev
```

### Running the server and exposing the client

```
npm run start
```

### Using the client

Navigate to https://localhost:3000

For details on gameplay, view the github wiki: https://github.com/beefy/project_title_here/wiki

### Manual Deployment (also happens automatically on merging to the main branch)

```
docker build -t textmmo .
docker tag textmmo us-central1-docker.pkg.dev/project-title-here/textmmo/textmmo-image
docker push us-central1-docker.pkg.dev/project-title-here/textmmo/textmmo-image
```
