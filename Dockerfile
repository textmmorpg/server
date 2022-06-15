FROM node:16
WORKDIR /app
# RUN printenv > .env
COPY . /app
RUN npm install
EXPOSE 3000
# CMD npm run new_world
CMD npm run start
