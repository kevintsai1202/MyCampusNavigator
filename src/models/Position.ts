/**
 * 位置相關介面定義
 */

/**
 * 網格位置介面
 * 代表地圖上的格子座標
 */
export interface Position {
  row: number // 行索引
  col: number // 列索引
}

/**
 * 等距座標位置介面
 * 代表螢幕上的 2.5D 座標
 */
export interface IsometricPosition {
  x: number // 螢幕 X 座標
  y: number // 螢幕 Y 座標
}

/**
 * 檢查兩個位置是否相同
 */
export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col
}

/**
 * 計算兩個位置之間的曼哈頓距離
 */
export function getManhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)
}

/**
 * 取得相鄰位置（上下左右）
 */
export function getAdjacentPositions(pos: Position): Position[] {
  return [
    { row: pos.row - 1, col: pos.col }, // 上
    { row: pos.row + 1, col: pos.col }, // 下
    { row: pos.row, col: pos.col - 1 }, // 左
    { row: pos.row, col: pos.col + 1 }, // 右
  ]
}

/**
 * 檢查位置是否在地圖範圍內
 */
export function isValidPosition(
  pos: Position,
  rows: number,
  cols: number
): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols
}
