# Developing and maintaining technical product documentation

## Description of tools

The development of documentation is conducted using the following tools:

- [AsciiDoc](https://asciidoc.org/) - A markup language supporting structural and semantic elements for creating text documents.
- [PlantUml](https://plantuml.com/) - An open-source tool for describing UML diagrams and visualizing `JSON` and `YAML` in text form.
- [Draw.IO](https://draw.io/) - An online tool for creating various types of diagrams, with the ability to save in `SVG` format.

For structuring text `AsciiDoc` documents and creating a unified static HTML site, [Antora](https://antora.org/) is used, based on _.yml_ playbook configurations.

### Official documentation of tools

- [AsciiDoc Documentation](https://docs.asciidoctor.org/asciidoc/latest/)
- [AsciiDoc Technical Writer's Guide](https://asciidoctor.org/docs/asciidoc-writers-guide/)
- [Antora Documentation](https://docs.antora.org/antora/2.0/)

### Local environment for developing technical documentation

Necessary tools for development:
- [IntelliJ IDEA / JetBrains WebStorm](https://www.jetbrains.com/): An integrated development environment.
- [AsciiDoc JetBrains Plugin](https://plugins.jetbrains.com/plugin/7391-asciidoc): A plugin for `AsciiDoc` syntax support.
- [PlantUML Integration](https://plugins.jetbrains.com/plugin/7017-plantuml-integration): For developing diagrams with `PlantUML` syntax.
- [Asciidoctor.js Live Preview](https://chrome.google.com/webstore/detail/asciidoctorjs-live-previe/iaalpfgpbocpdfblpnhhgllgbdbchmia): A **Chrome** extension for viewing `AsciiDoc` documents through a web browser.

## Viewing technical documentation through IntelliJ IDEA

IntelliJ IDEA provides several ways for local viewing of technical documentation. Here's how you can utilize these options:

### Using the built-in AsciiDoc toolbar

You can use the built-in toolbar above the documentation development window in an open AsciiDoc (`.adoc`) file. Here, you will find options for real-time documentation preview mode:

1. **Show Editor and Preview**:
    - This option lets you see both the code editor and the preview window simultaneously.
    - You can edit the documentation in the editor and immediately see the results of these changes in the preview window.
    - This is useful for quickly verifying changes, ensuring an efficient editing process.

2. **Show Preview Only**:
    - This mode provides only the preview window without the code editor.
    - It's ideal for focusing on the final appearance of the documentation, especially when you need to check the overall format and layout of elements.
    - You can easily switch to **Show Editor and Preview** mode if you need to make changes.

### Viewing options in the top right corner of the development window

You can also use the viewing options located in the top right corner of the development window:

1. **Built-In Preview**:
    - Opens the built-in preview window directly in the IntelliJ IDEA development environment.
    - This is convenient for quick viewing and editing.

2. **View in external browser**:
    - **Chrome**: If Chrome is installed, select this option to open a tab with the documentation in the browser.
    - **Firefox**: Similarly, select Firefox for viewing in this browser.
    - **Edge**: If you use Edge, choose this option.

> 💡 **TIP:** You can also open the desired viewing option by pressing the key combination `Alt+F2` > `Preview File in...`.

These IntelliJ IDEA features allow flexible work with technical documentation, providing various viewing options to meet the needs of developers and technical writers.

## Building Antora in a local environment

You can build the overall structure of the documentation using Antora in a local environment.

### Installing Antora

> 📝 **NOTE:** Complete installation instructions for Antora can be found at [this link](https://docs.antora.org/antora/latest/install/install-antora/).

1. Check if Antora is installed:

    ```bash
    antora -v
    ```

2. Install **Node**.

   To check if **Node** is installed and its version, execute the following command:

    ```bash
    node --version
    ```

#### Installing Node on Linux

- Install Node on Linux using the command:

    ```bash
    nvm install --lts
    ```
- See detailed instructions [at this link](https://docs.antora.org/antora/latest/install/linux-requirements/).

  > 💡 **TIP:** Linux users are invited to share their comments and supplement important information missing in this brief guide or the complete documentation.

#### Installing Node on macOS

- Install Node on macOS using the command:

    ```bash
    nvm install --lts
    ```

* View detailed instructions [at this link](https://docs.antora.org/antora/latest/install/macos-requirements/).

  > 💡 **TIP:** macOS users are invited to share their comments and supplement important information missing in this brief guide or the complete documentation.

#### Installing Node on Windows

For installing Node on Windows, follow these steps:

1. **Install [Chocolatey](https://chocolatey.org/):**
    - Open **PowerShell** as an administrator.
    - Execute the command:

      ```powershell
      Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
      ```

2. **Install nvm:**
    - Use the same **PowerShell** window as an administrator.
    - Execute the command:

      ```powershell
      choco install -y nvm
      ```

3. **Install Node:**
    - Open a new **PowerShell** window.
    - Execute the command:

      ```powershell
      nvm install 16.20.2
      ```

   > 🔑 **IMPORTANT:** Specify the exact version of Node for Windows (e.g., `16.20.2`) if you encounter an issue [nvm-windows#214](https://github.com/coreybutler/nvm-windows/issues/214).

   > 📝 **NOTE:** If Node is not installed after running the `nvm install` command, try installing Node through **Chocolatey** using the command:
   >
   > ```bash
    > choco install nodejs-lts
    > ```
   > or
   >
   > ```bash
    > choco install nodejs
    > ``` 
   >
   > 💡 **TIP:** Detailed instructions can be found [at this link](https://docs.antora.org/antora/latest/install/windows-requirements/).
   >
   > Windows users are invited to share their comments and supplement important information missing in this brief guide or the complete documentation.


#### Installing Antora globally using `npm`

1. You can install Antora globally so that the `antora` command is available on your `PATH`. To install Antora globally, pass the `-g` option to `npm i`.

    ```bash
    npm i -g @antora/cli@3.1 @antora/site-generator@3.1
    ```

2. Verify the antora command is available on your `PATH` by running:

    ```bash
    antora -v
    ```

3. If the installation was successful, the command should report the version of the Antora CLI and site generator.

    ```bash
    antora -v
    @antora/cli: 3.1.5
    @antora/site-generator: 3.1.5
    ```

> 💡 **TIP:** See also: [Installing Antora Locally](https://docs.antora.org/antora/latest/install/install-antora/#install-dir).

### Granting access for Antora to remote Git repositories

> 📝 **NOTE:** Complete instructions for accessing private repositories can be found [at this link](https://docs.antora.org/antora/latest/playbook/private-repository-auth/).

#### Populating the credential store interactively

To grant Antora access to your source repositories, follow these steps:

1. Open a terminal and execute the command to configure Git:

   ```bash
   git config --global credential.helper store && \
   echo -n 'Repository URL: ' && read REPLY && \
   git ls-remote -h $REPLY > /dev/null
   ```
   > 📝 **NOTE:** For `'Repository URL: '`, enter the URL of the Git repository to which you need to grant access.

2. Repeat these steps for each repository from your Antora playbook. In our example, it's the _site.yml_ file.)

#### Populating the credential store directly (GitLab example)

Use personal access tokens to grant access to repositories:

1. In your GitLab account, open [GitLab personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) and create a token with `read_repository` scope.

2. To grant access to repositories, use one of the following methods:

    - **Through the `GIT_CREDENTIALS` environment variable:**
      Set the environment variable with the value of the personal access token. For example:
      ```bash
      export GIT_CREDENTIALS='https://<FirstName_LastName>:<personalAccessToken>@gitlab.example.com'
      ```
      Antora will use this token for all repositories in `gitlab.example.com`.

- **Through the _$HOME/.git_credentials_ file:**
  Create or modify the `.git_credentials` file. Add lines with the necessary repositories in the following format:
  ```bash
  https://<personalAccessToken>:@gitlab.example.com/<repository_path>
  # or
  https://<FirstName_LastName>:<personalAccessToken>@gitlab.example.com/<repository_path>
  # or use a single token for all repositories
  https://<FirstName_LastName>:<personalAccessToken>gitlab.example.com/
  ```

### Generating technical documentation

- Generate a static HTML site from the documentation using the command:

    ```bash
    antora site.yml
    ```

- Generate a static _LOCAL_ HTML site from the documentation using the command:

    ```bash
    antora site-local.yml
    ```

  The generated site can be viewed locally through the default browser. The output of this site will be available at the path defined in your site.yml playbook:

    ```
    output:
      dir: ./output/ua
    ```

### Setting up quick launch for documentation generation process in IntelliJ IDEA

To automate the documentation generation step, you can set up a **Shell Script** run configuration in IntelliJ IDEA:

1. From the main menu, select: _Run > Edit Configurations > Add New Configuration_.
2. Choose the **Shell Script** run configuration type.
3. Specify the name **Name: antora-site**.
4. Specify the script type **Execute: Shell Script**.
5. Specify the script **Script text: _antora site-local.yml_**.

After setting up, IntelliJ IDEA will have an additional run configuration **antora-site** for generating technical documentation through Antora, which can be used for the quick launch of the process.
