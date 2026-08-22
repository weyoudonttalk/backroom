import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ItemPickup } from './ItemPickup';
import { ITEMS, ItemDef } from '../items/ItemData';
import { useGame } from '../store/GameContext';
import { playPickupSound } from '../audio/sfx';

interface SpawnedItem {
  id: number;
  def: ItemDef;
  position: [number, number, number];
  collected: boolean;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function ItemManager() {
  const { state, dispatch } = useGame();
  const { camera } = useThree();
  const [items, setItems] = useState<SpawnedItem[]>([]);
  const initialized = useRef(-1);
  const playerPos = useRef(new THREE.Vector3());

  if (initialized.current !== state.level) {
    const spawned: SpawnedItem[] = [];
    const itemCount = 40;
    const totalRarity = ITEMS.reduce((s, it) => s + it.rarity, 0);

    for (let i = 0; i < itemCount; i++) {
      const seed = i * 17 + state.level * 1000;
      const r = seededRandom(seed) * totalRarity;

      let cumulative = 0;
      let selectedItem = ITEMS[0];
      for (const item of ITEMS) {
        cumulative += item.rarity;
        if (r < cumulative) {
          selectedItem = item;
          break;
        }
      }

      const angle = seededRandom(seed + 1) * Math.PI * 2;
      const dist = 10 + seededRandom(seed + 2) * 70;

      spawned.push({
        id: i,
        def: selectedItem,
        position: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        collected: false,
      });
    }

    setItems(spawned);
    initialized.current = state.level;
  }

  useFrame(() => {
    playerPos.current.set(camera.position.x, 0, camera.position.z);
  });

  const handlePickup = (item: SpawnedItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, collected: true } : i));

    const effect = item.def.effect;
    if (effect.health && effect.health > 0) {
      dispatch({ type: 'HEAL', amount: effect.health });
      playPickupSound('health');
    } else if (effect.water) {
      dispatch({ type: 'RESTORE_WATER', amount: effect.water });
      playPickupSound('water');
    } else if (effect.food) {
      dispatch({ type: 'RESTORE_FOOD', amount: effect.food });
      playPickupSound('food');
    } else {
      playPickupSound('generic');
    }
    if (effect.health && effect.health < 0) dispatch({ type: 'DAMAGE', amount: -effect.health });
    dispatch({ type: 'ADD_ITEM', item: { id: item.def.id, name: item.def.name, quantity: 1 } });
  };

  const visible = items.filter(i => {
    if (i.collected) return false;
    const dx = i.position[0] - playerPos.current.x;
    const dz = i.position[2] - playerPos.current.z;
    return dx * dx + dz * dz < 1600;
  });

  return (
    <>
      {visible.map(item => (
        <ItemPickup
          key={item.id}
          def={item.def}
          position={item.position}
          playerPos={playerPos.current}
          onPickup={() => handlePickup(item)}
        />
      ))}
    </>
  );
}
