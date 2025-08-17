const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const data = require('./json/games.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to the Teli Games API! Use /games to get the list of games.');
});

app.get('/games', (req, res) => {
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server online at http://localhost:${PORT}`);
});