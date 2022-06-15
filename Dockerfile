FROM node:16
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
RUN printenv > .env
# CMD npm run new_world
CMD npm run start
