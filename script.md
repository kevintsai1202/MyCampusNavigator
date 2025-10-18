# Campus Navigator Web Game - 測試劇本

## 文件資訊
- **專案名稱**: Campus Navigator Web Game
- **版本**: 2.0.0
- **測試類型**: E2E 功能測試
- **測試工具**: Chrome DevTools MCP
- **最後更新**: 2025-10-18

---

## 目錄
1. [測試環境準備](#1-測試環境準備)
2. [主選單功能測試](#2-主選單功能測試)
3. [新遊戲流程測試](#3-新遊戲流程測試)
4. [玩家移動測試](#4-玩家移動測試)
5. [地點互動測試](#5-地點互動測試)
6. [碰撞偵測測試](#6-碰撞偵測測試)
7. [遊戲完成流程測試](#7-遊戲完成流程測試)
8. [存檔載入測試](#8-存檔載入測試)
9. [UI/UX 元素測試](#9-uiux-元素測試)
10. [效能測試](#10-效能測試)
11. [回歸測試](#11-回歸測試)

---

## 1. 測試環境準備

### 1.1 前置條件
- [ ] 確認開發伺服器已啟動（通常在 http://localhost:5173）
- [ ] Chrome 瀏覽器已安裝
- [ ] Chrome DevTools MCP 已設定
- [ ] 清除瀏覽器快取和 LocalStorage

### 1.2 測試資料準備
- [ ] 準備測試用帳號（如需要）
- [ ] 清空 LocalStorage 確保乾淨環境

```bash
# 清除 LocalStorage 的 JavaScript 指令
localStorage.clear();
```

---

## 2. 主選單功能測試

### 測試案例 2.1: 主選單顯示
**目的**: 驗證主選單正確顯示所有選項

**步驟**:
1. 開啟瀏覽器並導航至應用程式首頁
2. 等待頁面完全載入

**預期結果**:
- [ ] 顯示 "CAMPUS NAVIGATOR" 標題
- [ ] 顯示「開始新遊戲」按鈕
- [ ] 顯示「載入遊戲」按鈕
- [ ] 顯示「排行榜」按鈕
- [ ] 顯示「設定」按鈕
- [ ] 顯示「關於」按鈕
- [ ] 顯示「退出」按鈕
- [ ] 顯示版本資訊 "版本 2.0"

**Chrome DevTools 操作**:
```
1. navigate_page(url="http://localhost:5173")
2. take_screenshot(filePath="screenshots/01-main-menu.png")
3. take_snapshot()
```

---

### 測試案例 2.2: 主選單按鈕互動
**目的**: 驗證所有主選單按鈕可點擊且有回應

**步驟**:
1. 在主選單頁面
2. 依序滑鼠懸停每個按鈕
3. 觀察視覺回饋（hover 效果）

**預期結果**:
- [ ] 按鈕有 hover 效果（顏色變化、陰影等）
- [ ] 滑鼠游標變為 pointer
- [ ] 按鈕可點擊

**Chrome DevTools 操作**:
```
1. hover(uid="<開始新遊戲按鈕的 uid>")
2. take_screenshot(filePath="screenshots/02-button-hover.png")
```

---

## 3. 新遊戲流程測試

### 測試案例 3.1: 開始新遊戲
**目的**: 驗證新遊戲可以正常啟動

**步驟**:
1. 在主選單點擊「開始新遊戲」
2. 等待地圖生成

**預期結果**:
- [ ] 進入遊戲畫面
- [ ] 顯示等距視角遊戲畫布（Canvas）
- [ ] 地圖正確生成（15-20 行列）
- [ ] 玩家角色出現在起始位置
- [ ] HUD 正確顯示（得分、時間、統計等）
- [ ] 小地圖顯示（如啟用）
- [ ] 底部提示訊息顯示

**Chrome DevTools 操作**:
```
1. click(uid="<開始新遊戲按鈕 uid>")
2. wait_for(text="提示", timeout=5000)
3. take_screenshot(filePath="screenshots/03-new-game-loaded.png")
4. take_snapshot()
```

---

### 測試案例 3.2: 地圖生成驗證
**目的**: 驗證隨機地圖符合規格要求

**步驟**:
1. 啟動新遊戲
2. 檢查地圖元素

**預期結果**:
- [ ] 地圖邊界正確顯示（牆壁）
- [ ] 地點數量符合配置：
  - 圖書館: 2-3 個
  - 餐廳: 2-4 個
  - 運動中心: 1-2 個
  - 講堂: 3-5 個
  - 活動廳: 1-2 個
- [ ] 障礙物隨機分布
- [ ] 起始位置在空曠區域
- [ ] 所有地點可到達（連通性）

**Chrome DevTools 操作**:
```
1. take_screenshot(fullPage=true, filePath="screenshots/04-full-map.png")
2. evaluate_script(function="() => { return document.querySelector('canvas').toDataURL(); }")
```

---

### 測試案例 3.3: HUD 資訊顯示
**目的**: 驗證抬頭顯示器正確顯示遊戲資訊

**步驟**:
1. 在遊戲畫面檢查 HUD 元素

**預期結果**:
- [ ] 顯示當前得分（初始為 0）
- [ ] 顯示經過時間（初始為 00:00）
- [ ] 顯示當前位置資訊
- [ ] 顯示任務進度（0%）
- [ ] 顯示統計資訊：
  - 移動次數: 0
  - 碰撞次數: 0
  - 地點進度: 0/總數
  - 活動進度: 0/總數
- [ ] 顯示成就列表（全部未解鎖）

**Chrome DevTools 操作**:
```
1. take_snapshot()
2. 檢查特定元素是否存在
```

---

## 4. 玩家移動測試

### 測試案例 4.1: 鍵盤移動 - 方向鍵
**目的**: 驗證方向鍵控制玩家移動

**步驟**:
1. 在遊戲畫面
2. 按下向上方向鍵
3. 觀察玩家移動
4. 重複測試其他方向（下、左、右）

**預期結果**:
- [ ] 玩家角色向相應方向移動一格
- [ ] 玩家面向改變
- [ ] 移動次數 +1
- [ ] 播放移動音效（如啟用）
- [ ] 相機跟隨玩家（如啟用）
- [ ] 位置座標更新

**Chrome DevTools 操作**:
```
1. 記錄初始位置
2. 模擬按鍵（需要透過 evaluate_script）
3. 等待動畫完成
4. 檢查新位置
5. take_screenshot(filePath="screenshots/05-player-moved.png")
```

**JavaScript 腳本**:
```javascript
// 模擬按鍵
const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
document.dispatchEvent(event);
```

---

### 測試案例 4.2: 鍵盤移動 - WASD 鍵
**目的**: 驗證 WASD 鍵控制玩家移動

**步驟**:
1. 在遊戲畫面
2. 按下 W 鍵（向上）
3. 按下 A 鍵（向左）
4. 按下 S 鍵（向下）
5. 按下 D 鍵（向右）

**預期結果**:
- [ ] W/A/S/D 對應上/左/下/右移動
- [ ] 行為與方向鍵一致

**Chrome DevTools 操作**:
```
1. evaluate_script(function="() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' })); }")
2. take_screenshot(filePath="screenshots/06-wasd-movement.png")
```

---

### 測試案例 4.3: 滑鼠點擊移動
**目的**: 驗證點擊地圖進行移動（如實裝）

**步驟**:
1. 點擊玩家附近的空地
2. 觀察玩家是否移動到該位置

**預期結果**:
- [ ] 玩家沿路徑移動到點擊位置
- [ ] 使用 A* 尋路演算法
- [ ] 移動過程流暢

**Chrome DevTools 操作**:
```
1. click(uid="<目標格子 uid>")
2. 觀察移動路徑
```

---

### 測試案例 4.4: 八方向移動
**目的**: 驗證對角線移動（如實裝）

**步驟**:
1. 同時按下向上和向右方向鍵
2. 測試其他對角線組合

**預期結果**:
- [ ] 玩家向右上方移動
- [ ] 支援 8 個方向移動
- [ ] 面向正確

**Chrome DevTools 操作**:
```
1. 模擬同時按鍵
2. 檢查移動方向
```

---

## 5. 地點互動測試

### 測試案例 5.1: 訪問圖書館
**目的**: 驗證訪問圖書館的完整流程

**步驟**:
1. 移動玩家到圖書館位置
2. 觀察互動提示
3. 查看對話框內容
4. 點擊確定關閉對話框

**預期結果**:
- [ ] 到達圖書館時自動觸發互動
- [ ] 顯示對話框標題 "📚 圖書館"
- [ ] 顯示歡迎訊息和描述
- [ ] 顯示獲得分數（例如 "你獲得了 8.5 分！"）
- [ ] 分數正確加到總分
- [ ] 地點標記為已訪問
- [ ] 播放到達音效（如啟用）
- [ ] 記錄到得分歷史

**Chrome DevTools 操作**:
```
1. 導航玩家到圖書館
2. wait_for(text="圖書館", timeout=3000)
3. take_screenshot(filePath="screenshots/07-library-dialog.png")
4. click(uid="<確定按鈕 uid>")
```

---

### 測試案例 5.2: 參加活動 - 講座
**目的**: 驗證參加講座活動流程

**步驟**:
1. 移動到有講座活動的講堂
2. 選擇講座活動
3. 確認參加
4. 查看結果

**預期結果**:
- [ ] 顯示活動選擇對話框
- [ ] 列出所有可用活動（未參加的）
- [ ] 顯示活動詳細資訊：
  - 活動名稱
  - 活動類型（講座）
  - 時間範圍
  - 得分
- [ ] 點擊選擇後顯示確認
- [ ] 總分 = 地點分數 + 活動分數
- [ ] 活動標記為已參加
- [ ] 詢問是否繼續參加其他活動

**Chrome DevTools 操作**:
```
1. 移動到講堂
2. wait_for(text="選擇要參加的活動", timeout=3000)
3. take_screenshot(filePath="screenshots/08-event-selection.png")
4. click(uid="<第一個活動 uid>")
5. click(uid="<選擇按鈕 uid>")
6. wait_for(text="參加了", timeout=2000)
7. take_screenshot(filePath="screenshots/09-event-attended.png")
```

---

### 測試案例 5.3: 餐廳互動
**目的**: 驗證餐廳特殊互動

**步驟**:
1. 訪問餐廳
2. 查看菜單（如實裝）
3. 選擇餐點（如實裝）

**預期結果**:
- [ ] 顯示餐廳對話框
- [ ] 顯示菜單項目和價格
- [ ] 選擇餐點會扣除分數（負分）
- [ ] 正確更新總分

**Chrome DevTools 操作**:
```
1. 移動到餐廳
2. take_snapshot()
3. 檢查菜單顯示
```

---

### 測試案例 5.4: 場地預訂
**目的**: 驗證運動中心和活動廳的預訂功能

**步驟**:
1. 訪問運動中心
2. 選擇預訂選項
3. 確認預訂
4. 檢查預訂狀態

**預期結果**:
- [ ] 可預訂場地顯示預訂按鈕
- [ ] 預訂成功後顯示確認訊息
- [ ] 場地標記為已預訂
- [ ] 獲得額外獎勵分數
- [ ] 解鎖相關成就（如有）

**Chrome DevTools 操作**:
```
1. 移動到運動中心
2. click(uid="<預訂按鈕 uid>")
3. 確認預訂狀態
```

---

## 6. 碰撞偵測測試

### 測試案例 6.1: 邊界碰撞
**目的**: 驗證玩家無法穿越地圖邊界

**步驟**:
1. 移動玩家到地圖邊界附近
2. 嘗試向邊界方向移動
3. 觀察結果

**預期結果**:
- [ ] 玩家位置不變
- [ ] 碰撞次數 +1
- [ ] 播放碰撞音效
- [ ] 可能顯示碰撞提示訊息
- [ ] 移動次數不增加

**Chrome DevTools 操作**:
```
1. 記錄碰撞前的統計
2. 嘗試碰撞邊界
3. 確認統計更新
4. take_screenshot(filePath="screenshots/10-boundary-collision.png")
```

---

### 測試案例 6.2: 障礙物碰撞
**目的**: 驗證玩家無法穿越障礙物

**步驟**:
1. 移動玩家到障礙物旁
2. 嘗試向障礙物移動
3. 觀察結果

**預期結果**:
- [ ] 玩家位置不變
- [ ] 碰撞次數 +1
- [ ] 播放碰撞音效
- [ ] 顯示 "你撞到了障礙物！" 訊息

**Chrome DevTools 操作**:
```
1. 定位障礙物位置
2. 嘗試碰撞
3. 確認碰撞偵測正確
```

---

### 測試案例 6.3: 零碰撞挑戰
**目的**: 驗證零碰撞成就系統

**步驟**:
1. 開始新遊戲
2. 完成遊戲過程中不碰撞任何障礙
3. 完成遊戲

**預期結果**:
- [ ] 碰撞次數保持為 0
- [ ] 解鎖「零碰撞挑戰」成就
- [ ] 顯示成就解鎖動畫

**Chrome DevTools 操作**:
```
1. 全程監控碰撞計數
2. 完成後檢查成就狀態
```

---

## 7. 遊戲完成流程測試

### 測試案例 7.1: 完成所有目標
**目的**: 驗證遊戲完成條件和結算流程

**步驟**:
1. 訪問所有地點
2. 參加所有活動
3. 觀察遊戲完成觸發

**預期結果**:
- [ ] 當最後一個活動參加後，觸發遊戲完成
- [ ] 顯示結算畫面
- [ ] 顯示最終統計：
  - 總得分
  - 總移動次數
  - 總碰撞次數
  - 經過時間
  - 效率評分
- [ ] 顯示解鎖的成就
- [ ] 分數儲存到排行榜
- [ ] 提供返回主選單選項

**Chrome DevTools 操作**:
```
1. 完成所有任務
2. wait_for(text="遊戲完成", timeout=5000)
3. take_screenshot(filePath="screenshots/11-game-complete.png")
4. take_snapshot()
```

---

### 測試案例 7.2: 排行榜更新
**目的**: 驗證分數正確記錄到排行榜

**步驟**:
1. 完成遊戲
2. 返回主選單
3. 查看排行榜

**預期結果**:
- [ ] 排行榜顯示最新記錄
- [ ] 分數排序正確（從高到低）
- [ ] 保留前 10 名
- [ ] 顯示完整資訊（分數、移動、碰撞、時間）

**Chrome DevTools 操作**:
```
1. click(uid="<排行榜按鈕 uid>")
2. take_screenshot(filePath="screenshots/12-leaderboard.png")
```

---

## 8. 存檔載入測試

### 測試案例 8.1: 遊戲存檔
**目的**: 驗證遊戲進度可以正確儲存

**步驟**:
1. 開始新遊戲並進行一些操作
2. 按 ESC 打開暫停選單
3. 點擊「存檔」
4. 確認儲存成功

**預期結果**:
- [ ] 顯示暫停選單
- [ ] 顯示「存檔」選項
- [ ] 點擊後顯示儲存確認訊息
- [ ] LocalStorage 包含存檔資料
- [ ] 存檔包含完整狀態：
  - 地圖資料
  - 玩家位置
  - 得分和統計
  - 已訪問地點
  - 已參加活動

**Chrome DevTools 操作**:
```
1. 執行一些遊戲操作
2. 模擬按 ESC 鍵
3. click(uid="<存檔按鈕 uid>")
4. evaluate_script(function="() => { return localStorage.getItem('campus_navigator_save'); }")
5. 驗證存檔資料完整性
```

---

### 測試案例 8.2: 遊戲載入
**目的**: 驗證可以從存檔恢復遊戲

**步驟**:
1. 確保有存檔存在
2. 在主選單點擊「載入遊戲」
3. 確認遊戲狀態恢復

**預期結果**:
- [ ] 成功載入遊戲
- [ ] 玩家位置正確恢復
- [ ] 得分和統計正確恢復
- [ ] 已訪問地點保持已訪問狀態
- [ ] 已參加活動保持已參加狀態
- [ ] 地圖狀態完全一致
- [ ] 經過時間正確恢復

**Chrome DevTools 操作**:
```
1. click(uid="<載入遊戲按鈕 uid>")
2. wait_for(text="提示", timeout=5000)
3. take_snapshot()
4. 驗證所有狀態
```

---

### 測試案例 8.3: 存檔版本相容性
**目的**: 驗證存檔版本檢查

**步驟**:
1. 修改 LocalStorage 存檔版本號
2. 嘗試載入遊戲

**預期結果**:
- [ ] 版本不符時顯示警告
- [ ] 不載入不相容的存檔
- [ ] 提示使用者重新開始

**Chrome DevTools 操作**:
```
1. evaluate_script 修改版本號
2. 嘗試載入
3. 檢查錯誤處理
```

---

## 9. UI/UX 元素測試

### 測試案例 9.1: 響應式設計
**目的**: 驗證不同螢幕尺寸下的顯示

**步驟**:
1. 調整瀏覽器視窗大小
2. 測試以下尺寸：
   - 1920x1080（桌面）
   - 1366x768（小筆電）
   - 768x1024（平板直向）
   - 1024x768（平板橫向）

**預期結果**:
- [ ] UI 元素正確縮放
- [ ] 遊戲畫布適應視窗大小
- [ ] 文字可讀
- [ ] 按鈕可點擊
- [ ] 無元素重疊或溢出

**Chrome DevTools 操作**:
```
1. resize_page(width=1920, height=1080)
2. take_screenshot(filePath="screenshots/13-desktop-view.png")
3. resize_page(width=1366, height=768)
4. take_screenshot(filePath="screenshots/14-laptop-view.png")
5. resize_page(width=768, height=1024)
6. take_screenshot(filePath="screenshots/15-tablet-portrait.png")
```

---

### 測試案例 9.2: 對話框系統
**目的**: 驗證對話框正確顯示和關閉

**步驟**:
1. 觸發各種對話框（地點、活動、成就等）
2. 測試關閉機制

**預期結果**:
- [ ] 對話框置中顯示
- [ ] 背景遮罩顯示
- [ ] 點擊確定關閉對話框
- [ ] 點擊取消關閉對話框（如有）
- [ ] 點擊背景遮罩關閉對話框（如實裝）
- [ ] ESC 鍵關閉對話框（如實裝）
- [ ] 關閉後遊戲繼續

**Chrome DevTools 操作**:
```
1. 觸發對話框
2. take_screenshot(filePath="screenshots/16-dialog-modal.png")
3. 測試各種關閉方式
```

---

### 測試案例 9.3: 小地圖功能
**目的**: 驗證小地圖正確顯示

**步驟**:
1. 在遊戲畫面查看小地圖
2. 移動玩家觀察小地圖更新

**預期結果**:
- [ ] 小地圖顯示在固定位置（右上角）
- [ ] 顯示完整地圖縮略圖
- [ ] 玩家位置用特殊圖示標記
- [ ] 已訪問地點和未訪問地點有視覺區別
- [ ] 即時更新玩家位置
- [ ] 可點擊小地圖快速移動（如實裝）

**Chrome DevTools 操作**:
```
1. 定位小地圖元素
2. take_screenshot(uid="<小地圖 uid>", filePath="screenshots/17-minimap.png")
```

---

### 測試案例 9.4: 成就通知
**目的**: 驗證成就解鎖通知

**步驟**:
1. 觸發成就解鎖條件
2. 觀察通知動畫

**預期結果**:
- [ ] 顯示成就解鎖通知
- [ ] 顯示成就圖示和名稱
- [ ] 播放解鎖動畫
- [ ] 播放音效
- [ ] 通知自動消失或可手動關閉
- [ ] 成就加入到成就列表

**Chrome DevTools 操作**:
```
1. 觸發成就
2. 捕捉通知動畫
3. take_screenshot(filePath="screenshots/18-achievement-unlocked.png")
```

---

## 10. 效能測試

### 測試案例 10.1: 渲染效能
**目的**: 驗證遊戲維持穩定幀率

**步驟**:
1. 啟動效能監控
2. 進行各種遊戲操作
3. 記錄 FPS

**預期結果**:
- [ ] 維持 60 FPS（或接近）
- [ ] 無明顯卡頓
- [ ] CPU 使用率合理
- [ ] 記憶體使用穩定

**Chrome DevTools 操作**:
```
1. performance_start_trace(reload=false, autoStop=false)
2. 執行遊戲操作
3. performance_stop_trace()
4. 分析效能報告
```

---

### 測試案例 10.2: 記憶體洩漏檢測
**目的**: 驗證長時間遊玩不會造成記憶體洩漏

**步驟**:
1. 開始遊戲
2. 持續遊玩 30 分鐘
3. 監控記憶體使用

**預期結果**:
- [ ] 記憶體使用穩定
- [ ] 無持續增長趨勢
- [ ] 垃圾回收正常運作

**Chrome DevTools 操作**:
```
1. 記錄初始記憶體
2. 長時間運行
3. 定期檢查記憶體使用
```

---

### 測試案例 10.3: 網路節流測試
**目的**: 驗證慢速網路下的載入體驗

**步驟**:
1. 啟用網路節流（Slow 3G）
2. 重新載入應用程式
3. 觀察載入過程

**預期結果**:
- [ ] 顯示載入指示器
- [ ] 資源逐步載入
- [ ] 無白畫面卡住
- [ ] 載入完成後正常運作

**Chrome DevTools 操作**:
```
1. emulate_network(throttlingOption="Slow 3G")
2. navigate_page(url="http://localhost:5173")
3. 觀察載入過程
4. emulate_network(throttlingOption="No emulation")
```

---

## 11. 回歸測試

### 測試案例 11.1: 核心功能快速驗證
**目的**: 每次更新後快速驗證核心功能

**快速檢查清單**:
- [ ] 應用程式啟動
- [ ] 新遊戲可開始
- [ ] 地圖正確生成
- [ ] 玩家可移動
- [ ] 碰撞偵測運作
- [ ] 地點互動正常
- [ ] UI 正確顯示
- [ ] 存檔載入正常

**執行時間**: 約 5-10 分鐘

---

### 測試案例 11.2: 完整遊戲流程
**目的**: 完整遊玩一次確保端到端流程無問題

**步驟**:
1. 從主選單開始
2. 開始新遊戲
3. 訪問所有地點
4. 參加所有活動
5. 完成遊戲
6. 查看結算
7. 檢查排行榜
8. 測試存檔載入

**預期結果**:
- [ ] 整個流程無錯誤
- [ ] 所有功能正常運作
- [ ] 無控制台錯誤
- [ ] 使用者體驗流暢

**執行時間**: 約 20-30 分鐘

---

## 12. 測試報告範本

### 測試執行摘要
- **測試日期**: YYYY-MM-DD
- **測試人員**: [名稱]
- **應用程式版本**: 2.0.x
- **測試環境**: Chrome [版本], Windows/Mac/Linux

### 測試結果統計
| 測試類別 | 總測試案例 | 通過 | 失敗 | 跳過 | 通過率 |
|---------|-----------|------|------|------|--------|
| 主選單功能 | 2 | 2 | 0 | 0 | 100% |
| 新遊戲流程 | 3 | 3 | 0 | 0 | 100% |
| 玩家移動 | 4 | 4 | 0 | 0 | 100% |
| 地點互動 | 4 | 4 | 0 | 0 | 100% |
| 碰撞偵測 | 3 | 3 | 0 | 0 | 100% |
| 遊戲完成 | 2 | 2 | 0 | 0 | 100% |
| 存檔載入 | 3 | 3 | 0 | 0 | 100% |
| UI/UX | 4 | 4 | 0 | 0 | 100% |
| 效能測試 | 3 | 3 | 0 | 0 | 100% |
| 回歸測試 | 2 | 2 | 0 | 0 | 100% |
| **總計** | **30** | **30** | **0** | **0** | **100%** |

### 發現的問題
| ID | 嚴重度 | 測試案例 | 問題描述 | 狀態 |
|----|--------|---------|---------|------|
| BUG-001 | 高 | 4.1 | 玩家移動後相機未正確跟隨 | 待修復 |
| BUG-002 | 中 | 9.3 | 小地圖在某些解析度下顯示不全 | 進行中 |
| BUG-003 | 低 | 5.2 | 活動選擇對話框文字截斷 | 已修復 |

### 截圖清單
1. `01-main-menu.png` - 主選單
2. `02-button-hover.png` - 按鈕懸停效果
3. `03-new-game-loaded.png` - 新遊戲載入
4. `04-full-map.png` - 完整地圖
5. `05-player-moved.png` - 玩家移動
6. `06-wasd-movement.png` - WASD 移動
7. `07-library-dialog.png` - 圖書館對話框
8. `08-event-selection.png` - 活動選擇
9. `09-event-attended.png` - 參加活動
10. `10-boundary-collision.png` - 邊界碰撞
11. `11-game-complete.png` - 遊戲完成
12. `12-leaderboard.png` - 排行榜
13. `13-desktop-view.png` - 桌面視圖
14. `14-laptop-view.png` - 筆電視圖
15. `15-tablet-portrait.png` - 平板直向
16. `16-dialog-modal.png` - 對話框模態
17. `17-minimap.png` - 小地圖
18. `18-achievement-unlocked.png` - 成就解鎖

### 建議與改進
1. [建議項目 1]
2. [建議項目 2]
3. [建議項目 3]

---

## 附錄 A: Chrome DevTools MCP 常用指令

### 頁面導航
```typescript
// 導航到 URL
navigate_page(url="http://localhost:5173")

// 頁面重新載入
navigate_page(url="http://localhost:5173")

// 返回上一頁
navigate_page_history(navigate="back")

// 前進下一頁
navigate_page_history(navigate="forward")
```

### 元素互動
```typescript
// 點擊元素
click(uid="<元素 uid>")

// 雙擊元素
click(uid="<元素 uid>", dblClick=true)

// 懸停元素
hover(uid="<元素 uid>")

// 填寫表單
fill(uid="<輸入框 uid>", value="文字內容")

// 拖曳元素
drag(from_uid="<來源 uid>", to_uid="<目標 uid>")
```

### 快照與截圖
```typescript
// 取得頁面快照
take_snapshot()

// 截圖整個頁面
take_screenshot(filePath="screenshot.png")

// 截圖完整頁面（包含捲動區域）
take_screenshot(fullPage=true, filePath="full-page.png")

// 截圖特定元素
take_screenshot(uid="<元素 uid>", filePath="element.png")
```

### JavaScript 執行
```typescript
// 執行 JavaScript 腳本
evaluate_script(
  function="() => { return document.title; }"
)

// 執行帶參數的腳本
evaluate_script(
  function="(el) => { return el.innerText; }",
  args=[{ uid: "<元素 uid>" }]
)
```

### 等待與條件
```typescript
// 等待文字出現
wait_for(text="載入完成", timeout=5000)
```

### 網路與效能
```typescript
// 列出網路請求
list_network_requests()

// 取得特定請求
get_network_request(url="http://localhost:5173/api/data")

// 網路節流
emulate_network(throttlingOption="Slow 3G")

// CPU 節流
emulate_cpu(throttlingRate=4)

// 啟動效能追蹤
performance_start_trace(reload=false, autoStop=false)

// 停止效能追蹤
performance_stop_trace()
```

### 控制台
```typescript
// 列出控制台訊息
list_console_messages()
```

---

## 附錄 B: 測試資料產生器

### 隨機玩家名稱
```javascript
const playerNames = [
  'TestPlayer001',
  'QA_Tester',
  'CampusExplorer',
  'MapNavigator',
  'AchievementHunter'
];
```

### 模擬鍵盤輸入
```javascript
function simulateKeyPress(key) {
  const event = new KeyboardEvent('keydown', {
    key: key,
    code: `Key${key.toUpperCase()}`,
    keyCode: key.charCodeAt(0),
    which: key.charCodeAt(0),
    bubbles: true
  });
  document.dispatchEvent(event);
}

// 使用範例
simulateKeyPress('w'); // 向上移動
simulateKeyPress('a'); // 向左移動
simulateKeyPress('s'); // 向下移動
simulateKeyPress('d'); // 向右移動
```

### 檢查遊戲狀態
```javascript
// 取得玩家當前位置
function getPlayerPosition() {
  // 需要根據實際實作調整
  return window.__GAME_STATE__.player.currentPosition;
}

// 取得總分
function getTotalScore() {
  return window.__GAME_STATE__.player.totalScore;
}

// 取得統計
function getStats() {
  return {
    moves: window.__GAME_STATE__.player.totalMoves,
    hits: window.__GAME_STATE__.player.totalHits,
    score: window.__GAME_STATE__.player.totalScore
  };
}
```

---

## 附錄 C: 已知問題與限制

### Chrome DevTools MCP 限制
1. **無法直接模擬鍵盤事件**: 需要使用 `evaluate_script` 執行 JavaScript
2. **動畫捕捉困難**: 快照是靜態的，無法捕捉動畫過程
3. **Canvas 內容檢測**: 無法直接檢測 Canvas 內的元素，需要透過其他方式

### 測試環境要求
1. **本地開發伺服器**: 必須在測試前啟動
2. **清除快取**: 每次測試前建議清除瀏覽器快取
3. **穩定網路**: 確保網路連線穩定

### 自動化建議
1. 對於重複性測試，建議撰寫自動化腳本
2. 使用 CI/CD 整合自動化測試
3. 定期執行回歸測試

---

**測試劇本版本**: 1.0.0
**最後更新**: 2025-10-18
**維護者**: QA Team
