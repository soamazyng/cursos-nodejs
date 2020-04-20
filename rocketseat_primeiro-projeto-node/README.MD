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

```
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```
