# Manual de Instalação e Uso - Sistema "Reporta Aí"

Este manual tem o intuito de orientar a Instalação e uso do software Reporta Aí, nos sistemas windows e Linux. Caso seu sistema já tenha algum dos aplicativos instalados basta prosseguir para o próximo passo.





## Windows


## 1)  Instalação das Ferramentas Necessárias

   1. Git (Controle de Versão)
   * Baixe em: git-scm.com/download/win (https://git-scm.com/download/win)
   * Instalação: Pode clicar em "Next" (Próximo) em todas as telas até finalizar.

 2. XAMPP (Servidor e Banco de Dados)
   * Baixe em: apachefriends.org (https://www.apachefriends.org/pt_br/download.html)
   * Importante: Baixe a versão com PHP 8.2 ou superior.
   * Instalação: Instale no local padrão (C:\xampp).
   * Após instalar: Abra o "XAMPP Control Panel" e clique no botão Start ao lado de Apache e MySQL. Eles devem ficar verdes.

  3. Composer (Gerenciador do PHP/Backend)
   * Baixe em: getcomposer.org/Composer-Setup.exe (https://getcomposer.org/Composer-Setup.exe)
   * Instalação: Durante a instalação, ele pedirá para escolher o "PHP". Selecione o arquivo em C:\xampp\php\php.exe. Marque a opção para adicionar ao "PATH". 

  4. Node.js (Gerenciador do React/Frontend)
   * Baixe em: nodejs.org (https://nodejs.org/)
   * Versão: Escolha a versão LTS (Recomendada).
   * Instalação: Clique em "Next" até finalizar.

## 2) Configuração do banco de dados
   1. Certifique-se que o MySQL está rodando no painel do XAMPP (botão Start).
   2. Abra seu navegador e acesse: http://localhost/phpmyadmin
   3. Clique na aba "Base de Dados" (Databases).
   4. No campo "Nome da base de dados", digite: reportaai
   5. Clique em Criar.
   6. Abra o Xampp clique em start no "Apache" e no "MySQL"
## 3) Configurando o Backend

1. Abra a pasta do projeto reportaai.
2. Entre na pasta backend.
3. Clique com o botão direito em um espaço vazio da pasta e escolha "Open Git Bash here" (ou abra o terminal/PowerShell e navegue até essa pasta).
4. Execute os comandos abaixo, um por um (espere um terminar para rodar o próximo):

          a) Instalar as dependências do Laravel
                composer install
    
          b) Configurar o arquivo de ambiente (copiar o exemplo)
                cp .env.example .env
     
          c) Gerar a chave de criptografia do sistema
                php artisan key:generate
     
          d) Configurar a conexão com o banco (ajuste se seu XAMPP tiver senha)
                # Abra o arquivo .env no bloco de notas e verifique se está assim:
                # DB_DATABASE=reportaai
                # DB_USERNAME=root
                # DB_PASSWORD=
    
          e) Criar as tabelas no banco de dados e criar o usuário Admin
                php artisan migrate --seed
    
          f) Liberar o acesso às fotos (MUITO IMPORTANTE)
                php artisan storage:link
Obs: Caso aparecer a mensagem "link already exists" durante o passo f, apague a pasta storage de DENTRO DO PUBLIC e rode o comando php artisan storage:link, confira se aparece o ícone de atalho na pasta (Seta no canto inferior)

   5. Deixe rodando: Por fim, execute o comando para ligar o servidor:

            php artisan serve
Não feche essa janela preta! O backend precisa dela aberta para funcionar.
## 4) Frotend
 1. Volte para a pasta raiz do projeto reportaai (onde tem o arquivo package.json).
2. Abra outro terminal (pode ser Git Bash ou PowerShell) nesta pasta.
3. Execute os comandos:

         a) Instalar as dependências do React
                npm install
    
        b) Iniciar o site
                npm start

4. O navegador deve abrir automaticamente no endereço http://localhost:3000.

## 5) Como usar

* Login como administrador

        email: admin@fiscalizajf.com
        senha: senha123

* Login como cidadão

        clique em cadastre-se e insira seus dados

## Linux
## 1) Instação das ferramentas

1. Git (Geralmente já vem instalado, mas caso não vier)

        sudo apt update
        sudo apt install git

2. PHP, MySQL e Apache (substituem o XAMPP)

        sudo apt install apache2 mysql-server php php-mysql php-cli php-xml php-mbstring php-curl php-zip unzip
    
Obs: MySQL e Apache iniciam automaticamente e não existe XAMPP control panel. Para verificar se estão rodando:

        sudo systemctl status apache2
        sudo systemctl status mysql

3. Composer (Instalado via terminal)

        php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
        php composer-setup.php
        sudo mv composer.phar /usr/local/bin/composer
    Teste:
        
        composer --version

4. Node.js e npm (Instalados via repositório oficial)

        sudo apt install nodejs npm
    Teste:

        node -v
        npm -v








## 2) Configuração do banco de dados
Criar banco no MySQL

        sudo mysql
Dentro do MySQL

        CREATE DATABASE reportaai;
        EXIT;

No .env

        DB_DATABASE=reportaai
        DB_USERNAME=root
        DB_PASSWORD=



## 3) Configurando o backend

No terminal em vez de Git Bash / PowerShell, use:
Terminal padrão da distro

Copiar arquivo .env

        cp .env.example .env

Permissões!

        sudo chmod -R 775 storage bootstrap/cache
        sudo chown -R $USER:www-data storage bootstrap/cache

storage

        php artisan storage:link



## 4) Frontend

        npm install
        npm start

Site abre em:

        http://localhost:3000
