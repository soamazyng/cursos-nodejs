const express = require('express');

const server = express();

//sempre colocar isso no express para o express saber que ele vai utilizar json no corpo da requisição.
server.use(express.json());

const users = ["Jay", "J", "Jaque"];

server.use((req, res, next)=> {

  console.time('request')
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();

  console.timeEnd('request');

});

function checkUserExists(req, res, next){

  if(!req.body.name){
    return res.status(400).json({error: 'User name is required'});    
  }

  return next();

}

function checkUserInArray(req, res, next){
  const { id } = req.params;
  const user = users[id];
  if(!user){
    return res.status(400).json({error: 'User does not exists'});
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {  
  return res.json(users);  
});

server.get('/users/:id', checkUserInArray, (req, res) => {  

  return res.json(req.user);
  
});

server.post('/users', checkUserExists, (req, res) => {  

  const {name} = req.body;
  
  users.push(name);

  return res.json(users);
  
});

server.put('/users/:id', checkUserExists, checkUserInArray, (req, res) => {  

  const {name} = req.body;
  const { id } = req.params;

  users[id] = name;  

  return res.json(users);
  
});

server.put('/users/:id', checkUserInArray, (req, res) => {  

  const {name} = req.body;
  const { id } = req.params;

  users[id] = name;  

  return res.json(users);
  
});

server.delete('/users/:id', checkUserInArray, (req, res) => {    

  const { id } = req.params;

  users.splice(id, 1);

  return res.send();
  
});

server.listen(3000);