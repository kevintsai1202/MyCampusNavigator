# 開發指南

## 專案概覽

My Campus Navigator 是一個校園探索遊戲，使用等距視角（2.5D）呈現，玩家可以在隨機生成的校園地圖中探索、參加活動、收集分數。

## 核心架構說明

### 1. 資料流架構

```
User Input (點擊/鍵盤)
    ↓
React Components (UI Layer)
    ↓
Zustand Store (State Management)
    ↓
Core Logic (MapGenerator, PathFinding, etc.)
    ↓
Data Models (TypeScript Interfaces)
```

### 2. 核心模組說明

#### Models (資料模型層)

**Position.ts**
- 定義網格座標和等距座標
- 提供位置計算輔助函數（距離、相鄰格子等）

**MapPosition.ts**
- 定義地圖格子類型（邊界、開放、障礙、地點、起始點）
- 提供可通行性檢查

**Place.ts**
- 定義 5 種地點類型（圖書館、餐廳、運動中心、演講廳、活動中心）
- 提供地點相關的工具函數

**Event.ts**
- 定義 8 種活動類型
- 提供隨機活動名稱生成

**Player.ts**
- 玩家狀態管理
- 統計資訊計算

**CampusMap.ts**
- 地圖資料結構
- 地圖查詢與統計

**GameState.ts**
- 遊戲狀態枚舉
- 設定、存檔、對話框等介面定義

#### Core (核心邏輯層)

**IsometricTransform.ts**
```typescript
// 網格座標 → 等距螢幕座標
gridToIsometric(gridPos, tileWidth, tileHeight) → IsometricPosition

// 等距螢幕座標 → 網格座標
isometricToGrid(isoPos, tileWidth, tileHeight) → Position

// 瓦片碰撞檢測
isPointInTile(clickPos, tilePos, tileWidth, tileHeight) → boolean
```

**PathFinding.ts**
```typescript
// BFS 連通性驗證
validateConnectivity(grid, start, targets) → boolean

// BFS 尋路
findPath(grid, start, end) → Position[] | null

// 取得可達位置
getReachablePositions(grid, start) → Set<string>
```

**MapGenerator.ts**
```typescript
// 主要地圖生成函數
generateCampusMap(config) → CampusMap

// 生成步驟：
// 1. initializeGrid() - 初始化網格
// 2. placePlaces() - 放置地點
// 3. generateObstacles() - 生成障礙物
// 4. setStartPosition() - 設定起始點
// 5. validateConnectivity() - 驗證連通性
// 6. fixConnectivity() - 修復連通性
// 7. generateEventsForPlaces() - 生成活動
```

#### Stores (狀態管理層)

**gameStore.ts** - Zustand Store

主要狀態：
- `status`: GameStatus - 遊戲狀態
- `map`: CampusMap | null - 當前地圖
- `player`: Player | null - 玩家資料
- `settings`: GameSettings - 遊戲設定

主要動作：
- `startNewGame()` - 開始新遊戲
- `movePlayer()` - 移動玩家
- `visitPlace()` - 訪問地點
- `completeEvent()` - 完成活動
- `showDialogBox()` / `hideDialogBox()` - 對話框控制

### 3. 地圖生成演算法詳解

#### 步驟 1：初始化網格
```typescript
// 建立 rows × columns 的二維陣列
// 邊界設為 BOUNDARY，其餘為 OPEN
for (row in 0..rows) {
  for (col in 0..columns) {
    if (邊界) grid[row][col] = BOUNDARY
    else grid[row][col] = OPEN
  }
}
```

#### 步驟 2：放置地點
```typescript
// 根據配置放置各類型地點
for (type in placeTypes) {
  count = random(minCount, maxCount)
  for (i in 0..count) {
    position = findValidPosition() // 保持最小距離
    places[position] = createPlace(type)
    grid[position] = PLACE
  }
}
```

#### 步驟 3：生成障礙物
```typescript
// 根據 obstacleRatio 隨機放置障礙物
obstacleCount = openSpaces × obstacleRatio
while (placed < obstacleCount) {
  position = randomPosition()
  if (grid[position] == OPEN) {
    grid[position] = RESTRICTED
    placed++
  }
}
```

#### 步驟 4：設定起始點
```typescript
// 在開放空間中隨機選擇起始點
do {
  position = randomPosition()
} while (grid[position] != OPEN)
grid[position] = START
```

#### 步驟 5：驗證與修復連通性
```typescript
// 使用 BFS 驗證所有地點可達
reachable = BFS(start, allPlaces)

// 如果有不可達的地點，移除周圍障礙物
if (!allReachable) {
  for (unreachablePlace in unreachablePlaces) {
    removeAdjacentObstacles(unreachablePlace)
  }
}

// 重複驗證直到所有地點可達（最多 10 次）
// 如果失敗則重新生成整個地圖
```

#### 步驟 6：生成活動
```typescript
// 為每個地點生成 1-3 個隨機活動
for (place in places) {
  eventCount = random(1, 3)
  place.events = generateRandomEvents(place.type, eventCount)
}
```

### 4. 等距座標系統

#### 座標轉換公式

