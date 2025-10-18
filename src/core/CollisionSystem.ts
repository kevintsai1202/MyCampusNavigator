import { CampusMap } from '@models/CampusMap'
import { Position } from '@models/Position'
import { MapPositionType } from '@models/MapPosition'

/**
 * 移動方向枚舉
 */
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP_LEFT = 'UP_LEFT',
  UP_RIGHT = 'UP_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
}

/**
 * 移動結果介面
 */
export interface MoveResult {
  success: boolean // 是否成功移動
  newPosition: Position // 新位置
  collision: boolean // 是否發生碰撞
  collisionType?: MapPositionType // 碰撞類型
  message?: string // 訊息
}

/**
 * 碰撞檢測系統
 * 負責檢查玩家移動是否合法
 */
export class CollisionSystem {
  /**
   * 根據方向計算新位置
   * @param currentPosition 當前位置
   * @param direction 移動方向
   * @returns 新位置
   */
  static calculateNewPosition(
    currentPosition: Position,
    direction: Direction
  ): Position {
    const { row, col } = currentPosition

    switch (direction) {
      case Direction.UP:
        return { row: row - 1, col }
      case Direction.DOWN:
        return { row: row + 1, col }
      case Direction.LEFT:
        return { row, col: col - 1 }
      case Direction.RIGHT:
        return { row, col: col + 1 }
      case Direction.UP_LEFT:
        return { row: row - 1, col: col - 1 }
      case Direction.UP_RIGHT:
        return { row: row - 1, col: col + 1 }
      case Direction.DOWN_LEFT:
        return { row: row + 1, col: col - 1 }
      case Direction.DOWN_RIGHT:
        return { row: row + 1, col: col + 1 }
      default:
        return currentPosition
    }
  }

  /**
   * 檢查位置是否在地圖邊界內
   * @param position 位置
   * @param map 地圖
   * @returns 是否在邊界內
   */
  static isWithinBounds(position: Position, map: CampusMap): boolean {
    return (
      position.row >= 0 &&
      position.row < map.rows &&
      position.col >= 0 &&
      position.col < map.columns
    )
  }

  /**
   * 檢查位置是否可通行
   * @param position 位置
   * @param map 地圖
   * @returns 是否可通行
   */
  static isWalkable(position: Position, map: CampusMap): boolean {
    if (!this.isWithinBounds(position, map)) {
      return false
    }

    const cellType = map.grid[position.row][position.col]

    // 可通行的格子類型
    const walkableTypes = [
      MapPositionType.OPEN,
      MapPositionType.PLACE,
      MapPositionType.START,
    ]

    return walkableTypes.includes(cellType)
  }

  /**
   * 執行移動碰撞檢測
   * @param currentPosition 當前位置
   * @param direction 移動方向
   * @param map 地圖
   * @returns 移動結果
   */
  static checkMove(
    currentPosition: Position,
    direction: Direction,
    map: CampusMap
  ): MoveResult {
    // 計算新位置
    const newPosition = this.calculateNewPosition(currentPosition, direction)

    // 檢查邊界
    if (!this.isWithinBounds(newPosition, map)) {
      return {
        success: false,
        newPosition: currentPosition,
        collision: true,
        collisionType: MapPositionType.BOUNDARY,
        message: '已到達地圖邊界',
      }
    }

    // 檢查可通行性
    if (!this.isWalkable(newPosition, map)) {
      const cellType = map.grid[newPosition.row][newPosition.col]
      return {
        success: false,
        newPosition: currentPosition,
        collision: true,
        collisionType: cellType,
        message: this.getCollisionMessage(cellType),
      }
    }

    // 移動成功
    return {
      success: true,
      newPosition,
      collision: false,
      message: '移動成功',
    }
  }

  /**
   * 取得碰撞訊息
   * @param collisionType 碰撞類型
   * @returns 碰撞訊息
   */
  private static getCollisionMessage(collisionType: MapPositionType): string {
    switch (collisionType) {
      case MapPositionType.BOUNDARY:
        return '前方是邊界，無法通過'
      case MapPositionType.RESTRICTED:
        return '前方有障礙物，無法通過'
      default:
        return '無法通過'
    }
  }

  /**
   * 計算兩點之間的曼哈頓距離
   * @param pos1 位置1
   * @param pos2 位置2
   * @returns 曼哈頓距離
   */
  static getManhattanDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)
  }

  /**
   * 檢查兩個位置是否相同
   * @param pos1 位置1
   * @param pos2 位置2
   * @returns 是否相同
   */
  static isSamePosition(pos1: Position, pos2: Position): boolean {
    return pos1.row === pos2.row && pos1.col === pos2.col
  }
}
