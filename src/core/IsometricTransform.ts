import { Position, IsometricPosition } from '@models/Position'

/**
 * 等距座標轉換工具
 * 用於在網格座標與等距（2.5D）螢幕座標之間進行轉換
 */

/**
 * 瓦片常數配置
 */
export const TILE_CONFIG = {
  WIDTH: 64, // 瓦片寬度（像素）
  HEIGHT: 32, // 瓦片高度（像素）
  HALF_WIDTH: 32, // 瓦片半寬
  HALF_HEIGHT: 16, // 瓦片半高
}

/**
 * 將網格座標轉換為等距螢幕座標
 *
 * 公式：
 * x = (col - row) * tileWidth / 2
 * y = (col + row) * tileHeight / 2
 *
 * @param gridPos 網格位置
 * @param tileWidth 瓦片寬度（預設 64）
 * @param tileHeight 瓦片高度（預設 32）
 * @returns 等距螢幕座標
 */
export function gridToIsometric(
  gridPos: Position,
  tileWidth: number = TILE_CONFIG.WIDTH,
  tileHeight: number = TILE_CONFIG.HEIGHT
): IsometricPosition {
  const { row, col } = gridPos
  return {
    x: (col - row) * (tileWidth / 2),
    y: (col + row) * (tileHeight / 2),
  }
}

/**
 * 將等距螢幕座標轉換為網格座標
 *
 * 公式：
 * col = (x / tileWidth) + (y / tileHeight)
 * row = (y / tileHeight) - (x / tileWidth)
 *
 * @param isoPos 等距螢幕座標
 * @param tileWidth 瓦片寬度（預設 64）
 * @param tileHeight 瓦片高度（預設 32）
 * @returns 網格位置（向下取整）
 */
export function isometricToGrid(
  isoPos: IsometricPosition,
  tileWidth: number = TILE_CONFIG.WIDTH,
  tileHeight: number = TILE_CONFIG.HEIGHT
): Position {
  const { x, y } = isoPos
  const col = x / tileWidth + y / tileHeight
  const row = y / tileHeight - x / tileWidth

  return {
    col: Math.floor(col),
    row: Math.floor(row),
  }
}

/**
 * 計算等距地圖的總寬度（像素）
 *
 * @param rows 地圖行數
 * @param cols 地圖列數
 * @param tileWidth 瓦片寬度
 * @returns 地圖總寬度
 */
export function calculateMapWidth(
  rows: number,
  cols: number,
  tileWidth: number = TILE_CONFIG.WIDTH
): number {
  return (rows + cols) * (tileWidth / 2)
}

/**
 * 計算等距地圖的總高度（像素）
 *
 * @param rows 地圖行數
 * @param cols 地圖列數
 * @param tileHeight 瓦片高度
 * @returns 地圖總高度
 */
export function calculateMapHeight(
  rows: number,
  cols: number,
  tileHeight: number = TILE_CONFIG.HEIGHT
): number {
  return (rows + cols) * (tileHeight / 2)
}

/**
 * 計算地圖中心偏移量
 * 用於將地圖置中顯示
 *
 * @param canvasWidth 畫布寬度
 * @param canvasHeight 畫布高度
 * @param mapWidth 地圖寬度
 * @param mapHeight 地圖高度
 * @returns 偏移座標
 */
export function calculateMapOffset(
  canvasWidth: number,
  canvasHeight: number,
  mapWidth: number,
  mapHeight: number
): IsometricPosition {
  return {
    x: (canvasWidth - mapWidth) / 2 + mapWidth / 2,
    y: (canvasHeight - mapHeight) / 2,
  }
}

/**
 * 將螢幕座標轉換為畫布座標（考慮偏移和縮放）
 *
 * @param screenX 螢幕 X 座標
 * @param screenY 螢幕 Y 座標
 * @param offsetX X 軸偏移
 * @param offsetY Y 軸偏移
 * @param scale 縮放比例
 * @returns 畫布座標
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  offsetX: number,
  offsetY: number,
  scale: number = 1
): IsometricPosition {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  }
}

/**
 * 將畫布座標轉換為螢幕座標（考慮偏移和縮放）
 *
 * @param canvasX 畫布 X 座標
 * @param canvasY 畫布 Y 座標
 * @param offsetX X 軸偏移
 * @param offsetY Y 軸偏移
 * @param scale 縮放比例
 * @returns 螢幕座標
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  offsetX: number,
  offsetY: number,
  scale: number = 1
): IsometricPosition {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
  }
}

/**
 * 檢查螢幕座標是否在瓦片範圍內
 * 使用菱形碰撞檢測
 *
 * @param clickPos 點擊的螢幕座標
 * @param tilePos 瓦片的螢幕座標
 * @param tileWidth 瓦片寬度
 * @param tileHeight 瓦片高度
 * @returns 是否在瓦片內
 */
export function isPointInTile(
  clickPos: IsometricPosition,
  tilePos: IsometricPosition,
  tileWidth: number = TILE_CONFIG.WIDTH,
  tileHeight: number = TILE_CONFIG.HEIGHT
): boolean {
  // 相對於瓦片中心的座標
  const dx = Math.abs(clickPos.x - tilePos.x)
  const dy = Math.abs(clickPos.y - tilePos.y)

  // 菱形碰撞檢測
  return dx / (tileWidth / 2) + dy / (tileHeight / 2) <= 1
}
