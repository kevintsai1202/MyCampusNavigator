import { CampusMap } from '@models/CampusMap'
import { Player } from '@models/Player'
import { Position, IsometricPosition } from '@models/Position'
import { MapPositionType } from '@models/MapPosition'
import { PlaceType, getPlaceTypeIcon } from '@models/Place'
import {
  gridToIsometric,
  TILE_CONFIG,
  calculateMapWidth,
  calculateMapHeight,
  calculateMapOffset,
} from './IsometricTransform'

/**
 * 渲染層次枚舉（從後到前）
 */
export enum RenderLayer {
  GROUND = 0, // 地面層（磚塊）
  DECORATION = 1, // 裝飾層（樹木、草地）
  BUILDING = 2, // 建築層（地點）
  CHARACTER = 3, // 角色層（玩家）
  EFFECT = 4, // 特效層（動畫）
  UI = 5, // UI 層（對話框）
}

/**
 * 可渲染物件介面
 */
export interface Renderable {
  layer: RenderLayer
  position: Position
  zIndex: number // 同層內的深度（row + col 決定）
  visible: boolean
  render: (ctx: CanvasRenderingContext2D) => void
}

/**
 * 等距視角渲染引擎
 * 負責將遊戲地圖和物件渲染到 Canvas 上
 */
