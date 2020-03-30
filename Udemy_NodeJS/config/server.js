var express = require('express'); //retorna uma funcao
var consign = require('consign'); //retorna uma funcao
var bodyParser = require('body-parser'); //para receber via post as informações

var app = express(); //executa a funcao dentro do express
app.set('view engine', 'ejs');// view engine do node.js
app.set('views', './app/views');//aponta o caminho das views padrão

app.use(bodyParser.urlencoded({extended: true})); //codifica a url

//tem que ser feito depois do express pois eu preciso inserir o load do consign para dentro do express
//toda vez que a gente chama um módulo no consign ele já EXECUTA a função, para ele não fazer isso
//devemos passar o nome do arquivo que devesa inserir ex.: config/dbConnection.js <-- deixar a extensão
consign()
	.include('./app/routes')
	.then('config/dbConnection.js') //possibilidade de inserir mais módulos dentro do consign
	.then('./app/models') //carrega automaticamente todas as models
	.into(app); //inclui todos os arquivos de rota  automaticamente

module.exports = app;