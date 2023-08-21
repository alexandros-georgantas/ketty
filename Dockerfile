FROM node:16.19.0-alpine3.16 as build-stage

RUN apk add --no-cache git make g++

WORKDIR /home/node/ketida

COPY package.json .
COPY yarn.lock .

# Install development node modules for building webpack bundle
RUN yarn install --frozen-lockfile --production=false

# COPY . .
COPY app app
COPY static static


ARG node_env

ENV NODE_ENV='production'
ENV CLIENT_PAGE_TITLE='Ketida'
ENV CLIENT_FAVICON_PATH='../static/ketida.ico'
ENV CLIENT_LANGUAGE='en-US'

RUN yarn coko-client-build


# pull the official nginx:1.23.1 base image
FROM nginx:1.23.1 as serve-stage

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# copies static resources from build stage
COPY --from=build-stage /home/node/ketida/_build /usr/share/nginx/html

COPY scripts/env.sh /usr/share/nginx/html/env.sh
COPY static/env.js /usr/share/nginx/html/env.js
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/gzip.conf /etc/nginx/conf.d/gzip.conf

# RUN chown -R node:node .
# USER node


# containers run nginx with global directives and daemon off
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
