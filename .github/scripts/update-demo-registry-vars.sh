#!/bin/bash

find ./github-pages -name '*.html' -exec sed -i "s/{{{registry-name}}}/demo-registry/g" {} \;
find ./github-pages -name '*.html' -exec sed -i "s/{{{stage-name}}}/main/g" {} \;
find ./github-pages -name '*.html' -exec sed -i "s/{{{cluster-name}}}/cluster-name/g" {} \;
find ./github-pages -name '*.html' -exec sed -i "s/{{{dns-wildcard}}}/domain.com/g" {} \;
