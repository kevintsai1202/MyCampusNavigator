/**
 * 地圖格子類型定義
 */

/**
 * 地圖格子類型枚舉
 */
export enum MapPositionType {
  BOUNDARY = 'BOUNDARY', // 邊界（不可通行）
  OPEN = 'OPEN', // 開放空間（可通行）
  RESTRICTED = 'RESTRICTED', // 限制區域（不可通行，如障礙物）
  PLACE = 'PLACE', // 地點（可通行，有建築物）
  START = 'START', // 起始點（可通行）
}

/**
 * 檢查格子是否可通行
 */
export function isWalkable(type: MapPositionType): boolean {
  return (
    type === MapPositionType.OPEN ||
    type === MapPositionType.PLACE ||
    type === MapPositionType.START
  )
}

/**
 * 取得格子類型的顯示名稱
 */
export function getMapPositionTypeName(type: MapPositionType): string {
  const names: Record<MapPositionType, string> = {
    [MapPositionType.BOUNDARY]: '邊界',
    [MapPositionType.OPEN]: '開放空間',
    [MapPositionType.RESTRICTED]: '障礙物',
    [MapPositionType.PLACE]: '地點',
    [MapPositionType.START]: '起始點',
  }
  return names[type]
}
