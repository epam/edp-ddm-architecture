FROM nexus-docker-registry.apps.cicd2.mdtu-ddm.projects.epam.com/node:16 AS builder
USER root
WORKDIR /antora
COPY --chown=node:node . /antora
USER node
ARG GIT_USERNAME
ARG GIT_TOKEN
ENV GIT_CREDENTIALS=https://$GIT_USERNAME:$GIT_TOKEN@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com
RUN npm install

FROM nexus-docker-registry.apps.cicd2.mdtu-ddm.projects.epam.com/nginx:1.23.3 as runner
COPY --from=builder /antora/antora.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /antora/output /usr/share/nginx/html
