const fs = require('fs');
const path = require('path');
const jsonDirectory = path.join(__dirname, 'json');
const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to the Teli Games API! Use /games to get the list of games.');
});

fs.readdirSync(jsonDirectory).forEach(file => {
    const filePath = path.join(jsonDirectory, file);
    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(subFile => {
            const subFilePath = path.join(filePath, subFile);
            if (path.extname(subFilePath) === '.json') {
                const endpoint = `/${file}/${path.basename(subFilePath, '.json')}`;
                app.get(endpoint, (req, res) => {
                    fs.readFile(subFilePath, 'utf8', (err, data) => {
                        if (err) {
                            return res.status(500).send('Error reading file');
                        }
                        res.json(JSON.parse(data));
                    });
                });
            }
        });
    } else if (path.extname(filePath) === '.json') {
        const endpoint = `/${path.basename(filePath, '.json')}`;
        app.get(endpoint, (req, res) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading file');
                }
                res.json(JSON.parse(data));
            });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server online at http://localhost:${PORT}`);
});