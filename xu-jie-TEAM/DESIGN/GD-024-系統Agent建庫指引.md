# 墟界 ── 系統Agent重建指引
> 本檔案為遊戲企劃提供給系統Agent的建庫核心指令
> 日期：2026-03-28｜版本：系統建庫v1

---

## 任務目標

重建墟界遊戲資料庫，實作統一的**全域屬性系統**（玩家/怪物/Boss/寵物共用同一套框架）

---

## 核心改動摘要

| 改動項目 | 說明 |
|---------|------|
| 新增5項抗性欄位 | wood_res, fire_res, earth_res, metal_res, water_res |
| 屬性來源統一 | 玩家=升級+注靈+裝備；怪物=設計師指定；寵物=主人比例+自身Lv |
| 五行屬性綁定 | 所有角色皆有 `element` 欄位 |
| 抗性計算 | `最終傷害 = ATK×1.5-DEF×0.5 × (1-抗性%)` |
| 屬性剋制 | 木>土>水>火>金>木，剋制+20%傷害 |

---

## 一、資料庫欄位新增

### 怪物表（game_monster_catalog）
新增欄位：
```sql
ALTER TABLE game_monster_catalog
  ADD COLUMN element VARCHAR(10) DEFAULT 'none',  -- 木/火/土/金/水/none
  ADD COLUMN wood_res INT DEFAULT 0,
  ADD COLUMN fire_res INT DEFAULT 0,
  ADD COLUMN earth_res INT DEFAULT 0,
  ADD COLUMN metal_res INT DEFAULT 0,
  ADD COLUMN water_res INT DEFAULT 0;
```

### Boss表（如與怪物分表）
同上，新增 `element` + 5項抗性欄位

### 寵物表（game_pet_catalog）
新增欄位：
```sql
ALTER TABLE game_pet_catalog
  ADD COLUMN element VARCHAR(10) DEFAULT 'none',
  ADD COLUMN wood_res INT DEFAULT 0,
  ADD COLUMN fire_res INT DEFAULT 0,
  ADD COLUMN earth_res INT DEFAULT 0,
  ADD COLUMN metal_res INT DEFAULT 0,
  ADD COLUMN water_res INT DEFAULT 0;
```

### 玩家資料表（game_players 或 game_player_stats）
新增欄位：
```sql
ALTER TABLE game_players
  ADD COLUMN element VARCHAR(10) DEFAULT 'none',
  ADD COLUMN wood_res INT DEFAULT 0,
  ADD COLUMN fire_res INT DEFAULT 0,
  ADD COLUMN earth_res INT DEFAULT 0,
  ADD COLUMN metal_res INT DEFAULT 0,
  ADD COLUMN water_res INT DEFAULT 0,
  ADD COLUMN wood_infusion INT DEFAULT 0,
  ADD COLUMN fire_infusion INT DEFAULT 0,
  ADD COLUMN earth_infusion INT DEFAULT 0,
  ADD COLUMN metal_infusion INT DEFAULT 0,
  ADD COLUMN water_infusion INT DEFAULT 0;
```

---

## 二、傷害公式更新

### 實體傷害
```javascript
function calcPhysicalDamage(attacker, defender) {
  const base = Math.max(1, Math.floor(attacker.atk * 1.5 - defender.def * 0.5));
  const resist = 1 - (defender['element_res'] || 0) / 100;
  const elemental = getElementalModifier(attacker.element, defender.element);
  return Math.floor(base * resist * elemental);
}
```

### 魔法傷害
```javascript
function calcMagicDamage(attacker, defender) {
  const base = Math.max(1, Math.floor(attacker.matk * 1.5 - defender.mdef * 0.5));
  const resist = 1 - (defender['element_res'] || 0) / 100;
  const elemental = getElementalModifier(attacker.element, defender.element);
  return Math.floor(base * resist * elemental);
}
```

### 屬性剋制表
```javascript
const ELEMENT_CHART = {
  '木': { strong: '土', weak: '火' },
  '火': { strong: '金', weak: '水' },
  '土': { strong: '水', weak: '木' },
  '金': { strong: '木', weak: '火' },
  '水': { strong: '火', weak: '土' }
};
function getElementalModifier(atkElement, defElement) {
  if (defElement === 'none') return 1;
  const chart = ELEMENT_CHART[atkElement];
  if (chart?.strong === defElement) return 1.2;  // 剋制+20%
  if (chart?.weak === defElement) return 0.8;   // 被剋制-20%
  return 1;
}
```

---

## 三、怪物/Boss 五行抗性自動計算

### 依據怪物屬性自動設定基礎抗性
```javascript
function calcMonsterResist(element, tier = 'T1') {
  const baseRes = {
    '木': { wood: 20 },
    '火': { fire: 20 },
    '土': { earth: 20 },
    '金': { metal: 20 },
    '水': { water: 20 },
    'none': {}
  };
  const tierBonus = { 'T1': 10, 'T2': 20, 'T3': 30 };
  const resist = { wood_res: 0, fire_res: 0, earth_res: 0, metal_res: 0, water_res: 0 };
  if (baseRes[element]) {
    for (const [key, val] of Object.entries(baseRes[element])) {
      resist[key] = val + (tierBonus[tier] || 0);
    }
  }
  return resist;
}
```

---

## 四、寵物屬性計算

```javascript
function calcPetStats(master, petLv) {
  return {
    hp:   Math.floor(master.hp * 0.6 + petLv * 5),
    mp:   Math.floor(master.mp * 0.4),
    atk:  Math.floor(master.atk * 0.35 + petLv * 3),
    def:  Math.floor(master.def * 0.4 + petLv * 2),
    spd:  Math.floor(master.spd * 0.5 + petLv * 2),
    matk: Math.floor(master.matk * 0.3 + petLv * 3),
    mdef: Math.floor(master.mdef * 0.3 + petLv * 2),
  };
}
```

## 五、抗性計算（最終版 v2.0）

```javascript
// 玩家五行抗性
function calcPlayerResistance(infusionValue) {
  return Math.min(50, Math.floor(infusionValue / 15));
}
// 火注靈=1000 → 火抗 = min(50, 1000÷15) ≈ 50%
// 火注靈=500  → 火抗 = min(50, 500÷15)  ≈ 33%
```

---

## 六、抗性上限

| 角色類型 | 抗性上限 |
|---------|---------|
| 玩家 | 50% |
| 怪物 | 100% |
| Boss | 200% |
| 寵物 | 50% |

---

## 六、優先順序

1. **P0**：資料庫欄位新增（怪物/玩家/寵物）
2. **P0**：傷害公式更新（含屬性剋制）
3. **P1**：怪物/Boss抗性計算邏輯
4. **P1**：寵物屬性計算邏輯
5. **P2**：既有怪物資料更新（五行屬性+抗性）
6. **P2**：死亡騎士（等14隻Boss）抗性欄位填寫
