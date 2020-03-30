const express = require('express');

const server = express();

//sempre colocar isso no express para o express saber que ele vai utilizar json no corpo da requisição.
server.use(express.json());

const projects = [
  {
  "id" : "1",
  "title" : "Upmasters",
  "tasks" : ["Criar novos posts", "Criar Vídeos"]
  },
  {
  "id" : "2",
  "title" : "PetsGuru",
  "tasks" : ["Criar site", "Criar App"]
  },
  {
  "id" : "3",
  "title" : "Jay",
  "tasks" : ["Atualizar site", "Add novos projetos"]
  }
];

let requisicao = 0;

server.use((req, res, next)=> {
  
  console.time('request')
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  requisicao = requisicao+1;
  console.log(`Número de requisições até o momento: ${requisicao}`);
  next();

  console.timeEnd('request');

});

function checkProjectInArrayExists(req, res, next){

  const {id} = req.params;
  const project = projects.find(e=>e.id == id);

  if(!project){
    res.status(404).json({"error" : "Project does not exists"});
  }

  req.project = project;

  return next();
}

server.get('/projects', (req, res) => {  
  return res.json(projects);
});

server.get('/projects/:id', checkProjectInArrayExists, (req, res) => {    
  return res.json(req.project);  
});

server.post('/projects', (req, res) => {  

  const {id, title} = req.body;
  
  const project = {
    "id" : id,
    "title" : title,
    "tasks" : []
    };

  projects.push(project);

  return res.json(projects);
  
});

server.post('/projects/:id/tasks', checkProjectInArrayExists, (req, res) => {  

  const {title} = req.body;
  
  req.project.tasks.push(title);  

  return res.json(projects);
  
});

server.put('/projects/:id', checkProjectInArrayExists, (req, res) => {  

  const {title} = req.body;  

  req.project.title = title;

  return res.json(projects);
  
});

server.put('/projects/:id', checkProjectInArrayExists, (req, res) => {  

  const {title} = req.body;  

  projects[id] = name;  

  return res.json(projects);
  
});

server.delete('/projects/:id', checkProjectInArrayExists, (req, res) => {      

  projects.splice(req.project, 1);

  return res.send();
  
});

server.listen(3000);