**網格 → 等距：**
```
x = (col - row) × (tileWidth / 2)
y = (col + row) × (tileHeight / 2)
```

**等距 → 網格：**
```
col = floor((x / tileWidth) + (y / tileHeight))
row = floor((y / tileHeight) - (x / tileWidth))
```

#### 瓦片尺寸
- 預設寬度：64 像素
- 預設高度：32 像素
- 長寬比：2:1

## 開發工作流程

### 1. 添加新地點類型

1. 在 `models/Place.ts` 添加新的 `PlaceType`：
```typescript
export enum PlaceType {
  // ... 現有類型
  NEW_PLACE = 'NEW_PLACE',
}
```

2. 更新相關函數：
```typescript
getPlaceTypeName(PlaceType.NEW_PLACE) → '新地點'
getPlaceTypeDescription(PlaceType.NEW_PLACE) → '描述...'
getPlaceTypeIcon(PlaceType.NEW_PLACE) → '🏢'
```

3. 在 `core/MapGenerator.ts` 更新配置：
```typescript
const DEFAULT_MAP_CONFIG = {
  placeCount: {
    [PlaceType.NEW_PLACE]: [1, 2],
  },
}
```

### 2. 添加新活動類型

1. 在 `models/Event.ts` 添加新的 `EventType`
2. 更新 `generateEventName()` 函數
3. 在 `MapGenerator.ts` 的 `getEventTypesForPlace()` 中關聯到地點

### 3. 修改地圖生成參數

編輯 `stores/gameStore.ts` 中的 `DEFAULT_MAP_CONFIG`：
```typescript
const DEFAULT_MAP_CONFIG: MapGenerationConfig = {
  rows: 20,              // 地圖行數
  columns: 20,           // 地圖列數
  obstacleRatio: 0.2,    // 障礙物比例（0-1）
  minDistance: 4,        // 地點最小距離
  eventPerPlace: [2, 4], // 每個地點的活動數量範圍
  // ...
}
```

### 4. 添加新的遊戲功能

1. 在 `gameStore.ts` 添加新的狀態和動作
2. 在 UI 組件中調用 store 方法
3. 使用 `useGameStore()` Hook 訂閱狀態變化

範例：
```typescript
// Store
export const useGameStore = create<GameStore>((set) => ({
  newFeature: null,
  updateNewFeature: (data) => set({ newFeature: data }),
}))

// Component
function MyComponent() {
  const { newFeature, updateNewFeature } = useGameStore()
  // ...
}
```

## 測試指南

### 單元測試

建立測試文件 `*.test.ts`：
```typescript
import { describe, it, expect } from 'vitest'
import { generateCampusMap } from '@core/MapGenerator'

describe('MapGenerator', () => {
  it('應該生成有效的地圖', () => {
    const config = { /* ... */ }
    const map = generateCampusMap(config)

    expect(map.rows).toBe(config.rows)
    expect(map.columns).toBe(config.columns)
  })
})
```

運行測試：
```powershell
npm run test
```

### 手動測試

1. 運行開發伺服器：`npm run dev`
2. 開啟瀏覽器開發者工具（F12）
3. 查看控制台輸出
4. 測試各項功能

## 常見問題

### Q: 地圖生成失敗怎麼辦？
A: 檢查 `obstacleRatio` 是否過高，或 `minDistance` 是否過大。如果連續 10 次連通性驗證都失敗，會自動重新生成。

### Q: 如何調整遊戲難度？
A: 修改 `DEFAULT_MAP_CONFIG` 中的參數：
- 增加 `obstacleRatio` → 更難
- 增加地圖大小 → 更大的探索空間
- 增加地點數量 → 更多內容

### Q: 如何添加音效？
A:
1. 將音效文件放在 `public/assets/sounds/`
2. 在遊戲事件中使用 `new Audio(path).play()`
3. 檢查 `settings.soundEnabled` 和 `settings.volume`

## 效能優化建議

1. **地圖渲染**
   - 只渲染可見區域（視口剔除）
   - 使用 OffscreenCanvas 預渲染靜態內容
   - 避免每幀重繪整個地圖

2. **狀態管理**
   - 使用 Zustand 的選擇器避免不必要的重渲染
   - 將大型計算結果緩存

3. **資源載入**
   - 使用 lazy loading 載入組件
   - 預載入常用資源
   - 使用 sprite sheets 減少 HTTP 請求

## 下一步建議

1. **實作 Canvas 渲染**
   - 參考 `spec.md` 第 5 節的等距渲染設計
   - 使用 `IsometricTransform` 工具進行座標轉換

2. **添加鍵盤控制**
   - 監聽 `keydown` 事件
   - 調用 `movePlayer()` 移動玩家
   - 實作移動動畫

3. **完善對話框系統**
   - 建立 `Dialog` 組件
   - 整合 `showDialog` 和 `currentDialog` 狀態
   - 添加動畫效果

4. **實作儲存系統**
   - 使用 `localStorage` 保存遊戲狀態
   - 實作 `saveGame()` 和 `loadGame()` 方法
   - 添加存檔列表 UI

## 聯絡開發團隊

如有任何問題或建議，請聯繫專案維護者。
