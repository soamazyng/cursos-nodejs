var mysql = require('mysql');

var connMySQL = function(){
    console.log('Conexao com o bd foi estabelecida');
    return connection = mysql.createConnection({
		host : 'jay.com.br',
		user : 'jay',
		password : 'hugo28',
		database : 'jay_wpteste'
    });
}

module.exports = function(){
    console.log('O autoload carregou o módulo de conexão com o bd');
    return connMySQL;
}