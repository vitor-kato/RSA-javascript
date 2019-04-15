FROM node:10.13-alpine

ENV NODE_ENV production
RUN npm install -g serve

WORKDIR /usr/src/app
COPY dist/ .

EXPOSE 5000
CMD [ "serve" ]