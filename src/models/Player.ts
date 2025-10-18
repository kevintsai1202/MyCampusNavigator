import { Position } from './Position'

/**
 * 玩家相關介面定義
 */

/**
 * 玩家介面
 */
export interface Player {
  name: string // 玩家名稱
  position: Position // 當前位置
  visitedPlaces: string[] // 已訪問的地點 ID 列表
  completedEvents: string[] // 已完成的活動 ID 列表
  totalScore: number // 總分
  startTime: number // 遊戲開始時間戳記
  moveCount: number // 移動次數
  pathHistory: Position[] // 移動路徑歷史
}

/**
 * 玩家統計資訊介面
 */
export interface PlayerStats {
  totalPlacesVisited: number // 訪問的地點總數
  totalEventsCompleted: number // 完成的活動總數
  totalScore: number // 總分
  totalTime: number // 總遊戲時間（毫秒）
  moveCount: number // 移動次數
  efficiency: number // 效率分數（分數/移動次數）
}

/**
 * 建立新玩家
 */
export function createPlayer(
  name: string,
  startPosition: Position
): Player {
  return {
    name,
    position: startPosition,
    visitedPlaces: [],
    completedEvents: [],
    totalScore: 0,
    startTime: Date.now(),
    moveCount: 0,
    pathHistory: [startPosition],
  }
}

/**
 * 計算玩家統計資訊
 */
export function calculatePlayerStats(player: Player): PlayerStats {
  const totalTime = Date.now() - player.startTime
  const efficiency =
    player.moveCount > 0 ? player.totalScore / player.moveCount : 0

  return {
    totalPlacesVisited: player.visitedPlaces.length,
    totalEventsCompleted: player.completedEvents.length,
    totalScore: player.totalScore,
    totalTime,
    moveCount: player.moveCount,
    efficiency: Math.round(efficiency * 100) / 100,
  }
}

/**
 * 檢查玩家是否完成所有活動
 */
export function hasCompletedAllEvents(
  player: Player,
  totalEvents: number
): boolean {
  return player.completedEvents.length >= totalEvents
}
