import { useEffect, useRef } from 'react'
import { useGameStore } from '@stores/gameStore'
import { IsometricRenderer } from '@core/IsometricRenderer'

/**
 * 遊戲 Canvas 組件
 * 負責渲染等距視角遊戲畫面
 */
export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<IsometricRenderer | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const { map, player } = useGameStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !map || !player) {
      return
    }

    // 初始化渲染器
    try {
      rendererRef.current = new IsometricRenderer(canvas)
    } catch (error) {
      console.error('初始化渲染器失敗:', error)
      return
    }

    // 渲染循環
    const render = () => {
      if (rendererRef.current && map && player) {
        rendererRef.current.render(map, player)
      }
      animationFrameRef.current = requestAnimationFrame(render)
    }

    // 開始渲染
    render()

    // 清理函數
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.destroy()
      }
    }
  }, [map, player])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
