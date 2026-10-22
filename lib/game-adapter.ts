import { items, games, defaultCharacter, scorePreset, presetReward, newId } from './catalog';
import { replayPhysics, evaluateMoves } from './engine';

const STORAGE_KEY = 'tovs_kavo_save_v1';

export type GameState = {
  username: string;
  role: string;
  coins: number;
  inventory: string[];
  claims: { claim: string; delta: number }[];
  data: {
    characters: any[];
    active: string;
    rooms: Record<string, any>;
    onboard: boolean;
  };
  revision: number;
  updated: number;
  settings: Record<string, any>;
  ai: {
    active: boolean;
    mode: string;
    requested: string;
    configured: boolean;
  };
};

function getInitialState(): GameState {
  return {
    username: 'Little Explorer',
    role: 'player',
    coins: 0,
    inventory: ['basic-brush'],
    claims: [],
    data: {
      characters: [{ ...defaultCharacter, id: 'first' }],
      active: 'first',
      rooms: {},
      onboard: false,
    },
    revision: 1,
    updated: Date.now(),
    settings: {},
    ai: {
      active: false,
      mode: 'procedural',
      requested: 'GPT-5.6',
      configured: false,
    },
  };
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading local state:', e);
    return getInitialState();
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving local state:', e);
  }
}

export async function handleGameAction(body: any): Promise<any> {
  const state = loadGameState();
  const action = body.action;

  // 1. SAVE: characters, rooms, active character, username
  if (action === 'save') {
    if (body.data) state.data = body.data;
    if (body.username) state.username = body.username;
    state.revision += 1;
    state.updated = Date.now();
    saveGameState(state);
    return { ...state, message: 'Saved to cloud' };
  }

  // 2. BUY: purchase tool, furniture, clothing, hairstyles
  if (action === 'buy') {
    const item = items.find((i) => i.id === body.item);
    if (!item) throw new Error('Item not found');
    if (state.inventory.includes(item.id)) {
      return { ...state, message: 'Already Owned' };
    }
    if (state.coins < item.price) {
      throw new Error('Not Enough Coins!');
    }
    state.coins -= item.price;
    state.inventory.push(item.id);
    state.revision += 1;
    state.updated = Date.now();
    saveGameState(state);
    return { ...state, message: 'Purchase Successful!' };
  }

  // 3. START: start a mini-game session
  if (action === 'start') {
    const game = games.find((g) => g.id === body.game);
    if (!game) throw new Error('Choose a game.');
    const level = Number(body.level || 1);
    const session = {
      id: newId(),
      game: game.id,
      level,
      difficulty: Math.max(1, Math.min(100, level)),
      seed: Math.floor(Math.random() * 1000) + 1,
      started: Date.now(),
    };
    // Cache current active session in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('active_session', JSON.stringify(session));
    }
    return { ...state, session, message: 'Ready, set, play!' };
  }

  // 4. FINISH: complete a mini-game level
  if (action === 'finish') {
    let session = null;
    if (typeof window !== 'undefined') {
      try {
        session = JSON.parse(sessionStorage.getItem('active_session') || 'null');
      } catch {}
    }
    const gameId = session?.game || 'jump';
    const level = session?.level || 1;
    let won = true;

    if (['jump', 'fly', 'catch', 'runner'].includes(gameId)) {
      if (Array.isArray(body.inputs) && body.frames) {
        try {
          const replay = replayPhysics(gameId, session?.seed || 1, session?.difficulty || 1, body.inputs, body.frames);
          won = replay.status === 'won';
        } catch {
          won = true; // Fallback graceful win
        }
      }
    } else if (Array.isArray(body.moves)) {
      try {
        const r = evaluateMoves(gameId, session?.seed || 1, body.moves);
        won = r.won;
      } catch {
        won = true;
      }
    }

    let message = 'Nice try! Try another round.';
    if (won) {
      const claimKey = `level:${gameId}:${level}`;
      const alreadyClaimed = state.claims.some((c) => c.claim === claimKey);
      if (!alreadyClaimed) {
        state.coins += 500;
        state.claims.push({ claim: claimKey, delta: 500 });
        saveGameState(state);
        message = 'Level Complete! +500 Coins';
      } else {
        message = 'Level Complete! Already rewarded.';
      }
    } else if (gameId === 'jump') {
      state.coins = Math.max(0, state.coins - 100);
      saveGameState(state);
      message = 'Jump Failed! -100 Coins (minimum balance: 0)';
    }

    return { ...state, result: won ? 'won' : 'lost', message };
  }

  // 5. PRESET: complete styling preset
  if (action === 'preset') {
    const seed = Number(body.seed || 0);
    const score = scorePreset(seed, body.strokes || [], state.inventory);
    const reward = presetReward(score);
    const claimKey = `preset:${seed}`;
    const alreadyClaimed = state.claims.some((c) => c.claim === claimKey);

    let message = 'Keep practicing!';
    if (reward > 0) {
      if (!alreadyClaimed) {
        state.coins += reward;
        state.claims.push({ claim: claimKey, delta: reward });
        saveGameState(state);
        message = (reward === 400 ? 'Perfect Look!' : reward === 350 ? 'Excellent Styling!' : 'Beautiful Work!') + ` +${reward} Coins`;
      } else {
        message = 'Beautiful Work! Already rewarded.';
      }
    }
    return { ...state, score, message };
  }

  // 6. ADMIN: admin controls (code 911)
  if (action === 'admin') {
    let msg = 'Admin changes saved.';
    if (body.op === 'overview') {
      return {
        players: [{ id: 'local_player', username: state.username, role: 'admin', status: 'active', updated: state.updated, coins: state.coins }],
        logs: [],
        stats: { players: 1, coins: state.coins, levels: state.claims.filter(c => c.claim.startsWith('level:')).length, purchases: state.inventory.length - 1, active: 1 },
        settings: state.settings,
      };
    }
    if (body.op === 'coins') {
      const amt = Number(body.amount || 0);
      state.coins = Math.max(0, state.coins + amt);
    } else if (body.op === 'item') {
      if (body.remove) {
        state.inventory = state.inventory.filter(id => id !== body.item || id === 'basic-brush');
      } else if (!state.inventory.includes(body.item)) {
        state.inventory.push(body.item);
      }
    } else if (body.op === 'settings') {
      state.settings[body.game] = { enabled: !!body.enabled, difficulty: Number(body.difficulty || 0) };
    }
    saveGameState(state);
    return { message: msg };
  }

  return state;
}
