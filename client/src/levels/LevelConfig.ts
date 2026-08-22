export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  ambientColor: string;
  lightColor: string;
  lightIntensity: number;
  roomSize: number;
  wallDensity: number;
  entityPool: string[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 0,
    name: '层级 0',
    subtitle: '阈限空间',
    wallColor: '#c8b060',
    floorColor: '#6b5a35',
    ceilingColor: '#d4c890',
    fogColor: '#8b7940',
    fogNear: 15,
    fogFar: 50,
    ambientIntensity: 0.6,
    ambientColor: '#c8a850',
    lightColor: '#fffde0',
    lightIntensity: 1.2,
    roomSize: 4,
    wallDensity: 0.45,
    entityPool: ['smiler', 'dullers', 'deathmoths', 'clumps'],
  },
  {
    id: 1,
    name: '层级 1',
    subtitle: '宜居区',
    wallColor: '#707070',
    floorColor: '#4a4a4a',
    ceilingColor: '#5a5a5a',
    fogColor: '#2a2a2a',
    fogNear: 10,
    fogFar: 40,
    ambientIntensity: 0.3,
    ambientColor: '#8090a0',
    lightColor: '#c0d0e0',
    lightIntensity: 0.8,
    roomSize: 6,
    wallDensity: 0.4,
    entityPool: ['hound', 'wretches', 'crawlers', 'skin-stealer', 'clumps'],
  },
  {
    id: 2,
    name: '层级 2',
    subtitle: '废弃设备走廊',
    wallColor: '#3d4a3a',
    floorColor: '#2a3028',
    ceilingColor: '#3a3a30',
    fogColor: '#1a2018',
    fogNear: 8,
    fogFar: 35,
    ambientIntensity: 0.2,
    ambientColor: '#506040',
    lightColor: '#80a060',
    lightIntensity: 0.6,
    roomSize: 3,
    wallDensity: 0.5,
    entityPool: ['crawlers', 'death-rats', 'dullers', 'wretches', 'smiler', 'clumps'],
  },
  {
    id: 3,
    name: '层级 3',
    subtitle: '电气站',
    wallColor: '#4a4040',
    floorColor: '#3a3030',
    ceilingColor: '#4a3a3a',
    fogColor: '#2a1515',
    fogNear: 8,
    fogFar: 30,
    ambientIntensity: 0.15,
    ambientColor: '#a03020',
    lightColor: '#ff4020',
    lightIntensity: 0.7,
    roomSize: 5,
    wallDensity: 0.45,
    entityPool: ['hound', 'partygoers', 'crawlers', 'death-rats', 'skin-stealer'],
  },
  {
    id: 4,
    name: '层级 4',
    subtitle: '废弃办公室',
    wallColor: '#7080a0',
    floorColor: '#4a5060',
    ceilingColor: '#90a0b0',
    fogColor: '#3a4050',
    fogNear: 12,
    fogFar: 45,
    ambientIntensity: 0.4,
    ambientColor: '#8090b0',
    lightColor: '#d0e0ff',
    lightIntensity: 0.9,
    roomSize: 4,
    wallDensity: 0.4,
    entityPool: ['partygoers', 'dullers', 'smiler', 'deathmoths', 'facelings'],
  },
];
