# Começando com a API REST

## Erro da versão do type/restify

Caso dê algum erro na hora de instalar o type/restify utilizar a versão: 5.0.11
https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25944#issuecomment-488382549

## nodemoon

Monitora as mudanças dos arquivos, e quando ele identifica que foi alterado alguma coisa é disparado o node de forma automática.

``` javascript
  npm install nodemon -g
```

Para instartar o nodemon

``` javascript
  nodemon dist/main.js
```

## Restify

Uma biblioteca específica pra NODEJS que dá recursos para podermos ouvir requisições HTTP

O que precisamos fazer é basicamente:

1. criar um server
2. Configurar as rotas
3. E qual a porta que vamos ouvir

É muito similar ao **express.js** porém o Restify tem uma implementação focada em API Json.
O tratamento de erros é muito melhor também.
Trás também um suporte mínimo Hipermídia

## Os objetos Request, Response e Next

Existem algumas funções e propriedades dentro do Request, Response e Next.

Algumas do Response são:

``` node
resp.json({
		browser: req.userAgent(),
		method: req.method,
		url: req.href(),
		path: req.path(),
		query: req.query
	});
```

Sendo que a última que é para pegar os parâmetros da url (ex: localhost:3000/info?teste=1) eu só consigo utilizar se configurar um plugin:

```
  server.use(restify.plugins.queryParser());
```

### Next

A gente utiliza ela é duas situações.

1. indicando para o Restfy que a nossa callback terminou o que ela tem que fazer.
2. Eu posso ter mais do que uma callback, sendo assim eu chamo o next para a primeira callback chamar a segunda (pode ser utilizado para barrar requisições do IE por exemplo) Para não ir para a próxima requisição basta colocar **return next(false)**
