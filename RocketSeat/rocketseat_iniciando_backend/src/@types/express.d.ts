// modifica a definição de tipos de um módulo
// tem que criar o arquivo com o nome MODULO.d.ts
// declarar o namespace com o nome do módulo, pois quero sobrescrever uma tipagem de dentro do express
// depois exportar o nome da função que quero alterar
// ele não faz uma substituição ele faz um anexo com o que eu colocar abaixo.

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
