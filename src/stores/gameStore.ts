import { create } from 'zustand'
import { CampusMap, MapGenerationConfig } from '@models/CampusMap'
import { Player, createPlayer } from '@models/Player'
import { GameStatus, GameSettings, createDefaultSettings, DialogData } from '@models/GameState'
import { PlaceType } from '@models/Place'
import { generateCampusMap } from '@core/MapGenerator'
import { Position } from '@models/Position'
import { getPlaceAt } from '@models/CampusMap'
import { CollisionSystem, Direction } from '@core/CollisionSystem'

/**
 * 遊戲狀態管理 Store
 * 使用 Zustand 進行全局狀態管理
 */

interface GameStore {
  // 遊戲狀態
  status: GameStatus
  map: CampusMap | null
  player: Player | null
  isPaused: boolean
  elapsedTime: number
  showDialog: boolean
  currentDialog: DialogData | null
  settings: GameSettings

  // 動作方法
  startNewGame: (playerName?: string) => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  returnToMenu: () => void

  // 玩家移動
  movePlayer: (newPosition: Position) => void
  movePlayerByDirection: (direction: Direction) => void

  // 地點互動
  visitPlace: (position: Position) => void
  completeEvent: (eventId: string) => void

  // 對話框
  showDialogBox: (dialog: DialogData) => void
  hideDialogBox: () => void

  // 設定
  updateSettings: (settings: Partial<GameSettings>) => void

  // 時間更新
  updateElapsedTime: (deltaTime: number) => void
}

/**
 * 預設地圖生成配置
 */
const DEFAULT_MAP_CONFIG: MapGenerationConfig = {
  rows: 18,
  columns: 18,
  placeCount: {
    [PlaceType.LIBRARY]: [2, 3],
    [PlaceType.CAFETERIA]: [2, 4],
    [PlaceType.SPORTS_CENTER]: [1, 2],
    [PlaceType.LECTURE_HALL]: [3, 5],
    [PlaceType.EVENT_HALL]: [1, 2],
  },
  obstacleRatio: 0.15,
  minDistance: 3,
  eventPerPlace: [1, 3],
}

/**
 * 建立遊戲 Store
 */
