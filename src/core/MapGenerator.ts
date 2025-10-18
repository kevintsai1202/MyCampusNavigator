import {
  CampusMap,
  MapGenerationConfig,
} from '@models/CampusMap'
import { Position } from '@models/Position'
import { MapPositionType } from '@models/MapPosition'
import { Place, PlaceType, getPlaceTypeName, getPlaceTypeDescription } from '@models/Place'
import { Event, EventType, generateEventName } from '@models/Event'
import { validateConnectivity, getReachablePositions } from './PathFinding'
import { v4 as uuidv4 } from 'uuid'

/**
 * 隨機地圖生成器
 */

/**
 * 主函數：生成校園地圖
 *
 * @param config 地圖生成配置
 * @returns 生成的校園地圖
 */
export function generateCampusMap(config: MapGenerationConfig): CampusMap {
  const { rows, columns, seed } = config

  // 如果提供了種子，則設定隨機種子（簡化版）
  if (seed !== undefined) {
    // 注意：JavaScript 沒有內建的種子隨機數，這裡僅作示意
    // 實際應用可使用 seedrandom 等函式庫
  }

  // 1. 初始化網格
  const grid = initializeGrid(rows, columns)

  // 2. 放置地點
  const places = placePlaces(grid, config)

  // 3. 生成障礙物
  generateObstacles(grid, places, config)

  // 4. 設定起始點
  const startPosition = setStartPosition(grid, config)
  grid[startPosition.row][startPosition.col] = MapPositionType.START

  // 5. 驗證連通性並修復
  const placePositions = places
    .flat()
    .filter((p): p is Place => p !== null)
    .map((p) => p.position)

  let attempts = 0
  while (!validateConnectivity(grid, startPosition, placePositions)) {
    if (attempts >= 10) {
      // 嘗試太多次，重新生成
      console.warn('連通性驗證失敗，重新生成地圖')
      return generateCampusMap(config)
    }
    fixConnectivity(grid, startPosition)
    attempts++
  }

  // 6. 為每個地點生成活動
  generateEventsForPlaces(places, config)

  // 建立地圖對象
  const map: CampusMap = {
    name: `Campus ${Date.now()}`,
    rows,
    columns,
    grid,
    places,
    startPosition,
    generatedAt: Date.now(),
    seed,
  }

  return map
}

/**
 * 步驟 1：初始化網格
 * 所有格子初始化為 OPEN，邊界設為 BOUNDARY
 */
function initializeGrid(rows: number, columns: number): MapPositionType[][] {
  const grid: MapPositionType[][] = []

  for (let row = 0; row < rows; row++) {
    grid[row] = []
    for (let col = 0; col < columns; col++) {
      // 邊界為 BOUNDARY
      if (row === 0 || row === rows - 1 || col === 0 || col === columns - 1) {
        grid[row][col] = MapPositionType.BOUNDARY
      } else {
        grid[row][col] = MapPositionType.OPEN
      }
    }
  }

  return grid
}

/**
 * 步驟 2：放置地點
 */
function placePlaces(
  grid: MapPositionType[][],
  config: MapGenerationConfig
): (Place | null)[][] {
  const { rows, columns, placeCount, minDistance } = config

  // 初始化地點陣列
  const places: (Place | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(null))

  const placedPositions: Position[] = []

  // 遍歷每種地點類型
  for (const [typeStr, range] of Object.entries(placeCount)) {
    const type = typeStr as PlaceType
    const [min, max] = range
    const count = randomInt(min, max + 1) // +1 因為 randomInt 不包含上界

    for (let i = 0; i < count; i++) {
      // 尋找合適的位置
      const position = findValidPlacePosition(
        grid,
        rows,
        columns,
        placedPositions,
        minDistance
      )

      if (position) {
        // 建立地點
        const place: Place = {
          id: uuidv4(),
          name: `${getPlaceTypeName(type)} ${i + 1}`,
          type,
          position,
          description: getPlaceTypeDescription(type),
          events: [], // 稍後生成
          visited: false,
        }

        places[position.row][position.col] = place
        grid[position.row][position.col] = MapPositionType.PLACE
        placedPositions.push(position)
      }
    }
  }

  return places
}

/**
 * 尋找合適的地點位置
 */
function findValidPlacePosition(
  grid: MapPositionType[][],
  rows: number,
  columns: number,
  existingPlaces: Position[],
  minDistance: number
): Position | null {
  const maxAttempts = 100
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const row = randomInt(1, rows - 1)
    const col = randomInt(1, columns - 1)
    const position: Position = { row, col }

    // 檢查是否為開放空間
    if (grid[row][col] !== MapPositionType.OPEN) continue

    // 檢查與現有地點的距離
    const tooClose = existingPlaces.some(
      (existing) =>
        Math.abs(existing.row - row) + Math.abs(existing.col - col) <
        minDistance
    )

    if (!tooClose) {
      return position
    }
  }

  return null
}

/**
 * 步驟 3：生成障礙物
 */
