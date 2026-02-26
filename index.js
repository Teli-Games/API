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

const registerEndpoint = (filePath, endpoint) => {
    app.get(endpoint, (req, res) => {
        const userPlatform = req.query.platform;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading file');

            let gameData;
            try {
                gameData = JSON.parse(data);
            } catch (e) {
                return res.status(500).send('Invalid JSON format');
            }

            if (Array.isArray(gameData)) {
                gameData = gameData.map(game => attachPlatformConfig(game, userPlatform));
            } else {
                gameData = attachPlatformConfig(gameData, userPlatform);
            }

            res.json(gameData);
        });
    });
};

const attachPlatformConfig = (game, userPlatform) => {
    if (userPlatform && game.platforms) {
        const platformConfig = game.platforms[userPlatform] || { supported: false };
        return {
            ...game,
            currentPlatform: {
                ...platformConfig,
                isProton: !platformConfig.supported && userPlatform === 'linux' && !!game.platforms.windows
            }
        };
    }
    return game;
};

fs.readdirSync(jsonDirectory).forEach(file => {
    const filePath = path.join(jsonDirectory, file);

    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(subFile => {
            if (path.extname(subFile) === '.json') {
                const subFilePath = path.join(filePath, subFile);
                const endpoint = `/${file}/${path.basename(subFile, '.json')}`;
                registerEndpoint(subFilePath, endpoint);
            }
        });
    } else if (path.extname(filePath) === '.json') {
        const endpoint = `/${path.basename(filePath, '.json')}`;
        registerEndpoint(filePath, endpoint);
    }
});

app.listen(PORT, () => {
    console.log(`Server online at http://localhost:${PORT}`);
});