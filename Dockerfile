FROM docker-registry.nexus.svc:5005/node:16 AS builder
USER root
WORKDIR /antora
COPY --chown=node:node . /antora
USER node
ARG GIT_USERNAME
ARG GIT_TOKEN
ARG GIT_HOST
ENV GIT_CREDENTIALS=https://$GIT_USERNAME:$GIT_TOKEN@$GIT_HOST
RUN npm install

FROM docker-registry.nexus.svc:5005/nginx:1.23.3 as runner
COPY --from=builder /antora/antora.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /antora/output /usr/share/nginx/html
