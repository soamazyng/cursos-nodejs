# Introdução :rocket:

## O que é o NODE

Ambiente gratuito de código aberto para executar aplicações JavaScript do lado do servidor.

Surgiu em 2009.

## Arquitetura

LIBUV: Biblioteca do NODE
V8: Virtual Machine. A base para o NODE interpretar códigos JavaScripts, a mesma utilizada pelo Google Chrome
JS Modules: Módulos do NODE que pode acessar outros módulos nativos em C++

## Global

Window é o objeto Global.

## Process

Faz uma ponte com o script que estamos executando com o objeto que está sendo executado
Pode ouvir eventos.
Emite eventos.

## Módulos

Cada arquivo JS é considerado um módulo e cada módulo tem um escopo que é isolado dos outros módulos.
As variáveis e funções são acessíveis apenas no escopo do módulo.

### CommonJS

Especifíca que os módulos devem ser exportados para o mundo externo.

### Função Require IMPORTAÇÃO DE MÓDULO no es5

Diz ao node que a gente precisa importar um módulo para dentro do nosso script e desta forma podemos utilizar as funções que foram declaradas dentro do nosso script importado.

Só fazer o require não é o suficiente, para capturar o retorno desta função a gente precisa criar uma variável.

```javascript
const fs = require('fs')
```

## Criando um módulo

Na prática tudo que o node faz dentro de um arquivo JS é envolver o nosso arquivo dentro de uma função, por teste motivo as variáveis e funções dentro deste arquivo (módulo) ficam disponíveis apenas para aquele arquivo.

O objeto que a gente utiliza para exportar as variáveis e funções do arquivo .JS é o objeto exports.

### Maneiras de exportar o módulo no es5

Uma das maneiras para exportar o módulo inteiro é chamar o objeto exports e atribuir um nome para este módulo, após isso indicar o que eu quero exportar.

```javascript
exports.nomeaqui = nomedoarquivo
```

Para utilizar o módulo personalizado em meus arquivos JS eu vou utilizar o require, não com o nome, mas com o caminho relativo ao meu arquivo. Não precisa colocar a extensão JS.

```javascript
const teste = require(./arquivoaqui).teste
```

Como eu exportei o arquivo inteiro, eu devo indicar qual a função eu quero utilizar e o **.teste** no final indica que quero pegar apenas esta referência do meu módulo, e não o módulo inteiro.

---

**Tudo que a gente definiu no exports é o que ele vai retonar.**

---

A outra maneira de exportar é indicar apenas a função que quero exportar do meu módulo, criando o código abaixo:

```javascript
  module.exports = minha_funcao
```

Desta forma estou indicando que estou exportando apenas e tão somente a minha função e não o módulo todo.

---

Outra maneira de importar o módulo é utilizar um pasta e dentro colocar um arquivo chamado *package.json* este arquivo é um json que deve conter:

```json
{
  "main": start.js
}
```

Este arquivo **package.json** deve estar dentro de uma pasta separada com o módulo em questão, o arquivo contendo meu módulo passará a ter o nome de *start.js* para ser inicializado pelo package.json.

O main do package.json é o primeiro arquivo que é chamado pelo node.js

### Node Package Manager NPM

Para iniciar um novo npm

``` javascript
npm init
```

### Convertendo os Exemplos em Typescript

``` javascript
npm i typescript -g
```

-g pois ele é uma ferramenta de linha de comando, logo eu preciso instalar ele globalmente.

Para iniciar uma aplicação com typescript:

``` typescript
tsc --init
```

Este comando vai criar um arquivo tsconfig.json com todas as configurações padrões.

Após criar o arquivo **tsconfig.json** devemos alterar a opção **target** para es6 pois o NODE utiliza a maioria dos comandos do es6, além disso a opção **module** manter o **commonjs** que basicamente diz que vamos utilizar o require e exports para trabalhar com os módulos.

Para fazer um parse entre um arquivo typescript para um arquivo javascript: **tsc** digitando este comando no console o typescript vai ler o meu arquivo tsconfig.json e compilar todos os arquivos .ts da minha pasta e fazer o parse para Javascript.

