import { createContext, useContext, useReducer, ReactNode } from 'react';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface GameState {
  level: number;
  difficulty: Difficulty;
  health: number;
  water: number;
  food: number;
  inventory: InventoryItem[];
  paused: boolean;
  playerPosition: { x: number; z: number };
  isCrouching: boolean;
  isSprinting: boolean;
}

type GameAction =
  | { type: 'SET_LEVEL'; level: number }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'DAMAGE'; amount: number }
  | { type: 'HEAL'; amount: number }
  | { type: 'DRAIN_WATER'; amount: number }
  | { type: 'RESTORE_WATER'; amount: number }
  | { type: 'DRAIN_FOOD'; amount: number }
  | { type: 'RESTORE_FOOD'; amount: number }
  | { type: 'ADD_ITEM'; item: InventoryItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'SET_PLAYER_POSITION'; x: number; z: number }
  | { type: 'SET_CROUCHING'; value: boolean }
  | { type: 'SET_SPRINTING'; value: boolean }
  | { type: 'RESTART' };

const initialState: GameState = {
  level: 0,
  difficulty: 'normal',
  health: 100,
  water: 100,
  food: 100,
  inventory: [],
  paused: false,
  playerPosition: { x: 0, z: 0 },
  isCrouching: false,
  isSprinting: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, level: action.level };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'DAMAGE':
      return { ...state, health: Math.max(0, state.health - action.amount) };
    case 'HEAL':
      return { ...state, health: Math.min(100, state.health + action.amount) };
    case 'DRAIN_WATER':
      return { ...state, water: Math.max(0, state.water - action.amount) };
    case 'RESTORE_WATER':
      return { ...state, water: Math.min(100, state.water + action.amount) };
    case 'DRAIN_FOOD':
      return { ...state, food: Math.max(0, state.food - action.amount) };
    case 'RESTORE_FOOD':
      return { ...state, food: Math.min(100, state.food + action.amount) };
    case 'ADD_ITEM': {
      const existing = state.inventory.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          inventory: state.inventory.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        };
      }
      return { ...state, inventory: [...state.inventory, action.item] };
    }
    case 'REMOVE_ITEM':
      return { ...state, inventory: state.inventory.filter(i => i.id !== action.id) };
    case 'SET_PAUSED':
      return { ...state, paused: action.paused };
    case 'SET_PLAYER_POSITION':
      return { ...state, playerPosition: { x: action.x, z: action.z } };
    case 'SET_CROUCHING':
      return { ...state, isCrouching: action.value };
    case 'SET_SPRINTING':
      return { ...state, isSprinting: action.value };
    case 'RESTART':
      return { ...initialState, level: state.level, difficulty: state.difficulty };
    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function getDifficultyMultipliers(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return { spawnRate: 0.5, entitySpeed: 0.7, detectionRadius: 0.6 };
    case 'hard':
      return { spawnRate: 1.5, entitySpeed: 1.2, detectionRadius: 1.3 };
    default:
      return { spawnRate: 1, entitySpeed: 1, detectionRadius: 1 };
  }
}
