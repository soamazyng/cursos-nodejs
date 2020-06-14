var app = require('./config/server');

// var rotaNoticias = require('./app/routes/noticias')(app); //recupera o módulo e passa como parametro o app.js

// var rotaFormularioNoticias = require('./app/routes/formulario_inclusao_noticia')(app); //recupera o módulo e passa como parametro o app.js

// var rotaFormularioNoticias = require('./app/routes/home')(app); //recupera o módulo e passa como parametro o app.js

app.listen(3000, function(){
   console.log("Servidor rodando com Express");
}); // precisa da funcao de call back para dizer que o server subiu