export interface ItemDef {
  id: string;
  name: string;
  objectNumber: number;
  color: string;
  emissive: string;
  shape: 'sphere' | 'box' | 'cylinder';
  scale: [number, number, number];
  effect: ItemEffect;
  description: string;
  rarity: number;
}

export interface ItemEffect {
  health?: number;
  water?: number;
  food?: number;
  repellent?: number;
  key?: boolean;
  damage?: number;
  speed?: number;
  light?: number;
  shield?: number;
}

export const ITEMS: ItemDef[] = [
  { id: 'almond-water', name: '杏仁水', objectNumber: 1, color: '#e8d8a0', emissive: '#ffe080', shape: 'cylinder', scale: [0.1, 0.25, 0.1], effect: { water: 30, health: 10 }, description: '后室的生命之源。', rarity: 0.12 },
  { id: 'level-key', name: '层级钥匙', objectNumber: 2, color: '#ffd700', emissive: '#ffaa00', shape: 'box', scale: [0.15, 0.08, 0.04], effect: { key: true }, description: '打开通往下一层的通道。', rarity: 0.02 },
  { id: 'smiler-repellent', name: '笑魇驱散剂', objectNumber: 3, color: '#80ff80', emissive: '#40cc40', shape: 'cylinder', scale: [0.08, 0.2, 0.08], effect: { repellent: 30 }, description: '30秒内驱散实体。', rarity: 0.04 },
  { id: 'candy', name: '糖果', objectNumber: 5, color: '#ff6688', emissive: '#ff4466', shape: 'sphere', scale: [0.08, 0.08, 0.08], effect: { food: 20 }, description: '包装纸里找到的甜食。', rarity: 0.14 },
  { id: 'mirror', name: '镜子', objectNumber: 6, color: '#c0c0c0', emissive: '#ffffff', shape: 'box', scale: [0.15, 0.2, 0.02], effect: { health: 5 }, description: '映出本不该存在的倒影。', rarity: 0.02 },
  { id: 'memory-jar', name: '记忆罐', objectNumber: 7, color: '#9060c0', emissive: '#7040a0', shape: 'cylinder', scale: [0.08, 0.15, 0.08], effect: { health: 15 }, description: '盛装着被遗忘的记忆碎片。', rarity: 0.03 },
  { id: 'ghost-light', name: '幽灵之光', objectNumber: 11, color: '#aaffee', emissive: '#66ffcc', shape: 'sphere', scale: [0.12, 0.12, 0.12], effect: { light: 60 }, description: '照亮周围60秒。', rarity: 0.05 },
  { id: 'mortality-shard', name: '死亡碎片', objectNumber: 12, color: '#ff2222', emissive: '#cc0000', shape: 'box', scale: [0.06, 0.18, 0.06], effect: { damage: 40 }, description: '结晶化的死亡，可投掷武器。', rarity: 0.03 },
  { id: 'scaraback', name: '圣甲虫', objectNumber: 14, color: '#228844', emissive: '#116633', shape: 'sphere', scale: [0.07, 0.07, 0.07], effect: { shield: 20 }, description: '能吸收伤害的活甲虫。', rarity: 0.04 },
  { id: 'firesalt', name: '火盐', objectNumber: 15, color: '#ff4400', emissive: '#ff2200', shape: 'sphere', scale: [0.1, 0.1, 0.1], effect: { damage: 25 }, description: '接触即灼烧实体。', rarity: 0.06 },
  { id: 'royal-rations', name: '皇室口粮', objectNumber: 16, color: '#aa8833', emissive: '#886622', shape: 'box', scale: [0.2, 0.12, 0.15], effect: { food: 50 }, description: '一顿皇室规格的正餐。', rarity: 0.05 },
  { id: 'liquid-silence', name: '沉默之液', objectNumber: 17, color: '#2020aa', emissive: '#1010cc', shape: 'cylinder', scale: [0.07, 0.18, 0.07], effect: { repellent: 45 }, description: '消弭一切声音，实体听不见你。', rarity: 0.03 },
  { id: 'phonograph', name: '留声机', objectNumber: 18, color: '#8b4513', emissive: '#5a2d0a', shape: 'cylinder', scale: [0.15, 0.12, 0.15], effect: { health: 20 }, description: '播放抚慰心灵的音乐。', rarity: 0.02 },
  { id: 'clumpshot', name: '肉团弹', objectNumber: 23, color: '#556b2f', emissive: '#3a4a1f', shape: 'sphere', scale: [0.12, 0.12, 0.12], effect: { damage: 30 }, description: '有机投射物，能眩晕实体。', rarity: 0.04 },
  { id: 'maidens-ink', name: '少女之墨', objectNumber: 26, color: '#1a1a2e', emissive: '#3030aa', shape: 'cylinder', scale: [0.06, 0.14, 0.06], effect: { health: 25, water: 10 }, description: '具有恢复功效的墨汁。', rarity: 0.03 },
  { id: '3d-glasses', name: '3D视觉眼镜', objectNumber: 29, color: '#ff0066', emissive: '#00ccff', shape: 'box', scale: [0.14, 0.05, 0.04], effect: { light: 120 }, description: '揭示隐藏通道与实体。', rarity: 0.02 },
  { id: 'robopet', name: '机器宠物', objectNumber: 33, color: '#c0c0c0', emissive: '#80ff80', shape: 'box', scale: [0.1, 0.08, 0.12], effect: { repellent: 60 }, description: '机械伙伴，能吓退小型实体。', rarity: 0.02 },
  { id: 'dark-vial', name: '黑暗修复瓶', objectNumber: 35, color: '#2a0040', emissive: '#6600aa', shape: 'cylinder', scale: [0.06, 0.16, 0.06], effect: { health: 40 }, description: '用暗能量治愈伤口。', rarity: 0.03 },
  { id: 'spirit-link', name: '灵魂链接', objectNumber: 36, color: '#aaeeff', emissive: '#66ccff', shape: 'sphere', scale: [0.09, 0.09, 0.09], effect: { shield: 30 }, description: '吸收伤害的灵质纽带。', rarity: 0.03 },
  { id: 'star-candy', name: '星星糖', objectNumber: 37, color: '#ffee44', emissive: '#ffdd00', shape: 'sphere', scale: [0.06, 0.06, 0.06], effect: { food: 15, speed: 10 }, description: '短暂提升移速。', rarity: 0.08 },
  { id: 'red-light-white-light', name: '红白之光', objectNumber: 38, color: '#ff4444', emissive: '#ffffff', shape: 'sphere', scale: [0.1, 0.1, 0.1], effect: { damage: 35, light: 30 }, description: '双用途：照明兼武器。', rarity: 0.02 },
  { id: 'infinite-book', name: '无限之书', objectNumber: 39, color: '#4a2800', emissive: '#aa8844', shape: 'box', scale: [0.12, 0.16, 0.08], effect: { health: 10 }, description: '内含无限页知识。', rarity: 0.02 },
  { id: 'electrical-outlet', name: '电源插座', objectNumber: 41, color: '#f0f0f0', emissive: '#ffff44', shape: 'box', scale: [0.08, 0.1, 0.04], effect: { damage: 20 }, description: '便携式电击装置。', rarity: 0.04 },
  { id: 'lightning-bottle', name: '瓶中闪电', objectNumber: 42, color: '#4488ff', emissive: '#88ccff', shape: 'cylinder', scale: [0.08, 0.2, 0.08], effect: { damage: 50 }, description: '毁灭性的电击释放。', rarity: 0.01 },
  { id: 'cashew-water', name: '腰果水', objectNumber: 44, color: '#d0c080', emissive: '#c0a040', shape: 'cylinder', scale: [0.1, 0.25, 0.1], effect: { water: 50 }, description: '上等的补水来源。', rarity: 0.07 },
  { id: 'ariadnes-string', name: '阿里阿德涅之线', objectNumber: 45, color: '#ff8800', emissive: '#cc6600', shape: 'sphere', scale: [0.1, 0.1, 0.1], effect: { light: 300 }, description: '发光丝线，标记你的路径。', rarity: 0.02 },
  { id: 'silver-tongue', name: '银舌', objectNumber: 46, color: '#c0c0c0', emissive: '#e0e0e0', shape: 'box', scale: [0.04, 0.12, 0.04], effect: { repellent: 20 }, description: '短暂安抚敌意实体。', rarity: 0.03 },
  { id: 'backrom', name: '后室ROM', objectNumber: 47, color: '#333333', emissive: '#00ff00', shape: 'box', scale: [0.1, 0.06, 0.1], effect: { health: 5 }, description: '损坏的数据卡带。', rarity: 0.04 },
  { id: 'liquid-pain', name: '痛苦之液', objectNumber: 48, color: '#880000', emissive: '#ff0000', shape: 'cylinder', scale: [0.07, 0.16, 0.07], effect: { damage: 60 }, description: '给实体造成剧痛，小心使用。', rarity: 0.02 },
  { id: 'compression-cube', name: '压缩方块', objectNumber: 49, color: '#4444ff', emissive: '#2222cc', shape: 'box', scale: [0.1, 0.1, 0.1], effect: { shield: 40 }, description: '压缩周围空间形成护盾。', rarity: 0.02 },
  { id: 'voidstone', name: '虚空石', objectNumber: 50, color: '#0a0a0a', emissive: '#440066', shape: 'sphere', scale: [0.08, 0.08, 0.08], effect: { damage: 45, health: -10 }, description: '强大但会损耗你的生命力。', rarity: 0.02 },
  { id: 'pockets', name: '口袋', objectNumber: 51, color: '#8b7355', emissive: '#6b5335', shape: 'box', scale: [0.12, 0.08, 0.06], effect: { food: 10 }, description: '内含随机小补给。', rarity: 0.06 },
  { id: 'prayer-glass', name: '祈愿玻璃', objectNumber: 59, color: '#eeeeff', emissive: '#aaaaff', shape: 'cylinder', scale: [0.06, 0.2, 0.06], effect: { health: 30, shield: 15 }, description: '圣物，治愈并守护。', rarity: 0.02 },
  { id: 'throne', name: '王座', objectNumber: 60, color: '#ffd700', emissive: '#ffaa00', shape: 'box', scale: [0.2, 0.25, 0.2], effect: { health: 50, food: 50, water: 50 }, description: '坐下即可恢复。极度稀有。', rarity: 0.005 },
  { id: 'whisperer', name: '低语者', objectNumber: 64, color: '#404060', emissive: '#6060aa', shape: 'sphere', scale: [0.09, 0.09, 0.09], effect: { repellent: 15 }, description: '低语警告附近的实体。', rarity: 0.05 },
  { id: 'chocobytes', name: '巧可字节', objectNumber: 67, color: '#4a2800', emissive: '#6b3a10', shape: 'box', scale: [0.1, 0.06, 0.06], effect: { food: 25, health: 5 }, description: '数字巧克力，出奇地顶饱。', rarity: 0.08 },
  { id: 'ottava-lamp', name: '奥塔瓦灯', objectNumber: 68, color: '#ffcc00', emissive: '#ffaa00', shape: 'cylinder', scale: [0.08, 0.22, 0.08], effect: { light: 90 }, description: '便携灯，持久发光。', rarity: 0.04 },
  { id: 'corpse', name: '尸体', objectNumber: 70, color: '#5a4a3a', emissive: '#3a2a1a', shape: 'box', scale: [0.2, 0.08, 0.4], effect: { food: 5 }, description: '流浪者的遗骸，可能带有补给。', rarity: 0.06 },
  { id: 'pixie-gun', name: '精灵枪', objectNumber: 71, color: '#ff66ff', emissive: '#cc44cc', shape: 'box', scale: [0.06, 0.1, 0.16], effect: { damage: 15 }, description: '发射闪烁的弹丸。', rarity: 0.03 },
  { id: 'supergreen-apple', name: '超绿苹果', objectNumber: 73, color: '#00cc00', emissive: '#00ff00', shape: 'sphere', scale: [0.09, 0.09, 0.09], effect: { food: 35, health: 15 }, description: '绿得不自然，营养极高。', rarity: 0.05 },
  { id: 'warpberry', name: '曲莓', objectNumber: 74, color: '#8800ff', emissive: '#aa44ff', shape: 'sphere', scale: [0.06, 0.06, 0.06], effect: { speed: 20 }, description: '扭曲感知，提升速度。', rarity: 0.04 },
  { id: 'chekhov-gun', name: '契诃夫之枪', objectNumber: 75, color: '#444444', emissive: '#888888', shape: 'box', scale: [0.06, 0.08, 0.18], effect: { damage: 70 }, description: '若出现，必将发射。', rarity: 0.01 },
  { id: 'radio', name: '便携收音机', objectNumber: 77, color: '#2a2a2a', emissive: '#44aa44', shape: 'box', scale: [0.1, 0.14, 0.04], effect: { repellent: 10 }, description: '播放静电噪音，某些实体不喜欢。', rarity: 0.05 },
  { id: 'blue-gel', name: '蓝色凝胶', objectNumber: 78, color: '#2266ff', emissive: '#4488ff', shape: 'sphere', scale: [0.1, 0.08, 0.1], effect: { health: 20, water: 20 }, description: '凝胶状的治疗物质。', rarity: 0.05 },
  { id: 'sage-crystal', name: '贤者水晶', objectNumber: 82, color: '#88cc88', emissive: '#44aa44', shape: 'box', scale: [0.06, 0.14, 0.06], effect: { health: 35, repellent: 20 }, description: '净化水晶，治愈兼驱邪。', rarity: 0.02 },
  { id: 'agrugua-fruit', name: '阿格鲁瓜果', objectNumber: 85, color: '#cc6600', emissive: '#aa4400', shape: 'sphere', scale: [0.1, 0.1, 0.1], effect: { food: 40, water: 15 }, description: '异域水果，饱腹解渴。', rarity: 0.04 },
  { id: 'worn-sack', name: '破旧麻袋', objectNumber: 87, color: '#8b7355', emissive: '#5a4a30', shape: 'box', scale: [0.14, 0.12, 0.1], effect: { food: 20, water: 10 }, description: '内含杂七杂八的补给。', rarity: 0.06 },
  { id: 'light-wire', name: '光之线', objectNumber: 90, color: '#ffff88', emissive: '#ffff00', shape: 'cylinder', scale: [0.03, 0.3, 0.03], effect: { light: 45, damage: 10 }, description: '发光丝线，可作光源兼鞭子。', rarity: 0.03 },
  { id: 'super-almond-water', name: '超级杏仁水', objectNumber: 100, color: '#ffffff', emissive: '#aaffff', shape: 'cylinder', scale: [0.12, 0.3, 0.12], effect: { health: 100, water: 100 }, description: '完全恢复，极度稀有。', rarity: 0.008 },
  { id: 'frvyo-jade', name: '弗瑞沃玉', objectNumber: 101, color: '#00aa66', emissive: '#00ff88', shape: 'sphere', scale: [0.07, 0.07, 0.07], effect: { health: 60, shield: 25 }, description: '具有治愈共鸣的玉石。', rarity: 0.015 },
  { id: 'halo-antiserum', name: '光环抗毒血清', objectNumber: 201, color: '#ffddaa', emissive: '#ffcc88', shape: 'cylinder', scale: [0.06, 0.18, 0.06], effect: { health: 80 }, description: '治愈一切疾病与毒素。', rarity: 0.01 },
  { id: 'hyrum-lantern', name: '海勒姆灯笼', objectNumber: 216, color: '#ffaa44', emissive: '#ff8800', shape: 'cylinder', scale: [0.1, 0.18, 0.1], effect: { light: 180, repellent: 15 }, description: '古老灯笼，驱散黑暗。', rarity: 0.015 },
  { id: 'seer-tea', name: '先知茶', objectNumber: 365, color: '#88aa44', emissive: '#66882a', shape: 'cylinder', scale: [0.08, 0.12, 0.08], effect: { water: 40, health: 20 }, description: '短暂获得清晰视野。', rarity: 0.03 },
  { id: 'dice-of-destiny', name: '命运骰子', objectNumber: 666, color: '#ff0000', emissive: '#880000', shape: 'box', scale: [0.08, 0.08, 0.08], effect: { health: -20, damage: 80 }, description: '掷骰子，巨大力量伴随巨大代价。', rarity: 0.008 },
  { id: 'dumb-gum', name: '笨糖', objectNumber: 9, color: '#ff88cc', emissive: '#ff66aa', shape: 'sphere', scale: [0.05, 0.05, 0.05], effect: { food: 5 }, description: '可咀嚼，几乎没营养。', rarity: 0.1 },
  { id: 'scarecrow', name: '稻草人', objectNumber: 10, color: '#8b6914', emissive: '#5a4a0a', shape: 'cylinder', scale: [0.12, 0.35, 0.12], effect: { repellent: 40 }, description: '放下它，实体会避开该区域。', rarity: 0.02 },
  { id: 'backrooms-tcg', name: '后室卡牌', objectNumber: 40, color: '#4488cc', emissive: '#2266aa', shape: 'box', scale: [0.1, 0.14, 0.07], effect: { health: 5 }, description: '集换卡牌，可收藏但没用。', rarity: 0.06 },
  { id: 'tarot-deck', name: '塔罗牌', objectNumber: 43, color: '#6b2fa0', emissive: '#8844cc', shape: 'box', scale: [0.08, 0.12, 0.05], effect: { health: 10 }, description: '抽一张牌，小小的占卜。', rarity: 0.04 },
  { id: 'reality-freshener', name: '现实清新剂', objectNumber: 32, color: '#88ffaa', emissive: '#44cc66', shape: 'cylinder', scale: [0.06, 0.14, 0.06], effect: { health: 15, repellent: 10 }, description: '短暂稳定局部现实。', rarity: 0.03 },
  { id: 'ouija-board', name: '通灵板', objectNumber: 31, color: '#3a2a1a', emissive: '#aa8844', shape: 'box', scale: [0.2, 0.02, 0.15], effect: { health: -5 }, description: '与……某种东西沟通。', rarity: 0.02 },
  { id: 'wall-mask', name: '壁面具', objectNumber: 24, color: '#d4c4a0', emissive: '#aa9060', shape: 'box', scale: [0.12, 0.15, 0.04], effect: { shield: 15 }, description: '戴上它，实体可能认不出你。', rarity: 0.03 },
  { id: 'babel-balm', name: '巴别香膏', objectNumber: 25, color: '#cc9944', emissive: '#aa7722', shape: 'cylinder', scale: [0.06, 0.1, 0.06], effect: { health: 25 }, description: '古籍中记载的治疗药膏。', rarity: 0.03 },
];
