# 墟界 ── Manus AI 教育與使用 SOP
> 用途：讓Manus AI能夠正確理解、讀取、使用墟界專案文件
> 日期：2026-03-28｜版本：v1.0

---

## 🎯 目的

本SOP定義Manus AI讀取墟界專案文件、理解遊戲設計、共用Claude Code操縱遊戲系統的標準流程。

---

## 📖 第一階段：理解專案（首次接觸必讀）

### Step 1：閱讀文件索引
**必讀檔案**：`xu-jie-TEAM/DESIGN/README-專案文件索引.md`

此檔案包含：
- 所有文件的用途說明
- 閱讀順序建議
- 當前已確認的共識
- 待裁決事項

### Step 2：閱讀核心屬性系統
**必讀檔案**：`xu-jie-TEAM/DESIGN/GD-024-全域屬性系統統一規格書.md`

理解以下內容後才能開始任何實作：
```
1. 統一屬性欄位（11項：HP/MP/ATK/DEF/SPD/MATK/MDEF + 5抗性）
2. 傷害公式：ATK×1.5 - DEF×0.5 × (1-抗性%)
3. 五行剋制：木>土>水>火>金>木（+20%/-20%）
4. 玩家結算公式：HP = Lv×12+80 + (木注靈÷100)×30 + 裝備
5. 五行抗性：min(50%, 對應注靈÷20)
```

### Step 3：理解組織分工
```
大管家（COO）→ 分派任務、統合、匯報
遊戲企劃 → 遊戲內容設計、數值平衡
架站顧問 → 系統實作、資料庫、部署
美術顧問 → 視覺、音樂、AI生成
市場分析師 → 商業模式、競品分析
文書助理 → 文件整理
```

---

## 📂 第二階段：讀取與使用數據

### 遊戲參數設定檔
**檔案**：`xu-jie-TEAM/DESIGN/game_params.json`

此檔案是所有可調整參數的**單一真相來源**。修改前需確認格式。
```json
{
  "growth": { ... },       // 等級成長參數
  "zhuling": { ... },      // 注靈加成
  "resistance": { ... },   // 抗性設定
  "equipment": { ... },    // 裝備加成
  "battleFormula": { ... },// 戰鬥公式
  "bosses": [ ... ]        // 14隻Boss屬性
}
```

### 裝備數據
**檔案**：`xu-jie-TEAM/DESIGN/equipment_catalog_fixed.csv`
- rarity標準：white→legendary / purple→epic / orange→uncommon / blue→rare / red→common
- valueScore公式：HP×1.0 + ATK×4.0 + DEF×3.5 + SPD×2.5 + 抗性×2.0 + 特殊效果power

### Boss屬性
**檔案**：`xu-jie-TEAM/DESIGN/GD-022-小王角色設計書-v1.1.md`
- 14隻Boss完整數值
- 死亡騎士：HP=25000, ATK=200, DEF=200（最終共識）

---

## 🔧 第三階段：實作規範

### 資料庫操作
**必讀**：`xu-jie-TEAM/DESIGN/GD-024-系統Agent建庫指引.md`

#### 新增欄位（所有角色表）
```sql
ALTER TABLE [table] ADD COLUMN element VARCHAR(10) DEFAULT 'none';
ALTER TABLE [table] ADD COLUMN wood_res INT DEFAULT 0;
ALTER TABLE [table] ADD COLUMN fire_res INT DEFAULT 0;
ALTER TABLE [table] ADD COLUMN earth_res INT DEFAULT 0;
ALTER TABLE [table] ADD COLUMN metal_res INT DEFAULT 0;
ALTER TABLE [table] ADD COLUMN water_res INT DEFAULT 0;
```

#### 抗性計算（JS）
```javascript
function calcResistance(infusionValue) {
  return Math.min(50, Math.floor(infusionValue / 20));
}
```

#### 傷害公式（JS）
```javascript
function calcDamage(attacker, defender, isMagic = false) {
  const atk = isMagic ? attacker.matk : attacker.atk;
  const def = isMagic ? defender.mdef : defender.def;
  const base = Math.max(1, Math.floor(atk * 1.5 - def * 0.5));
  const resistKey = attacker.element + '_res'; // e.g. 'fire_res'
  const resist = defender[resistKey] || 0;
  const elemental = getElementalModifier(attacker.element, defender.element);
  return Math.floor(base * (1 - resist / 100) * elemental);
}
```

### Git提交規範
```
格式：[類型] 簡短描述
類型：feat(新功能) / fix(修正) / update(更新) / docs(文件)
範例：[feat] 新增五行抗性欄位至怪物資料表
```

### 檔案命名規範
```
YYYYMMDD-專案名稱-版本-類型.md
例：20260328-墟界Boss屬性更新-v1-DESIGN.md
```

---

## ⚠️ 重要約束

### ❌ 不可自行決策的事項
以下事項必須回報大管家，由Boss裁決：
- 任何屬性數值的最終修改
- 新系統的立項（如衝裝系統）
- 傷害公式的變更
- Boss數值的最終確認

### ✅ 可以自行實作的事項
- 根據 GD-024-系統Agent建庫指引 新增資料庫欄位
- 根據既有公式實作計算邏輯
- 更新既有檔案的格式和說明（不改動數值共識）
- 修正明顯的格式錯誤或typo

### 數值共識（不可擅自修改）
```
HP公式：Lv×12+80 + (木注靈÷100)×30 + 裝備
ATK公式：Lv×8+15 + (火注靈÷100)×20 + 裝備
抗性公式：min(50%, 注靈÷20)
傷害公式：ATK×1.5 - DEF×0.5 × (1-抗性%)
死亡騎士：HP=25000, ATK=200, DEF=200
```

---

## 📞 匯報流程

```
Manus AI
   ↓（完成後）
大管家（審核、統合）
   ↓（確認無誤後）
Boss（裁決或確認）
```

### 匯報格式
```
[任務]：（簡短描述）
[狀態]：[已完成 / 進行中 / 需裁決]
[產出]：（上傳的檔案或commit hash）
[待確認]：（需要Boss裁決的事項）
```

---

## 🔗 快速連結

| 資源 | 連結 |
|------|------|
| Repo | https://github.com/hiyomarket/xu-jie |
| 檔案索引 | DESIGN/README-專案文件索引.md |
| 核心規格 | DESIGN/GD-024-全域屬性系統統一規格書.md |
| 建庫指引 | DESIGN/GD-024-系統Agent建庫指引.md |
| 參數設定 | DESIGN/game_params.json |
