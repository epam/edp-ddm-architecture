FROM nexus-docker-registry.apps.cicd2.mdtu-ddm.projects.epam.com/nginx:1.23.3
COPY build/site /usr/share/nginx/html