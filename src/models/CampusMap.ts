import { Position } from './Position'
import { MapPositionType } from './MapPosition'
import { Place } from './Place'

/**
 * 校園地圖相關介面定義
 */

/**
 * 校園地圖介面
 */
export interface CampusMap {
  name: string // 地圖名稱
  rows: number // 行數
  columns: number // 列數
  grid: MapPositionType[][] // 地圖格子類型陣列
  places: (Place | null)[][] // 地點陣列（與 grid 對應）
  startPosition: Position // 起始位置
  generatedAt: number // 生成時間戳記
  seed?: number // 隨機種子（用於重現地圖）
}

/**
 * 地圖生成配置介面
 */
export interface MapGenerationConfig {
  rows: number // 行數
  columns: number // 列數
  placeCount: Partial<Record<import('./Place').PlaceType, [number, number]>> // 每種地點類型的數量範圍 [最小值, 最大值]
  obstacleRatio: number // 障礙物比例（0-1）
  minDistance: number // 地點之間的最小距離
  eventPerPlace: [number, number] // 每個地點的活動數量範圍 [最小值, 最大值]
  seed?: number // 隨機種子
}

/**
 * 取得地圖上指定位置的格子類型
 */
export function getMapPositionType(
  map: CampusMap,
  pos: Position
): MapPositionType | null {
  if (
    pos.row < 0 ||
    pos.row >= map.rows ||
    pos.col < 0 ||
    pos.col >= map.columns
  ) {
    return null
  }
  return map.grid[pos.row][pos.col]
}

/**
 * 取得地圖上指定位置的地點
 */
export function getPlaceAt(
  map: CampusMap,
  pos: Position
): Place | null {
  if (
    pos.row < 0 ||
    pos.row >= map.rows ||
    pos.col < 0 ||
    pos.col >= map.columns
  ) {
    return null
  }
  return map.places[pos.row][pos.col]
}

/**
 * 取得地圖上所有地點的列表
 */
export function getAllPlaces(map: CampusMap): Place[] {
  const places: Place[] = []
  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.columns; col++) {
      const place = map.places[row][col]
      if (place !== null) {
        places.push(place)
      }
    }
  }
  return places
}

/**
 * 計算地圖統計資訊
 */
export interface MapStats {
  totalPlaces: number // 地點總數
  totalEvents: number // 活動總數
  walkableTiles: number // 可通行格子數
  totalTiles: number // 總格子數
  coverage: number // 地點覆蓋率（地點數/可通行格子數）
}

/**
 * 計算地圖統計資訊
 */
export function calculateMapStats(map: CampusMap): MapStats {
  const places = getAllPlaces(map)
  const totalEvents = places.reduce(
    (sum, place) => sum + place.events.length,
    0
  )

  let walkableTiles = 0
  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.columns; col++) {
      const type = map.grid[row][col]
      if (
        type === MapPositionType.OPEN ||
        type === MapPositionType.PLACE ||
        type === MapPositionType.START
      ) {
        walkableTiles++
      }
    }
  }

  const totalTiles = map.rows * map.columns
  const coverage = walkableTiles > 0 ? places.length / walkableTiles : 0

  return {
    totalPlaces: places.length,
    totalEvents,
    walkableTiles,
    totalTiles,
    coverage: Math.round(coverage * 10000) / 10000,
  }
}
