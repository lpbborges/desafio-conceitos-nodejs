const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { likes } = repositories[respositoryIndex];

  const repository = { id, title, url, techs, likes };

  repositories[respositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(respositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { title, url, techs, likes } = repositories[respositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1
  }

  repositories[respositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
