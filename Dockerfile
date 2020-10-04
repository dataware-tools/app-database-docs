# syntax=docker/dockerfile:1.0.0-experimental
FROM node:14.11.0-stretch as BUILD_STAGE
SHELL ["/bin/bash", "-c"]
ENV LANG="en_US.UTF-8"

# Copy files
RUN mkdir -p /opt/app
COPY ./packag*.json /opt/app/
WORKDIR /opt/app

# Install dependency
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh yarn install --network-concurrency 1

# Copy other files
COPY ./src /opt/app/src
COPY ./public /opt/app/public
COPY ./craco.config.js /opt/app/
COPY ./tsconfig.json /opt/app/

# Build app
RUN npm run build


#
# Second stage
#
FROM node:14.11.0-stretch-slim

# Install server
RUN npm install -g serve

# Copy files
RUN mkdir -p /opt/app
COPY --from=BUILD_STAGE /opt/app/build /opt/app/build
COPY ./public /opt/app/public
WORKDIR /opt/app

# Set default command
CMD ["serve", "build", "-s", "-l", "3000"]
