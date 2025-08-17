const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const data = require('./json/games.json');
const projects = require('./json/projects.json');
const experience = require('./json/experience.json');
const services = require('./json/services.json');

app.use(cors());

app.get('/', (req, res) => {
    res.json(data);
});

app.get('/projects', (req, res) => {
    res.json(projects);
});

app.get('/experience', (req, res) => {
    res.json(experience);
});

app.get('/services', (req, res) => {
    res.json(services);
});

app.listen(PORT, () => {
    console.log(`Server online at http://localhost:${PORT}`);
});