import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const getPlayers = () => {
  try {
    const playersData = fs.readFileSync('./data/players.json', 'utf8');
    return JSON.parse(playersData);
  } catch (err) {
    console.error('Error reading players data:', err);
    return [];
  }
};

const updatePlayers = (players) => {
  try {
    fs.writeFileSync('./data/players.json', JSON.stringify(players));
  } catch (err) {
    console.error('Error updating players data:', err);
  }
};

const sortByScoreDescending = (a, b) => b.score - a.score;

const assignRankings = (players) => {
  players.forEach((player, index) => {
    player.rank = index + 1;
  });
};

router.get("/", (req, res) => {
  const players = getPlayers();

  players.sort(sortByScoreDescending);

  assignRankings(players);

  const leaderboard = players.map(({ id, name, score, rank }) => ({
    id,
    name,
    score,
    rank
  })); 

  res.status(200).json(leaderboard);
}); 


router.post('/', (req, res) => {
  const { name, score } = req.body;
  if (!name || !score) {
    return res.status(400).json({ error: 'Please include a name and score' });
  }
  const newPlayer = {
    id: uuidv4(),
    name,
    score,
    rank: 0
  };

  let players = getPlayers();
  players.push(newPlayer);
  updatePlayers(players);

  res.status(201).json({ message: 'Player Score and name have been added to Leaderboard', player: newPlayer });
});


export default router;