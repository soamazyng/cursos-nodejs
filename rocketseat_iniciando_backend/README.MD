# Configurando do zero um projeto Node com Typescript

```
yarn add express
```

```
yarn add @types/express -D
```

```
yarn add typescript -D
```

```
yarn tsc --init
```

Setar a rootDir com './src'

Setar a outDir com './dist'

## Para rodar o script em forma de desenvolvimento

```
yarn add ts-node-dev -D
```

Até aqui o script do package.json deve estar assim:

```
  "scripts": {
    "dev:server": "ts-node-dev --transpileOnly --ignore-watch node_modules src/server.ts",
    "build": "tsc"
  },
```

**--transpileOnly**
Desabilita a compilação de verificar se os tipos estão corretos, deixando a responsabilidade desta validação para o VisualStudioCode, além disso deixa o projeto **bem mais rápido**.

**--ignore-watch node_modules**
Desabilita o watch para não ficar escutando alterações na pasta **node_module**.

## Resolvendo problemas de importação do typescript

Por padrão o eslint não entende a importação de arquivos do typescript e utilizando este plugin ele passa a entender.

```
yarn add -D eslint-import-resolver-typescript
```

## Prettier

```shell
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

## ORM - TypeORM

Ao instalar o TypeORM é necessário instalar também o drive de conexão do banco que será utilizado, neste caso vamos utilizar o postgres.

```shell
yarn add typeorm pg reflect-metadata
```

---

Quando estamos trabalhando com typescript é necessário instalar o reflet-metadata e importar ele no primeiro arquivo acima de tudo da aplicação:

```typescript
import 'reflect-metadata';
```

---

Como o typeorm não tem como default executar scripts **typescript** é necessário criar uma configuração no package.json para habilitar esta funcionalidade

```json
"typeorm": "ts-node-dev ./node_modules/typeorm/cli.js"
```

### Criando migrations com o CLI TypeORM

```shell
yarn typeorm migrations:create -n CreateAppointments
```

Para executar

```shell
yarn typeorm migrations:run
```

---

Revertendo um migrations, ele volta apenas a última alteração

```shell
yarn typeorm migration:revert
```

### Criptografando a senha

```shell
yarn add bcryptjs
```

```shell
yarn add -D @types/bcryptjs
```

## JWT

instalar o pacote

```shell
yarn add jsonwebtoken
```

```shell
yarn add -D @types/jsonwebtoken
```

## DOTENV

[Tutorial de como fazer funcionar no Typescript](https://blog.morizyun.com/javascript/library-typescript-dotenv-environment-variable.html)

## Pino

```shell
yarn add pino # npm install --save pino
yarn add --dev @types/pino
```

## Multer

```shell
yarn add multer
```

```shell
yarn add -D @types/multer
```

## Express Async Errors

Como o express não tem tratativa de erro para rotas async é necessário instalar este pacote.

```shell
yarn add express-async-errors
```

## Trabalhando com atalhos de paths dentro do Typescript

Instalar a lib para funcionar os paths

```shell
  yarn add tsconfig-paths -D
```

Depois de instalar precisa registrar o tsconfig no script do package.json

```json
  "dev:server": "ts-node-dev -r tsconfig-paths/register --inspect --transpileOnly --ignore-watch node_modules src/shared/infra/http/server.ts",
```

## Biblioteca de injeção de dependência

[https://github.com/microsoft/tsyringe](https://github.com/microsoft/tsyringe)

## TDD

### JEST Typescript

Intalar a biblioteca

```shell
yarn add ts-jest -D
```

```shell
@types/jest
```

Depois de instalar, alterar o arquivo jest.config.js:

```javascript
preset: 'ts-jest',
```

Descomentar o testMatch que diz aonde está os meus arquivos de teste e colocar a seguinte instrução:

```javascript
testMatch: ['**/*.spec.ts'],
```
