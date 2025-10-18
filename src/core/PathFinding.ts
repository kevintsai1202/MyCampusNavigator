import { Position, getAdjacentPositions, isSamePosition } from '@models/Position'
import { MapPositionType } from '@models/MapPosition'

/**
 * 尋路與連通性驗證工具
 */

/**
 * BFS（廣度優先搜索）驗證連通性
 * 檢查從起始點是否能到達所有目標點
 *
 * @param grid 地圖網格
 * @param start 起始位置
 * @param targets 目標位置列表
 * @returns 是否所有目標都可達
 */
export function validateConnectivity(
  grid: MapPositionType[][],
  start: Position,
  targets: Position[]
): boolean {
  if (targets.length === 0) return true

  const rows = grid.length
  const cols = grid[0].length

  // 檢查起始點是否可通行
  if (!isWalkablePosition(grid, start)) return false

  // 使用 BFS 尋找所有可達的位置
  const visited = new Set<string>()
  const queue: Position[] = [start]
  visited.add(positionKey(start))

  // BFS 主循環
  while (queue.length > 0) {
    const current = queue.shift()!
    const adjacent = getAdjacentPositions(current)

    for (const next of adjacent) {
      // 檢查是否在範圍內且可通行
      if (
        next.row >= 0 &&
        next.row < rows &&
        next.col >= 0 &&
        next.col < cols &&
        isWalkablePosition(grid, next) &&
        !visited.has(positionKey(next))
      ) {
        visited.add(positionKey(next))
        queue.push(next)
      }
    }
  }

  // 檢查所有目標是否都可達
  return targets.every((target) => visited.has(positionKey(target)))
}

/**
 * 使用 BFS 尋找從起點到終點的最短路徑
 *
 * @param grid 地圖網格
 * @param start 起始位置
 * @param end 目標位置
 * @returns 路徑（包含起點和終點），如果無路徑則返回 null
 */
export function findPath(
  grid: MapPositionType[][],
  start: Position,
  end: Position
): Position[] | null {
  if (isSamePosition(start, end)) return [start]

  const rows = grid.length
  const cols = grid[0].length

  // 檢查起點和終點是否可通行
  if (!isWalkablePosition(grid, start) || !isWalkablePosition(grid, end)) {
    return null
  }

  // BFS 資料結構
  const visited = new Set<string>()
  const queue: { pos: Position; path: Position[] }[] = [
    { pos: start, path: [start] },
  ]
  visited.add(positionKey(start))

  // BFS 主循環
  while (queue.length > 0) {
    const { pos: current, path } = queue.shift()!

    // 檢查是否到達目標
    if (isSamePosition(current, end)) {
      return path
    }

    // 探索相鄰位置
    const adjacent = getAdjacentPositions(current)
    for (const next of adjacent) {
      if (
        next.row >= 0 &&
        next.row < rows &&
        next.col >= 0 &&
        next.col < cols &&
        isWalkablePosition(grid, next) &&
        !visited.has(positionKey(next))
      ) {
        visited.add(positionKey(next))
        queue.push({
          pos: next,
          path: [...path, next],
        })
      }
    }
  }

  // 沒有找到路徑
  return null
}

/**
 * 取得所有與起始點連通的位置
 *
 * @param grid 地圖網格
 * @param start 起始位置
 * @returns 所有可達位置的集合
 */
export function getReachablePositions(
  grid: MapPositionType[][],
  start: Position
): Set<string> {
  const rows = grid.length
  const cols = grid[0].length

  const visited = new Set<string>()
  if (!isWalkablePosition(grid, start)) return visited

  const queue: Position[] = [start]
  visited.add(positionKey(start))

  while (queue.length > 0) {
    const current = queue.shift()!
    const adjacent = getAdjacentPositions(current)

    for (const next of adjacent) {
      if (
        next.row >= 0 &&
        next.row < rows &&
        next.col >= 0 &&
        next.col < cols &&
        isWalkablePosition(grid, next) &&
        !visited.has(positionKey(next))
      ) {
        visited.add(positionKey(next))
        queue.push(next)
      }
    }
  }

  return visited
}

/**
 * 檢查位置是否可通行
 */
function isWalkablePosition(
  grid: MapPositionType[][],
  pos: Position
): boolean {
  const type = grid[pos.row][pos.col]
  return (
    type === MapPositionType.OPEN ||
    type === MapPositionType.PLACE ||
    type === MapPositionType.START
  )
}

/**
 * 將位置轉換為字串鍵（用於 Set/Map）
 */
function positionKey(pos: Position): string {
  return `${pos.row},${pos.col}`
}

/**
 * 計算兩點之間的曼哈頓距離
 */
export function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}
