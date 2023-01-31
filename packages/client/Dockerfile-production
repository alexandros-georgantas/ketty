FROM node:16.19.0-alpine3.16 as build-stage

RUN apk add --no-cache git make g++

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .

# Install development node modules for building webpack bundle
RUN yarn install --frozen-lockfile --production=false

COPY . .

ARG node_env
ARG server_protocol
ARG server_host
ARG server_port
ARG client_ws_min_timeout
ARG client_ws_timeout
ARG feature_book_structure
ARG feature_upload_docx_files
ARG locks_ws_url

ENV NODE_ENV=$node_env
ENV SERVER_PROTOCOL=$server_protocol
ENV SERVER_HOST=$server_host
ENV SERVER_PORT=$server_port
ENV CLIENT_WS_MIN_TIMEOUT=$client_ws_min_timeout
ENV CLIENT_WS_TIMEOUT=$client_ws_timeout
ENV FEATURE_BOOK_STRUCTURE=$feature_book_structure
ENV FEATURE_UPLOAD_DOCX_FILES=$feature_upload_docx_files
ENV LOCKS_WS_URL=$locks_ws_url

RUN yarn pubsweet build

# pull the official nginx:1.23.1 base image
FROM nginx:1.23.1 as serve-stage

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# copies static resources from build stage
COPY --from=build-stage /home/node/app/_build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