export class IsometricRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private tileWidth: number = TILE_CONFIG.WIDTH // 磚塊寬度
  private tileHeight: number = TILE_CONFIG.HEIGHT // 磚塊高度
  private offsetX: number = 0 // 視角偏移 X
  private offsetY: number = 0 // 視角偏移 Y
  private scale: number = 1 // 縮放比例

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('無法取得 2D 渲染上下文')
    }
    this.ctx = context

    // 設定 Canvas 為全螢幕
    this.resizeCanvas()

    // 監聽視窗大小變化
    window.addEventListener('resize', () => this.resizeCanvas())
  }

  /**
   * 調整 Canvas 大小為全螢幕
   */
  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /**
   * 渲染整個場景
   * @param map 校園地圖
   * @param player 玩家資料
   */
  render(map: CampusMap, player: Player): void {
    // 清空畫布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 設定背景色
    this.ctx.fillStyle = '#1a1a2e'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 計算地圖置中偏移
    this.updateCameraOffset(map, player)

    // 收集所有可渲染物件
    const renderables: Renderable[] = []

    // 加入地圖磚塊
    renderables.push(...this.collectTiles(map))

    // 加入建築物（地點）
    renderables.push(...this.collectBuildings(map))

    // 加入玩家
    renderables.push(this.createPlayerRenderable(player))

    // 排序（先按層次，再按 zIndex）
    renderables.sort((a, b) => {
      if (a.layer !== b.layer) return a.layer - b.layer
      return a.zIndex - b.zIndex
    })

    // 渲染所有物件
    this.ctx.save()
    this.ctx.translate(this.offsetX, this.offsetY)
    this.ctx.scale(this.scale, this.scale)

    for (const renderable of renderables) {
      if (renderable.visible) {
        renderable.render(this.ctx)
      }
    }

    this.ctx.restore()
  }

  /**
   * 更新相機偏移（跟隨玩家）
   */
  private updateCameraOffset(map: CampusMap, player: Player): void {
    // 計算玩家的等距座標
    const playerIsoPos = gridToIsometric(
      player.position,
      this.tileWidth,
      this.tileHeight
    )

    // 將玩家置於螢幕中心
    this.offsetX = this.canvas.width / 2 - playerIsoPos.x
    this.offsetY = this.canvas.height / 2 - playerIsoPos.y - 100 // 稍微往上偏移
  }

  /**
   * 收集地圖磚塊
   */
  private collectTiles(map: CampusMap): Renderable[] {
    const tiles: Renderable[] = []

    for (let row = 0; row < map.rows; row++) {
      for (let col = 0; col < map.columns; col++) {
        const type = map.grid[row][col]
        const pos: Position = { row, col }
        const isoPos = gridToIsometric(pos, this.tileWidth, this.tileHeight)

        tiles.push({
          layer: RenderLayer.GROUND,
          position: pos,
          zIndex: row + col,
          visible: true,
          render: (ctx) => {
            this.renderTile(ctx, isoPos, type)
          },
        })
      }
    }

    return tiles
  }

  /**
   * 收集建築物（地點）
   */
  private collectBuildings(map: CampusMap): Renderable[] {
    const buildings: Renderable[] = []

    for (let row = 0; row < map.rows; row++) {
      for (let col = 0; col < map.columns; col++) {
        const place = map.places[row][col]
        if (place) {
          const pos: Position = { row, col }
          const isoPos = gridToIsometric(pos, this.tileWidth, this.tileHeight)

          buildings.push({
            layer: RenderLayer.BUILDING,
            position: pos,
            zIndex: row + col,
            visible: true,
            render: (ctx) => {
              this.renderBuilding(ctx, isoPos, place.type, place.visited)
            },
          })
        }
      }
    }

    return buildings
  }

  /**
   * 建立玩家可渲染物件
   */
  private createPlayerRenderable(player: Player): Renderable {
    const isoPos = gridToIsometric(
      player.position,
      this.tileWidth,
      this.tileHeight
    )

    return {
      layer: RenderLayer.CHARACTER,
      position: player.position,
      zIndex: player.position.row + player.position.col,
      visible: true,
      render: (ctx) => {
        this.renderPlayer(ctx, isoPos)
      },
    }
  }

  /**
   * 渲染單一磚塊（等距菱形）
   */
  private renderTile(
    ctx: CanvasRenderingContext2D,
    isoPos: IsometricPosition,
    type: MapPositionType
  ): void {
    ctx.save()
    ctx.translate(isoPos.x, isoPos.y)

    // 繪製等距菱形磚塊
    ctx.beginPath()
    ctx.moveTo(0, -this.tileHeight / 2) // 上
    ctx.lineTo(this.tileWidth / 2, 0) // 右
    ctx.lineTo(0, this.tileHeight / 2) // 下
    ctx.lineTo(-this.tileWidth / 2, 0) // 左
    ctx.closePath()

    // 根據類型填充顏色
    ctx.fillStyle = this.getTileColor(type)
    ctx.fill()

    // 邊框
    ctx.strokeStyle = this.getTileBorderColor(type)
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }

  /**
   * 取得磚塊顏色
   */
  private getTileColor(type: MapPositionType): string {
    switch (type) {
      case MapPositionType.BOUNDARY:
        return '#555555' // 深灰色邊界
      case MapPositionType.OPEN:
        return '#90EE90' // 淺綠色草地
      case MapPositionType.RESTRICTED:
        return '#8B4513' // 棕色障礙物
      case MapPositionType.PLACE:
        return '#87CEEB' // 天藍色地點
      case MapPositionType.START:
        return '#FFD700' // 金色起點
      default:
        return '#FFFFFF'
    }
  }

  /**
   * 取得磚塊邊框顏色
   */
  private getTileBorderColor(type: MapPositionType): string {
    switch (type) {
      case MapPositionType.BOUNDARY:
        return '#333333'
      case MapPositionType.OPEN:
        return '#7CCD7C'
      case MapPositionType.RESTRICTED:
        return '#654321'
      case MapPositionType.PLACE:
        return '#6FA8DC'
      case MapPositionType.START:
        return '#DAA520'
      default:
        return '#CCCCCC'
    }
  }

  /**
   * 渲染建築物（使用 emoji）
   */
  private renderBuilding(
    ctx: CanvasRenderingContext2D,
    isoPos: IsometricPosition,
    placeType: PlaceType,
    visited: boolean
  ): void {
    ctx.save()
    ctx.translate(isoPos.x, isoPos.y)

    // 繪製建築物底座（立體感）
    ctx.fillStyle = visited ? '#4A90E2' : '#F39C12'
    ctx.fillRect(-20, -40, 40, 30)

    // 繪製建築物陰影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(-18, -10, 36, 4)

    // 繪製 emoji 圖示
    const emoji = getPlaceTypeIcon(placeType)
    ctx.font = '32px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(emoji, 0, -25)

    // 已訪問標記
    if (visited) {
      ctx.font = 'bold 16px Arial'
      ctx.fillStyle = '#00FF00'
      ctx.fillText('✓', 15, -40)
    }

    ctx.restore()
  }

  /**
   * 渲染玩家（使用 emoji）
   */
  private renderPlayer(
    ctx: CanvasRenderingContext2D,
    isoPos: IsometricPosition
  ): void {
    ctx.save()
    ctx.translate(isoPos.x, isoPos.y)

    // 繪製玩家陰影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.beginPath()
    ctx.ellipse(0, 5, 15, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // 繪製玩家 emoji
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#FFFFFF'

    // 使用玩家 emoji（可以根據方向改變）
    const playerEmoji = '🚶'
    ctx.fillText(playerEmoji, 0, -20)

    // 繪製玩家名稱標籤（可選）
    ctx.font = '12px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    // ctx.strokeText(player.name, 0, -50)
    // ctx.fillText(player.name, 0, -50)

    ctx.restore()
  }

  /**
   * 銷毀渲染器
   */
  destroy(): void {
    window.removeEventListener('resize', () => this.resizeCanvas())
  }
}
