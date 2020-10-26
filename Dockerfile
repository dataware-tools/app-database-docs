# syntax=docker/dockerfile:1.0.0-experimental
FROM node:14.11.0-stretch AS build-stage
SHELL ["bash", "-c"]

COPY ./package.json /opt/package.json
WORKDIR /opt
RUN npm install -g argparse@1.0.10

COPY ./docs /opt/docs
COPY ./scripts /opt/scripts

# Get contents and build
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh git clone git@github.com:TakedaLab/closed-database-docs.git /opt/docs/contents
RUN ./scripts/build.sh

CMD ["bash"]

#
# Second stage
#
FROM node:14.11.0-stretch
EXPOSE 3000/tcp
RUN npm install -g serve@^11.3.2

COPY --from=build-stage /opt/docs /opt/docs

CMD ["serve", "/opt/docs", "-l", "3000"]
