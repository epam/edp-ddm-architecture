## Архітектурна документація

### Інструменти для розробки технічної документації проекту

- [AsciiDoc](https://asciidoc.org/) - мова розмітки з підтримкою структурних та семантичних елементів, яка використовується для формування текстових документів
- [Antora](https://antora.org/) - інструмент структурування текстових AsciiDoc документів за розділами та формування єдиного статичного HTML сайту з технічною документацією на базі _.yml_ плейбука конфігурації

### Інструменти візуалізації технічних аспектів рішення та діаграм
- [PlantUml](https://plantuml.com/) - інструмент з відкритим кодом, який дозволяє описувати UML діаграми, візуалізовувати JSON та YAML у текстовому вигляді за допомогою власного доменного синтаксису
- [Draw.IO](https://draw.io/) - он-лайн інструмент створення діаграм різних типів з можливостями збереження у SVG форматі с підтримкою подальшого редагування

### Шаблон типової документації
- [Шаблон опису типового бекенд-сервісу](https://gitbud.epam.com/mdtu-ddm/general/doc-template)

### Приклади створення PlantUML діаграм
* [Діаграма взаємодії компонентів платформи](/modules/ROOT/partials/infrastructure/ddm-control-plane-components.puml)
* [Діаграма послідовностей по розробці централізованих компонентів платформи та пакету для інсталяції](/modules/ROOT/partials/infrastructure/gitops-main-flow.puml)
* [Діаграма послідовностей встановлення платформи](/modules/ROOT/partials/infrastructure/ddm-platform-install.puml)
* [Діаграма послідовностей створення реэстру за допомогою Control Plane](/modules/ROOT/partials/infrastructure/ddm-registry-creation-details.puml)

### Офіційна документація інструментів  
- [Документація AsciiDoc](https://docs.asciidoctor.org/asciidoc/latest/)
- [Гайд техрайтера AsciiDoc](https://asciidoctor.org/docs/asciidoc-writers-guide/)
- [Документація Antora](https://docs.antora.org/antora/2.0/)

### Автоматизований процес формування та публікації сайту документації
- [Генерація нової версії сайту технічної документації](https://jenkins-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com/view/Documentation/job/ddm-architecture/job/MASTER-Build-ddm-architecture/)
- [Публікація нової версії сайту технічної документації](https://jenkins-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com/view/Documentation/job/documentation-cd-pipeline/job/dev/)
- [Остання версія технічної документації](https://ddm-architecture-mdtu-ddm-edp-cicd-documentation-dev.apps.cicd2.mdtu-ddm.projects.epam.com/mdtuddm/dev/bpms/task-distribution.html)

### Локальне оточення для розробки технічної документації

Для ведення розробки документації, необхідно встановити:
- [IntelliJ IDEA / JetBrains WebStorm](https://www.jetbrains.com/) - інтегроване середовище розробки
- [AsciiDoc JetBrains плагін](https://plugins.jetbrains.com/plugin/7391-asciidoc) - підтримка синтаксису AsciiDoc та попереднього перегляду в IntelliJ IDEA та WebStorm
- [PlantUML Integration IntelliJ IDEA плагін](https://plugins.jetbrains.com/plugin/7017-plantuml-integration) - плагін для розробки діаграм у текстовому вигляді з використанням PlantUML синтаксису та їх попереднього перегляду
- [Antora](https://docs.antora.org/antora/2.3/install/install-antora/) - генератор статичних HTML сайтів шляхом структурування та трансформації AsciiDoc документів 
- (опційно) [Asciidoctor.js Live Preview](https://chrome.google.com/webstore/detail/asciidoctorjs-live-previe/iaalpfgpbocpdfblpnhhgllgbdbchmia) - розширення до браузеру Сhrome для перегляду AsciiDoc документів (файли з розширенням _.adoc_)

### Встановлення Antora

Для встановлення Antora та необхідних розширень виконайте у терміналі ([інструкція інсталяції](https://docs.antora.org/antora/2.3/install/install-antora/)):
```bash
npm i -g @antora/cli @antora/site-generator-default asciidoctor-plantuml
```

Перевірте коректність встановлення:
```bash
antora -v
```

Для надання Antora можливості отримувати доступ до Git репозиторіїв ([інструкція аутентифікації для приватних репозиторіїв](https://docs.antora.org/antora/2.3/playbook/private-repository-auth/)):
```bash
git config --global credential.helper store && \
  echo -n 'Repository URL: ' && read REPLY && \
  git ls-remote -h $REPLY > /dev/null
```

Альтернативним шляхом може бути створення файлу сховища токенів доступу Git _$HOME/.git-credentials_ на базі файлу шаблону _.git-credentials.local_ шляхом копіювання та видалення суфіксу _.local_. Наступним кроком має бути генерація HTTP-пароля у Gerrit та додавання
адреси репозиторію до файлу:
```bash
https://<user_name>:<http_password>@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com
```

Альтернативою може бути додавання переліку необхідних репозиторіїв у вигляді:
```bash
https://<user_name>:<http_password>@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com/<repository_path>
```

### Генерація технічної документації

> **WARNING**: Локально антора може сберегти кеш. Для запобігання помилок рекомендується запускати усі команди з атрибутом --fetch (eg: ```antora site.yml --fetch```)

Генерація статичного HTML сайту документації з використанням останних версій розділів з відповідних репозиторіїв:
```bash
antora site.yml
```

Генерація статичного HTML сайту документації з використанням локальних копій розділів документації (необхідно створити з файлу _site-template.yml_ файл _site-local.yml_ та відкорегувати шляхи до локальних директорій. _site-local.yml_ знаходиться у _.gitignore_):
```bash
antora site-local.yml
```

В обох випадках, сайт технічної документації буде згенеровано у директорію, налаштовану у _.yml_ плейбуці: 
```bash
outpout:
  dir: ./build/site
```

### Перегляд технічної документації

Для перегляду згенерованої документації на локальному оточенні можно використовувати:
- Браузер, встановлений за замовчуванням, шляхом відкриття файлу _./build/site/index.html_ в IntelliJ IDEA (_File > Open In > Browser > Default_)
- Вбудовані можливості перегляду IntelliJ IDEA (_File > Open In > Browser > Built-in Preview_)

### Налаштування швидкого запуску процесу генерації документації в IntelliJ IDEA

Для автоматизації кроку генерації документації, в IntelliJ IDEA можно налаштувати конфігурацію запуску **Shell Script**:
- Викликати з головного меню: _Run > Edit Configurations > Add New Configuration_
- Вибрати тип конфігурації запуску **Shell Script**
- Вказати ім'я **Name: antora-site**
- Вказати тип скприпта **Execute: Shell Script**
- Вказати скрипт **Script text: antora site-local.yml**

Як результат, в IntelliJ IDEA з'явиться додаткова конфігурація запуску для генерації технічної документації через Antora **antora-site**, яку можна використовувати у якості швидкого виклику.
