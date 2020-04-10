const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middlewares
function checkInArray(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exists" });
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.get("/repositories/:id", checkInArray, (request, response) => {
  return response.json(repositories[request.repositoryIndex]);
});

app.put("/repositories/:id", checkInArray, (request, response) => {
  const { title, url, techs } = request.body;
  const repositoryData = repositories[request.repositoryIndex];

  const repository = {
    id: repositoryData.id,
    title,
    url,
    techs,
    likes: repositoryData.likes,
  };

  repositories[request.repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checkInArray, (request, response) => {
  repositories.splice(request.repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkInArray, (request, response) => {
  const repository = repositories[request.repositoryIndex];

  repository.likes = repository.likes + 1;

  return response.json(repository);
});

module.exports = app;
