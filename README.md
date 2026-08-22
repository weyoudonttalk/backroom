# The Backrooms Online

A free, open-source 3D Backrooms exploration game that runs in your browser. No download needed.

**Play now:** [backrooms.online](https://backrooms.online)

This is a community tribute to the Backrooms creative writing project. All code is MIT licensed.

## Features

- **5 distinct levels** (Level 0–4) with unique environments, lighting, and atmosphere
- **2km × 2km procedurally generated maps** per level with dynamic chunk loading
- **11 entity types** with stealth-based AI (Smilers, Hounds, Crawlers, Partygoers, and more)
- **55 collectible items** from the Backrooms wiki documentation
- **Survival mechanics** — health, water, food (Minecraft-style)
- **Real-time multiplayer** — explore with others via WebSocket
- **Stealth system** — crouch to reduce detection radius by 60%
- **Difficulty settings** — Easy / Normal / Hard
- **Environmental props** — pillars, pipes, desks, barrels, debris per level

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look |
| Shift | Sprint |
| C | Crouch |
| ESC | Settings / Level Select |

## Tech Stack

- **Frontend:** React, TypeScript, React Three Fiber, Three.js
- **Server:** Node.js, Express, WebSocket (ws)
- **Build:** Vite
- **Deployment:** Vercel (client) + any Node host (multiplayer server)

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Run both client and server
npm run dev
```

- Client: http://localhost:5005
- Server (WebSocket): http://localhost:3001

### Client only

```bash
cd client
npm install
npm run dev -- --port 5005
```

### Server only

```bash
cd server
npm install
npm run dev
```

## Project Structure

```
backroom/
├── client/                  # React Three Fiber frontend
│   └── src/
│       ├── components/      # 3D scene, entities, items, HUD, multiplayer
│       ├── entities/        # Entity definitions and AI state machine
│       ├── items/           # 55 collectible item definitions
│       ├── levels/          # Level configs (colors, fog, entity pools)
│       ├── systems/         # Collision detection
│       ├── hooks/           # Multiplayer WebSocket hook
│       └── store/           # Game state (React Context + useReducer)
├── server/                  # WebSocket multiplayer server
└── vercel.json              # Deployment config
```

## Multiplayer

The WebSocket server syncs player positions in real-time. Set the `VITE_WS_URL` environment variable to point to your server:

```bash
VITE_WS_URL=wss://your-server.com
```

## Levels

| Level | Name | Theme |
|-------|------|-------|
| 0 | Threshold | Mono-yellow rooms, fluorescent buzz |
| 1 | Habitable Zone | Gray concrete, dim overhead lights |
| 2 | Utility Halls | Dark green pipes, narrow corridors |
| 3 | Electrical Station | Red emergency lights, industrial |
| 4 | Abandoned Office | Blue-gray carpet, cubicle walls |

## Contributing

Contributions welcome! You can add:
- New levels with unique configs
- New entity types with AI behaviors
- New collectible items
- Performance improvements
- Bug fixes

## License

MIT — free to use, modify, and distribute.

## Credits

Built with love as a tribute to the Backrooms community and wiki contributors.