Para criar um **watch** dos arquivos **ts** no terminal basta digitar **tsc -w** desta maneira o compilador do typescript vai ficar escutando as alterações que acontecerem nos arquivos do tipo *.ts*.

#### @types

Os Types são arquivos internos que descrevem uma determinada biblioteca, como utiliza-la quais são as suas funções.

Com os types é possível utilizar o Typescript para compilar bibliotecas indicando aonde está o erro daquela sintaxe.

Exemplo: Dizer ao typescript que ao utilizar o módulo do node FS existe uma função writefile que utiliza três argumentos. Para isso precisamos instalar os types, pois sem eles o Typescript não iria saber o que é writefile nem tão pouco reconheceria o módulo node e seus módulos core, como FS.

A Microsoft vem acompanhando as principais bibliotecas do mercado este projeto se chama **define type**.

Estas definições de tipos podem ser encontradas dentro do site: https://www.npmjs.com e podem ser instaladas dentro da nossa aplicação.

Para encontrar todas as definições de uma biblioteca você precisa acessar o site da https://www.npmjs.com e utilizar a definicição da convensão **@types/NOMEDABIBIOTECA** EXEMPLO: **@types/node**.

Ao instalar o types do node o typescript vai começar a entender por exemplo a definição **require** e até mesmo seus módulos core como *fs*.

Quando eu estou instalando um type no meu projeto eu preciso instalar esta dependência como dev (devDependencies dentro do package.json), pois este type não será utilizado em produção, uma vez que, ele é utilizado apenas como um gia para o desenvolvimento.

``` javascript
  npm i @types/node --save-dev
```

### Importação de módulo no es6

A maneira mais atual de importar um módulo é utilizando a função import, onde o parâmetro * significa que estou importando tudo, as seria a minha constante que será utilizada para chamar o módulo e depois eu indico da onde deve ser importado isso.

```javascript
import * as fs from 'fs'
```

### Maneiras de exportar o módulo no es6

Está é a maneira utilizada para exportar uma função de um módulo no **es6**

```javascript
export const FUNCAO = () => {
  return 1
}
```

Quando eu faço a exportanção dizendo o que eu quero exportar como acima eu devo importar utilizando o seguinte comando:

``` javascript
import { FUNCAO } from './nomedoarquivo'
```

Desta forma para utilizar a função basta colocar FUNCAO(args).

### Indicar aonde meu arquivo js será compilado com typescript

Dentro do arquivo **tsconfig.json** existe a possibilidade de você indicar qual o diretório você quer que seus arquivos .js sejam gerados, para isso basta inserir no arquivo .json de configuração:

``` json
{
  "outDir" : "dist"
}

```

### Depuração de uma aplicação NODE

Para rodar o degug podemos utilizar dois tipos de funções:

``` node
node --inspect
```

Neste caso o debug vai habilitar porém só vai parar caso a aplicação esteja aguardando alguma informação específica.

Então para podermos forçar o debuger parar na primeira linha executada vamos utilizar:

``` cmd
node --inspect-brk
```

Ao fazer isso o script não vai passar direito.
Desta forma um debug pode se conectar.

Para executar o debug precisamos abrir o Google Chrome e digitar na barra de endereço: **chrome://inspect**

Nesta página é possível ver um pequeno painel, e no final dele existe a opção **inspect** com o arquivo que estou debugando.

Ao clicar na opção inspect é possível abrir o modo debuger do source javascript, dentro deste debuger podemos colocar breakpoints para realizar a análise do código.

Para fechar o debuger se desconectar é necessário fechar a janela de debug do chrome.

Para habilitar o debuger junto ao typescript é necessário alterar uma configuração no **tsconfig.json**

``` json
  "sourceMap" : true
```

Desta forma é criado um mapeamento do arquivo TS para o arquivo gerado e com isso é possível realizar o debuger dentro dos meus arquivos **ts**.

