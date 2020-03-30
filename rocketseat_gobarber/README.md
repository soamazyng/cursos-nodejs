# Iniciando back-end do GoBarber

<blockquote align="center">“O impossível é feito de várias partes possíveis”!</blockquote>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/node/v/v?color=%2304D361">

  <a href="https://jay.com.br">
    <img alt="Made by Jay" src="https://img.shields.io/badge/made%20by-Jay-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/soamazyng/cursos_nodejs/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/soamazyng/cursos_nodejs?style=social">
  </a>
</p>

## Common js VS ES6

Para utilizar os imports ao invés de require é necessário utilizar algum compilador como o Babel ou o **Sucrase**.

## Sucrase

Para rodar apenas um arquivo basta utilizar:

```
sucrase-node FILE.EXT
```

## Debug with Sucrase

Para resolver o problema de debug com o nodemon + configurações que executam o sucrase é necessário colocar no Package.json

```
"dev:debug": "node --inspect-brk -r sucrase/register src/server.js"
```

## Criando container e imagem postgres

<p>Cria o container e a imagem a porta está diferente caso a porta já esteja utilizando.</p>
```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres
```

Lista todos os containers que estão rodando na minha máquina

```
docker ps
```

Start de um container parado

```
docker start <container_name>
```

## Instalando e configurando ESLint

```
npm install eslint --save-dev
```

<p>Depois de instalado</p>

```
npx eslint --init
```

[https://eslint.org/docs/user-guide/getting-started](https://eslint.org/docs/user-guide/getting-started)

**Configurações:**

? How would you like to use ESLint? **To check syntax, find problems, and enforce code style**
? What type of modules does your project use? **JavaScript modules (import/export)**
? Which framework does your project use? **None of these**
? Does your project use TypeScript? **No**
? Where does your code run? **Node**
? How would you like to define a style for your project? **Use a popular style guide**
? Which style guide do you want to follow? Airbnb: https://github.com/airbnb/javascript
? What format do you want your config file to be in? **JavaScript**
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:
eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.1.0 eslint-plugin-import@^2.18.2
? Would you like to install them now with npm? **Yes**

Deve ter instalado a extensão do VsCode ESLINT

**Configurações do ESLint.js**

rules: {
"class-methods-use-this" : "off", _/ desabilita a obrigatoriedade do this
"no-param-reassign" : "off", _/ permite alterar um parâmetro recebido
"camelcase" : "off", _/ desabilita a obrigatoriedade das variáveis serem todas camelcase
"no-unused-vars" : ["error", {"argsIgnorePattern" : "next"}] _/ desabilita o erro que é mostrado quando uma variável next é declarada e não utilizada
},

---

**roda o eslint em todos os arquivos .js da pasta src de uma vez**

```
npx eslint --fix src --ext .js
```

### Instalando e Configurando o prettier

```
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Configurando o prettier dentro do eslintrc.js**

```javascript
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
```

**configurar o prettier**
criar o arquivo **.prettierrc**

```json
{
  "singleQuote": true /* deixa as aspas simples*/,
  "trailingComma": "es5" /* virgula no final do objeto*/
}
```

## Sequelize

**Sequelize-cli**
Deve ser instalado para utilizar os comandos no terminal.

**.sequelizerc**
Responsável por exportar os caminhos dos arquivos do meu projeto.

**Trabalhando com postgres**
Tem que instalar duas dependências

```
npm i pg pg-hstore
```

**Primeiro é necessário criar na raiz do projeto um arquivo .sequelizerc**

<p>Este arquivo é responsável por detalhar a estrutura de pastas do projeto</p>

```javascript
const { resolve } = require('path'); //para unificar a chamada de pastas mac, windows, unix

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
};
```

**NÃO RODEI ISTO NESTE PROJETO**
**Depois do arquivo de configuração é necessário rodar um comando para iniciar o sequelize**

<p>Este comando vai cirar o arquivo de configuração do banco de dados e uma model demo.</p>

```
npx sequelize init
```

**Criar um migration**

```
npx sequelize migration:generate --name=create-users
```

**Rodar os migrations**

```
npx sequelize db:migrate
```

**Criar um seeder**

```
npx sequelize seed:generate --name=create-config-start-hour
```

**Rodar os seeders**

```
npx sequelize db:seed:all
```

**Trabalhando com o between**

Tem que importar o Op

```javascript
import { Op } from 'sequelize';
```

```javascript

where: {
  provider_id: req.userId,
  date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
  canceled_at: null,
},

