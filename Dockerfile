FROM node:latest

# copy files
RUN mkdir ./app
COPY ./next-env.d.ts ./app/
COPY ./package.json ./app/
COPY ./yarn.lock ./app/
COPY ./src/ ./app/src/
WORKDIR ./app

# now
RUN yarn
EXPOSE 3000/tcp
CMD ["yarn", "dev"]