function generateObstacles(
  grid: MapPositionType[][],
  places: (Place | null)[][],
  config: MapGenerationConfig
): void {
  const { rows, columns, obstacleRatio } = config

  // 計算可用空間
  const availableSpaces = (rows - 2) * (columns - 2) // 扣除邊界
  const placeCount = places.flat().filter((p) => p !== null).length
  const openSpaces = availableSpaces - placeCount

  // 計算障礙物數量
  const obstacleCount = Math.floor(openSpaces * obstacleRatio)

  let placed = 0
  const maxAttempts = obstacleCount * 10

  for (let attempt = 0; attempt < maxAttempts && placed < obstacleCount; attempt++) {
    const row = randomInt(1, rows - 1)
    const col = randomInt(1, columns - 1)

    // 只在開放空間放置障礙物
    if (grid[row][col] === MapPositionType.OPEN) {
      grid[row][col] = MapPositionType.RESTRICTED
      placed++
    }
  }
}

/**
 * 步驟 4：設定起始點
 */
function setStartPosition(
  grid: MapPositionType[][],
  config: MapGenerationConfig
): Position {
  const { rows, columns } = config

  // 嘗試在開放空間中找到起始點
  for (let attempt = 0; attempt < 100; attempt++) {
    const row = randomInt(1, rows - 1)
    const col = randomInt(1, columns - 1)

    if (grid[row][col] === MapPositionType.OPEN) {
      return { row, col }
    }
  }

  // 如果找不到，強制在中心附近設定
  const centerRow = Math.floor(rows / 2)
  const centerCol = Math.floor(columns / 2)
  grid[centerRow][centerCol] = MapPositionType.OPEN
  return { row: centerRow, col: centerCol }
}

/**
 * 步驟 5：修復連通性
 * 移除導致斷連的障礙物
 */
function fixConnectivity(
  grid: MapPositionType[][],
  startPosition: Position
): void {
  const rows = grid.length
  const cols = grid[0].length

  // 取得所有可達位置
  const reachable = getReachablePositions(grid, startPosition)

  // 找出不可達的地點
  const unreachablePlaces: Position[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        grid[row][col] === MapPositionType.PLACE &&
        !reachable.has(`${row},${col}`)
      ) {
        unreachablePlaces.push({ row, col })
      }
    }
  }

  // 為每個不可達的地點打通一條路徑
  for (const unreachable of unreachablePlaces) {
    // 簡單策略：將不可達地點周圍的障礙物移除
    const adjacent = [
      { row: unreachable.row - 1, col: unreachable.col },
      { row: unreachable.row + 1, col: unreachable.col },
      { row: unreachable.row, col: unreachable.col - 1 },
      { row: unreachable.row, col: unreachable.col + 1 },
    ]

    for (const pos of adjacent) {
      if (
        pos.row >= 0 &&
        pos.row < rows &&
        pos.col >= 0 &&
        pos.col < cols &&
        grid[pos.row][pos.col] === MapPositionType.RESTRICTED
      ) {
        grid[pos.row][pos.col] = MapPositionType.OPEN
        break // 只移除一個就夠了
      }
    }
  }
}

/**
 * 步驟 6：為地點生成活動
 */
function generateEventsForPlaces(
  places: (Place | null)[][],
  config: MapGenerationConfig
): void {
  const { eventPerPlace } = config

  for (const row of places) {
    for (const place of row) {
      if (place !== null) {
        const eventCount = randomInt(eventPerPlace[0], eventPerPlace[1] + 1)
        place.events = generateRandomEvents(place.type, eventCount)
      }
    }
  }
}

/**
 * 生成隨機活動
 */
function generateRandomEvents(placeType: PlaceType, count: number): Event[] {
  const events: Event[] = []

  // 根據地點類型選擇合適的活動類型
  const eventTypes = getEventTypesForPlace(placeType)

  for (let i = 0; i < count; i++) {
    const type = eventTypes[randomInt(0, eventTypes.length)]
    const event: Event = {
      id: uuidv4(),
      name: generateEventName(type),
      type,
      description: `這是一個${type}類型的活動`,
      duration: randomInt(30, 120), // 30-120 分鐘
      participants: randomInt(10, 100),
      completed: false,
      score: randomInt(50, 200),
    }
    events.push(event)
  }

  return events
}

/**
 * 根據地點類型取得合適的活動類型
 */
function getEventTypesForPlace(placeType: PlaceType): EventType[] {
  const mapping: Record<PlaceType, EventType[]> = {
    [PlaceType.LIBRARY]: [
      EventType.ACADEMIC_LECTURE,
      EventType.SEMINAR,
      EventType.WORKSHOP,
      EventType.EXHIBITION,
    ],
    [PlaceType.CAFETERIA]: [
      EventType.CLUB_ACTIVITY,
      EventType.CULTURAL_FESTIVAL,
    ],
    [PlaceType.SPORTS_CENTER]: [
      EventType.SPORTS_COMPETITION,
      EventType.CLUB_ACTIVITY,
    ],
    [PlaceType.LECTURE_HALL]: [
      EventType.ACADEMIC_LECTURE,
      EventType.SEMINAR,
      EventType.CONCERT,
    ],
    [PlaceType.EVENT_HALL]: [
      EventType.CULTURAL_FESTIVAL,
      EventType.CONCERT,
      EventType.EXHIBITION,
      EventType.WORKSHOP,
    ],
  }

  return mapping[placeType] || Object.values(EventType)
}

/**
 * 工具函數：生成隨機整數 [min, max)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}
