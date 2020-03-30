module.exports = function(){

    this.getNoticias = function(connection, callback){
        connection.query('SELECT * FROM teste_noticias', callback);
    }

    this.getNoticia = function(connection, callback){
        connection.query('SELECT * FROM teste_noticias WHERE id = 2', callback);
    }

    this.salvarNoticia = function(noticia, connection, callback){
    	// o módulo mysql suporta envio do json, porém ele precisa estar no mesmo formato do banco
    	connection.query('insert into teste_noticias set ? ', noticia, callback); 
    }

    return this;

}