import { CampusMap } from './CampusMap'
import { Player } from './Player'

/**
 * 遊戲狀態相關介面定義
 */

/**
 * 遊戲狀態枚舉
 */
export enum GameStatus {
  MENU = 'MENU', // 主選單
  PLAYING = 'PLAYING', // 遊戲中
  PAUSED = 'PAUSED', // 暫停
  COMPLETED = 'COMPLETED', // 完成
  GAME_OVER = 'GAME_OVER', // 遊戲結束
}

/**
 * 遊戲設定介面
 */
export interface GameSettings {
  soundEnabled: boolean // 音效開關
  musicEnabled: boolean // 音樂開關
  volume: number // 音量（0-1）
  showMiniMap: boolean // 顯示小地圖
  showGrid: boolean // 顯示網格線
  showFPS: boolean // 顯示 FPS
  autoSave: boolean // 自動存檔
}

/**
 * 遊戲存檔介面
 */
export interface GameSave {
  id: string // 存檔 ID
  savedAt: number // 存檔時間戳記
  player: Player // 玩家狀態
  map: CampusMap // 地圖狀態
  settings: GameSettings // 遊戲設定
  elapsedTime: number // 已遊戲時間（毫秒）
}

/**
 * 對話框資料介面
 */
export interface DialogData {
  title: string // 標題
  content: string // 內容
  type: 'info' | 'success' | 'warning' | 'error' // 類型
  confirmText?: string // 確認按鈕文字
  cancelText?: string // 取消按鈕文字
  onConfirm?: () => void // 確認回調函數
  onCancel?: () => void // 取消回調函數
}

/**
 * 高分記錄介面
 */
export interface HighScore {
  id: string // 記錄 ID
  playerName: string // 玩家名稱
  score: number // 分數
  completedAt: number // 完成時間戳記
  duration: number // 遊戲時長（毫秒）
  placesVisited: number // 訪問地點數
  eventsCompleted: number // 完成活動數
  moveCount: number // 移動次數
}

/**
 * 建立預設遊戲設定
 */
export function createDefaultSettings(): GameSettings {
  return {
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.7,
    showMiniMap: true,
    showGrid: false,
    showFPS: false,
    autoSave: true,
  }
}

/**
 * 格式化遊戲時間
 */
export function formatGameTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const s = seconds % 60
  const m = minutes % 60

  if (hours > 0) {
    return `${hours}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}
