# Reporta Aí 📢

O **Reporta Aí** é uma plataforma desenvolvida para facilitar a comunicação entre cidadãos e a administração pública. Através dele, usuários podem reportar problemas urbanos (como buracos, iluminação falha, lixo acumulado) e acompanhar o status das solicitações, enquanto administradores gerenciam e visualizam essas ocorrências em um mapa interativo.

---

## 🚀 Manual de Instalação e Uso

Este guia orienta a instalação e execução do projeto em ambientes **Windows** e **Linux**.

### 📋 Índice
- [Windows](#windows)
- [Linux](#linux)
- [Como Usar (Login)](#como-usar)

---

## Windows

### 1) Instalação das Ferramentas Necessárias

Caso já tenha alguma instalada, pule para a próxima.

1.  **Git (Controle de Versão)**
    *   Baixe em: [git-scm.com](https://git-scm.com/download/win)
    *   Instalação: Padrão (Next até o fim).

2.  **XAMPP (Servidor e Banco de Dados)**
    *   Baixe em: [apachefriends.org](https://www.apachefriends.org/pt_br/download.html)
    *   **Importante:** Baixe a versão com **PHP 8.2** ou superior.
    *   Instalação: Local padrão (`C:\xampp`).
    *   *Pós-instalação:* Abra o "XAMPP Control Panel" e inicie (**Start**) o **Apache** e o **MySQL**.

3.  **Composer (Gerenciador do Backend)**
    *   Baixe em: [getcomposer.org](https://getcomposer.org/Composer-Setup.exe)
    *   Instalação: Durante a instalação, ele pedirá para escolher o PHP. Selecione o arquivo em `C:\xampp\php\php.exe`. Marque a opção "Add to PATH".

4.  **Node.js (Gerenciador do Frontend)**
    *   Baixe em: [nodejs.org](https://nodejs.org/)
    *   Versão: **LTS** (Recomendada).
    *   Instalação: Padrão (Next até o fim).

### 2) Configuração do Banco de Dados

1.  Certifique-se que o MySQL está rodando no painel do XAMPP (botão Start).
2.  Abra seu navegador e acesse: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3.  Clique na aba **Base de Dados** (Databases).
4.  No campo "Nome da base de dados", digite: `reportaai`
5.  Clique em **Criar**.

### 3) Configurando o Backend (Laravel)

1.  Abra a pasta `backend`.
2.  Clique com o botão direito em um espaço vazio e escolha "Open Git Bash here" (ou use o terminal de sua preferência).
3.  Execute os comandos abaixo, um por um:

    ```bash
    # a) Instalar as dependências do Laravel
    composer install

    # b) Configurar o arquivo de ambiente (copiar o exemplo)
    cp .env.example .env
    ```

    **Passo Extra:** Abra o arquivo `.env` na pasta `backend`, apague tudo e cole o conteúdo abaixo:

    ```env
    APP_NAME=Laravel
    APP_ENV=local
    APP_KEY=base64:Gws4cXSoeFf71HoTiFMTBmPb7VIKjL0RKWvpI8h5LtE=
    APP_DEBUG=true
    APP_URL=http://localhost

    APP_LOCALE=en
    APP_FALLBACK_LOCALE=en
    APP_FAKER_LOCALE=en_US

    APP_MAINTENANCE_DRIVER=file
    # APP_MAINTENANCE_STORE=database

    # PHP_CLI_SERVER_WORKERS=4

    BCRYPT_ROUNDS=12

    LOG_CHANNEL=stack
    LOG_STACK=single
    LOG_DEPRECATIONS_CHANNEL=null
    LOG_LEVEL=debug

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=reportaai
    DB_USERNAME=root
    DB_PASSWORD=

    SESSION_DRIVER=database
    SESSION_LIFETIME=120
    SESSION_ENCRYPT=false
    SESSION_PATH=/
    SESSION_DOMAIN=null

    BROADCAST_CONNECTION=log
    FILESYSTEM_DISK=local
    QUEUE_CONNECTION=database

    CACHE_STORE=database
    # CACHE_PREFIX=

    MEMCACHED_HOST=127.0.0.1

    REDIS_CLIENT=phpredis
    REDIS_HOST=127.0.0.1
    REDIS_PASSWORD=null
    REDIS_PORT=6379

    MAIL_MAILER=log
    MAIL_SCHEME=null
    MAIL_HOST=127.0.0.1
    MAIL_PORT=2525
    MAIL_USERNAME=null
    MAIL_PASSWORD=null
    MAIL_FROM_ADDRESS="hello@example.com"
    MAIL_FROM_NAME="${APP_NAME}"

    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_DEFAULT_REGION=us-east-1
    AWS_BUCKET=
    AWS_USE_PATH_STYLE_ENDPOINT=false

    VITE_APP_NAME="${APP_NAME}"
    ```

    Continue no terminal:

    ```bash
    # c) Gerar a chave de criptografia do sistema
    php artisan key:generate
    ```

4.  **Configurar Banco:** Abra o arquivo `.env` (criado no passo anterior) no bloco de notas e verifique se as configurações estão assim:
    ```env
    DB_DATABASE=reportaai
    DB_USERNAME=root
    DB_PASSWORD=
    ```
    *(Se você configurou senha no seu XAMPP, adicione-a em DB_PASSWORD)*

5.  Volte ao terminal e continue:
    ```bash
    # e) Criar as tabelas no banco de dados e criar o usuário Admin
    php artisan migrate --seed

    # f) Liberar o acesso às fotos (IMPORTANTE)
    php artisan storage:link
    ```
    *Obs: Se aparecer "link already exists", apague a pasta `public/storage` e rode o comando novamente.*

6.  **Iniciar o servidor:**
    ```bash
    php artisan serve
    ```
    ⚠️ **Não feche essa janela!** O backend precisa dela para funcionar.

### 4) Configurando o Frontend (React)

1.  Volte para a pasta raiz do projeto `reportaai` (onde tem o arquivo `package.json`).
2.  Abra outro terminal nesta pasta.
3.  Execute os comandos:

    ```bash
    # a) Instalar as dependências do React
    npm install

    # b) Iniciar o site
    npm start
    ```

4.  O navegador deve abrir automaticamente em [http://localhost:3000](http://localhost:3000).

---

## Como Usar

### Credenciais de Acesso (Ambiente de Teste)

Para testar as funcionalidades administrativas, utilize o usuário pré-criado (Seed):

| Tipo de Usuário | Email | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@reportaaijf.com` | `modelagem2025@` |
| **Cidadão** | (Clique em "Cadastre-se" na tela inicial) | (Insira seus dados) |

---

## Linux

### 1) Instalação das Ferramentas

1.  **Git:**
    ```bash
    sudo apt update
    sudo apt install git
    ```

2.  **PHP, MySQL e Apache:**
    ```bash
    sudo apt install apache2 mysql-server php php-mysql php-cli php-xml php-mbstring php-curl php-zip unzip
    ```
    *Verificar se estão rodando:* `sudo systemctl status apache2` e `sudo systemctl status mysql`.

3.  **Composer:**
    ```bash
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php
    sudo mv composer.phar /usr/local/bin/composer
    ```
    *Teste:* `composer --version`

4.  **Node.js e npm:**
    ```bash
    sudo apt install nodejs npm
    ```
    *Teste:* `node -v` e `npm -v`

### 2) Configuração do Banco de Dados

1.  Acesse o shell do MySQL:
    ```bash
    sudo mysql
    ```
2.  Crie o banco:
    ```sql
    CREATE DATABASE reportaai;
    EXIT;
    ```

### 3) Configurando o Backend

No terminal (na pasta `backend`):

```bash
# Copiar .env
cp .env.example .env

# Permissões de escrita (Essencial no Linux)
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache

# Instalar dependências e gerar chave
composer install
php artisan key:generate

# Edite o .env se necessário (DB_PASSWORD), depois migre:
php artisan migrate --seed

# Link simbólico para imagens
php artisan storage:link

# Rodar servidor
php artisan serve
```

### 4) Frontend

Na raiz do projeto (pasta `reportaai`):
```bash
npm install
npm start
```

---

## Como Usar

### Credenciais de Acesso (Ambiente de Teste)

Para testar as funcionalidades administrativas, utilize o usuário pré-criado (Seed):

| Tipo de Usuário | Email | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@reportaaijf.com` | `modelagem2025@` |
| **Cidadão** | (Clique em "Cadastre-se" na tela inicial) | (Insira seus dados) |