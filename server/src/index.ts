import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMAILS_FILE = path.join(__dirname, '..', 'emails.json');

app.use(cors());
app.use(express.json());

// Load existing emails
function loadEmails(): string[] {
  try {
    if (fs.existsSync(EMAILS_FILE)) {
      return JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveEmail(email: string): boolean {
  const emails = loadEmails();
  if (emails.includes(email)) return false;
  emails.push(email);
  fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
  return true;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', players: players.size });
});

app.post('/api/signup', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }
  const added = saveEmail(email.trim().toLowerCase());
  res.json({ success: true, new: added });
});

app.get('/api/players', (_req, res) => {
  res.json({ count: players.size });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface PlayerState {
  id: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  level: number;
  isCrouching: boolean;
}

const players = new Map<WebSocket, PlayerState>();
let nextPlayerId = 1;

function broadcastPlayerCount() {
  const msg = JSON.stringify({ type: 'player_count', count: players.size });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  const playerId = `player-${nextPlayerId++}`;
  const initialState: PlayerState = { id: playerId, x: 0, y: 1.6, z: 0, rotationY: 0, level: 0, isCrouching: false };
  players.set(ws, initialState);

  ws.send(JSON.stringify({ type: 'init', id: playerId, playerCount: players.size, players: Array.from(players.values()).filter(p => p.id !== playerId) }));
  broadcast({ type: 'player_join', player: initialState }, ws);
  broadcastPlayerCount();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'position') {
        const state = players.get(ws);
        if (state) {
          state.x = msg.x;
          state.y = msg.y;
          state.z = msg.z;
          state.rotationY = msg.rotationY;
          state.level = msg.level;
          state.isCrouching = msg.isCrouching;
          broadcast({ type: 'player_move', player: state }, ws);
        }
      }
    } catch {}
  });

  ws.on('close', () => {
    const state = players.get(ws);
    if (state) {
      broadcast({ type: 'player_leave', id: state.id }, ws);
    }
    players.delete(ws);
    broadcastPlayerCount();
  });
});

function broadcast(msg: object, exclude?: WebSocket) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(client => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Backrooms server running on port ${PORT} (HTTP + WebSocket)`);
});
