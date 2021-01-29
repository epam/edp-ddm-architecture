# Архітектурні діаграми
В даному репозиторію зеберігаються усі важливі діаграми в [PlantUml](https://plantuml.com/) форматі 

##Як переглядати діаграми:
Є декілька варіантів:
* [Plugin Chrome](https://chrome.google.com/webstore/detail/plantuml-viewer/legbfeljfbjgfifnkmpoajgpgejojooj?hl=ru)
* [Plugin Idea](https://plugins.jetbrains.com/plugin/7017-plantuml-integration)
* [Remote server](http://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000)

##Наявні діаграми:
* [Діаграма взаємодії компонентів платформи](/modules/ROOT/partials/infrastructure/ddm-control-plane-components.puml)
* [Діаграма послідовностей по розробці централізованих компонентів платформи та пакету для інсталяції](/modules/ROOT/partials/infrastructure/gitops-main-flow.puml)
* [Діаграма послідовностей встановлення платформи](/modules/ROOT/partials/infrastructure/ddm-platform-install.puml)
* [Діаграма послідовностей створення реэстру за допомогою Control Plane](/modules/ROOT/partials/infrastructure/ddm-registry-creation-details.puml)

# Antora

Інсталяція 

```bash
npm i -g @antora/cli @antora/site-generator-default asciidoctor-plantuml
```

Аутентифікація для приватних репозиторіїв 

```bash
git config --global credential.helper store && \
  echo -n 'Repository URL: ' && read REPLY && \
  git ls-remote -h $REPLY > /dev/null
```

Генерація сайту документації
```bash
antora site.yml
```

Див. офіційну документацію [інсталяція](https://docs.antora.org/antora/2.3/install/install-antora/) та [аутентифікація для приватних репозиторіїв](https://docs.antora.org/antora/2.3/playbook/private-repository-auth/)