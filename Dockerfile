FROM node:16
ADD . .
RUN npm install
EXPOSE 3000
# RUN npm run new_world
CMD ["npm", "run", "start"]
