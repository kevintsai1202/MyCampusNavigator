import { Position } from './Position'
import { Event } from './Event'

/**
 * 地點相關介面定義
 */

/**
 * 地點類型枚舉
 */
export enum PlaceType {
  LIBRARY = 'LIBRARY', // 圖書館
  CAFETERIA = 'CAFETERIA', // 餐廳
  SPORTS_CENTER = 'SPORTS_CENTER', // 運動中心
  LECTURE_HALL = 'LECTURE_HALL', // 演講廳
  EVENT_HALL = 'EVENT_HALL', // 活動中心
}

/**
 * 地點介面
 */
export interface Place {
  id: string // 唯一識別碼
  name: string // 地點名稱
  type: PlaceType // 地點類型
  position: Position // 地圖位置
  description: string // 描述
  events: Event[] // 該地點的活動列表
  visited: boolean // 是否已訪問
  discoveredAt?: number // 發現時間戳記
}

/**
 * 取得地點類型的顯示名稱
 */
export function getPlaceTypeName(type: PlaceType): string {
  const names: Record<PlaceType, string> = {
    [PlaceType.LIBRARY]: '圖書館',
    [PlaceType.CAFETERIA]: '餐廳',
    [PlaceType.SPORTS_CENTER]: '運動中心',
    [PlaceType.LECTURE_HALL]: '演講廳',
    [PlaceType.EVENT_HALL]: '活動中心',
  }
  return names[type]
}

/**
 * 取得地點類型的描述
 */
export function getPlaceTypeDescription(type: PlaceType): string {
  const descriptions: Record<PlaceType, string> = {
    [PlaceType.LIBRARY]:
      '一個充滿知識的地方，學生們在這裡閱讀和學習。',
    [PlaceType.CAFETERIA]: '提供美味餐點的地方，是學生們聚會的熱門地點。',
    [PlaceType.SPORTS_CENTER]:
      '運動和健身的場所，設有各種運動設施。',
    [PlaceType.LECTURE_HALL]: '舉辦講座和大型課程的場所。',
    [PlaceType.EVENT_HALL]: '舉辦各種校園活動和慶典的多功能場地。',
  }
  return descriptions[type]
}

/**
 * 取得地點類型的圖示 emoji
 */
export function getPlaceTypeIcon(type: PlaceType): string {
  const icons: Record<PlaceType, string> = {
    [PlaceType.LIBRARY]: '📚',
    [PlaceType.CAFETERIA]: '🍽️',
    [PlaceType.SPORTS_CENTER]: '🏋️',
    [PlaceType.LECTURE_HALL]: '🎓',
    [PlaceType.EVENT_HALL]: '🎭',
  }
  return icons[type]
}