export const useGameStore = create<GameStore>((set, get) => ({
  // 初始狀態
  status: GameStatus.MENU,
  map: null,
  player: null,
  isPaused: false,
  elapsedTime: 0,
  showDialog: false,
  currentDialog: null,
  settings: createDefaultSettings(),

  // 開始新遊戲
  startNewGame: (playerName = '玩家') => {
    console.log('開始新遊戲...')

    // 生成地圖
    const map = generateCampusMap(DEFAULT_MAP_CONFIG)
    console.log('地圖生成完成：', map)

    // 建立玩家
    const player = createPlayer(playerName, map.startPosition)

    set({
      status: GameStatus.PLAYING,
      map,
      player,
      isPaused: false,
      elapsedTime: 0,
    })
  },

  // 暫停遊戲
  pauseGame: () => {
    set({ isPaused: true })
  },

  // 繼續遊戲
  resumeGame: () => {
    set({ isPaused: false })
  },

  // 結束遊戲
  endGame: () => {
    const { player, elapsedTime } = get()

    set({
      status: GameStatus.COMPLETED,
    })

    // 顯示結束對話框
    get().showDialogBox({
      title: '遊戲結束',
      content: `恭喜 ${player?.name}！\n\n總分：${player?.totalScore}\n遊戲時間：${Math.floor(elapsedTime / 1000)}秒\n訪問地點：${player?.visitedPlaces.length}\n完成活動：${player?.completedEvents.length}`,
      type: 'success',
      confirmText: '返回主選單',
      onConfirm: () => {
        get().hideDialogBox()
        get().returnToMenu()
      },
    })
  },

  // 返回主選單
  returnToMenu: () => {
    set({
      status: GameStatus.MENU,
      map: null,
      player: null,
      isPaused: false,
      elapsedTime: 0,
    })
  },

  // 移動玩家（直接指定位置）
  movePlayer: (newPosition: Position) => {
    const { player, map } = get()
    if (!player || !map) return

    // 使用碰撞系統驗證
    if (!CollisionSystem.isWalkable(newPosition, map)) {
      console.log('無法移動到該位置')
      return
    }

    // 更新玩家位置
    set({
      player: {
        ...player,
        position: newPosition,
        moveCount: player.moveCount + 1,
        pathHistory: [...player.pathHistory, newPosition],
      },
    })

    // 檢查是否到達新地點
    const place = getPlaceAt(map, newPosition)
    if (place && !place.visited) {
      get().visitPlace(newPosition)
    }
  },

  // 按方向移動玩家（含碰撞檢測）
  movePlayerByDirection: (direction: Direction) => {
    const { player, map } = get()
    if (!player || !map) return

    // 執行碰撞檢測
    const moveResult = CollisionSystem.checkMove(player.position, direction, map)

    if (!moveResult.success) {
      // 移動失敗，記錄碰撞
      console.log(`碰撞: ${moveResult.message}`)
      // 可以在這裡加入碰撞音效或視覺回饋
      return
    }

    // 移動成功，更新玩家位置
    set({
      player: {
        ...player,
        position: moveResult.newPosition,
        moveCount: player.moveCount + 1,
        pathHistory: [...player.pathHistory, moveResult.newPosition],
      },
    })

    // 檢查是否到達新地點
    const place = getPlaceAt(map, moveResult.newPosition)
    if (place && !place.visited) {
      get().visitPlace(moveResult.newPosition)
    }
  },

  // 訪問地點
  visitPlace: (position: Position) => {
    const { map, player } = get()
    if (!map || !player) return

    const place = getPlaceAt(map, position)
    if (!place) return

    // 標記地點為已訪問
    place.visited = true
    place.discoveredAt = Date.now()

    // 更新玩家狀態
    set({
      player: {
        ...player,
        visitedPlaces: [...player.visitedPlaces, place.id],
      },
    })

    // 顯示地點資訊對話框
    get().showDialogBox({
      title: `發現：${place.name}`,
      content: `${place.description}\n\n此地點有 ${place.events.length} 個活動可參加。`,
      type: 'info',
      confirmText: '確定',
      onConfirm: () => {
        get().hideDialogBox()
      },
    })
  },

  // 完成活動
  completeEvent: (eventId: string) => {
    const { map, player } = get()
    if (!map || !player) return

    // 找出該活動
    let targetEvent = null
    for (const row of map.places) {
      for (const place of row) {
        if (place) {
          const event = place.events.find((e) => e.id === eventId)
          if (event) {
            targetEvent = event
            break
          }
        }
      }
      if (targetEvent) break
    }

    if (!targetEvent || targetEvent.completed) return

    // 標記活動為完成
    targetEvent.completed = true
    targetEvent.completedAt = Date.now()

    // 更新玩家分數和完成的活動
    set({
      player: {
        ...player,
        completedEvents: [...player.completedEvents, eventId],
        totalScore: player.totalScore + targetEvent.score,
      },
    })

    // 顯示活動完成對話框
    get().showDialogBox({
      title: '活動完成！',
      content: `完成活動：${targetEvent.name}\n獲得分數：+${targetEvent.score}`,
      type: 'success',
      confirmText: '確定',
      onConfirm: () => {
        get().hideDialogBox()
      },
    })
  },

  // 顯示對話框
  showDialogBox: (dialog: DialogData) => {
    set({
      showDialog: true,
      currentDialog: dialog,
    })
  },

  // 隱藏對話框
  hideDialogBox: () => {
    set({
      showDialog: false,
      currentDialog: null,
    })
  },

  // 更新設定
  updateSettings: (newSettings: Partial<GameSettings>) => {
    const { settings } = get()
    set({
      settings: { ...settings, ...newSettings },
    })
  },

  // 更新遊戲時間
  updateElapsedTime: (deltaTime: number) => {
    const { elapsedTime } = get()
    set({
      elapsedTime: elapsedTime + deltaTime,
    })
  },
}))
