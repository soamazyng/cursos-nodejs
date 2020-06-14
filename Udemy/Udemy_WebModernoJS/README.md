# Node

## Sistemas de Módulos

Em Node cada arquivo criado representa um módulo.

Os módulos são ditos como arquivos singulares, isto é, tudo que você escrever dentro do seu arquivo (módulo) fica visível apenas dentro do módulo.

Para que você consiga utilizar o que está dentro de um módulo em outros arquivos (módulos) você precisa exportar, e para utilizar informações de outros módulos dentro do seu módulo você precisa importar.

As duas formas de importar e exportar módulos mais famosos que existem são:
CommomJS: Padrão utilizado no Node

Ecmascript 2015: Com import e export.

## Cadeia de Responsabilidade (chain of responsibility)

Utilizado com o uso do next na função.

Este tipo de função é chamado de Função Midlleware, a função next() não é obrigatória.

O Midlleware é um método que é executado antes e passa para as próximas funções com o uso do next().

## Post
Como é complexo trabalhar com requisições POST utilizando o BODY para recebimento de parâmetros, utilizamos o módulo chamado BodyParser [https://github.com/expressjs/body-parser]

"O body-parser é um módulo capaz de converter o body da requisição para vários formatos. Um desses formatos é json, exatamente o que queremos."

## Diferença entre IMPORT E REQUIRE
![alt text](https://i.stack.imgur.com/5WgFJ.png "Explicação")

[Fonte](https://stackoverflow.com/a/46677972/821826)

## Resolvendo a questão de módulos em Node (Consign)

Módulo que abstrai toda a lógica de carregamento de módulos

[Fonte](https://medium.com/@febatista107/organizando-seu-projeto-em-node-js-be465c14d19)
