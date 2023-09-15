FROM nexus-docker-registry.apps.cicd2.mdtu-ddm.projects.epam.com/node:16 AS builder
USER root
WORKDIR /antora
RUN chown -R node:node /antora
ARG GIT_USERNAME
ARG GIT_TOKEN
ENV GIT_CREDENTIALS=https://$GIT_USERNAME:$GIT_TOKEN@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com
RUN git clone https://$GIT_USERNAME:$GIT_TOKEN@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com/mdtu-ddm/general/ddm-architecture
WORKDIR /antora/ddm-architecture
RUN chown -R node:node /antora/ddm-architecture
USER node
RUN npm install

FROM nexus-docker-registry.apps.cicd2.mdtu-ddm.projects.epam.com/nginx:1.23.3 as runner
COPY --from=builder /antora/ddm-architecture/antora.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /antora/ddm-architecture/output /usr/share/nginx/html