```

## Models

Os campos que tem na model necessariamente não precisam ser os mesmos do banco de dados.
E quando estamos utilizando um campo que só existe no código e não no banco utilizamos o tipo **VIRTUAL**

### Caso seja necessário forçar o nome da tabela:

```javascript
import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      { sequelize, tableName: 'deliveries_man' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default DeliveryMan;
```

### Explicação do CASCADE

<blockquote>

- _CASCADE:_ A opção CASCADE permite excluir ou atualizar os registros relacionados presentes na tabela filha automaticamente, quando um registro da tabela pai for atualizado (ON UPDATE) ou excluído (ON DELETE). É a opção mais comum aplicada.

- _RESTRICT:_ Impede que ocorra a exclusão ou a atualização de um registro da tabela pai, caso ainda hajam registros na tabela filha. Uma exceção de violação de chave estrangeira é retornada. A verificação de integridade referencial é realizada antes de tentar executar a instrução UPDATE ou DELETE

- _SET NULL:_ Esta opção é usada para definir com o valor NULL o campo na tabela filha quando um registro da tabela pai for atualizado ou excluído.

- _NO ACTION:_ Essa opção equivale à opção RESTRICT, porém a verificação de integridade referencial é executada após a tentativa de alterar a tabela. É a opção padrão, aplicada caso nenhuma das opções seja definida na criação da chave estrangeira.

- _SET DEFAULT:_ “Configura Padrão” – Define um valor padrão na coluna na tabela filha, aplicado quando um registro da tabela pai for atualizado ou excluído.

Vejamos um exemplo usando a cláusula ON DELETE CASCADE, que é uma das mais comuns usadas em chaves estrangeiras. Todos os exemplos mostrados aqui também podem ser utilizados com a cláusula ON UPDATE e, na prática, podemos usar ambas as cláusulas na mesma tabela.

</blockquote>

## Middlewares

Respeita a ordem de carregamento das rotas, isso é, se eu criar um middleware .use depois de algumas rotas ele será chamado depois das rotas que estão nas linhas anteriores.

## Desestruturação de array

Quando você quiser pular uma posição do array basta colocar a virgula

```javascript
const [, token] = authHeader.split(' '); //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

## promisify

Serve para converter uma função async no formato de promisse com função call back em uma função async/await

## Pino JS

[https://github.com/pinojs/pino](https://github.com/pinojs/pino)

Opções de logs:

- trace
- debug
- **info** default
- warn
- error
- fatal

Mostra os logs de maneira mais bonitinha e profissional.
As configurações para retirar os itens a mais e pintar o pino da forma que fica mais fácil identificar o log está: [https://github.com/pinojs/pino-pretty](https://github.com/pinojs/pino-pretty)

<hr>

## Salvar imagem

Envios de arquivos deve ser feito atrás do multipart form data

## Instalando o Multer

```
npm i multer
```

É necessário colocar um middleware no sistema para que seja possível acessar o arquivo via url:

```javascript
// precisa colocar este middleware para permitir o acesso a arquivos estáticos via url
this.server.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);
```

# Trabalhando com datas

## Instalar o date-fins para trabalhar com datas no Node

```javascript
npm i date-fns@next
```

**PT BR**

```javascript
import pt from 'date-fns/locale/pt-BR';
```

<p>Obtendo o timestamp de hoje</p>

<p> Dentro do console do Chrome digitar:</p>

```javascript
new Date().getTime();
```

Definindo uma coluna como default: getDate / now

```javascript
defaultValue: Sequelize.fn('now'),
```

## Criando container e imagem mongodb

```
docker run --name mongobarber -p 27017:27017 -d -t mongo
```

## Mongoose

```
npm i mongoose
```

## Disparo de e-mails

[https://mailtrap.io](https://mailtrap.io)

```
npm i nodemailer
```

**Criando e-mails HTML**

<p>Handlebars</p>

```
npm i express-handlebars nodemailer-express-handlebars
```

## Redis

**Docker Redis**

```
docker run --name redis -p 6379:6379 -d -t redis:alpine

```

**Ferramenta de filas dentro do Node**

- bee-queue (mais rapidez)
- kue (muito mais recursos)

```
npm i bee-queue
```

## Tratamento de erros

**Ferramentas**

- [https://www.bugsnag.com](https://www.bugsnag.com)
- [https://sentry.io/welcome/](https://sentry.io/welcome/)

<p>Vamos utilizar nesta aplicação o <strong>Sentry</strong> </p>

Como estamos trabalhando com requisições Asyncronas o express não consegue captar os erros e enviar para o Sentry, desta forma vamos ter que utilizar uma biblioteca que consiga resolver esta questão, a **express-async-errors**

```
npm i express-async-errors
```

<p>Para pegar os erros da aplicação e fazer um tratamento via middleware</p>

```
npm i youch
```

## DOTENV

```
npm i dotenv
```

Ao carregar este módulo já carrega todas as variáveis de ambiente para uma variável global do node **process.env**

```javascript
import 'dotenv/config';
```

Precisa inserir este import em ao executar um processo, como por exemplo a fila executa em processo separado preciso inserir lá também.

Além disso, precisa inserir também dentro do arquivo database, porém lá não se pode utilizar o import desta forma é necessário chamar o módulo seguindo a estrutura commonjs

```javascript
require('dotenv/config');
```

## Cors

```
npm i cors
```

<hr>

Feito com ♥ by Jay Benedicto
