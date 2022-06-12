FROM node:16
ADD . .
RUN npm install
# RUN npm run new_world
RUN npm run start
