import { useEffect, useCallback, useRef } from 'react'
import { Direction } from '@core/CollisionSystem'

/**
 * 鍵盤按鍵對應的方向
 */
const KEY_DIRECTION_MAP: Record<string, Direction> = {
  // 方向鍵
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,

  // WASD
  w: Direction.UP,
  W: Direction.UP,
  s: Direction.DOWN,
  S: Direction.DOWN,
  a: Direction.LEFT,
  A: Direction.LEFT,
  d: Direction.RIGHT,
  D: Direction.RIGHT,

  // 數字鍵盤（可選）
  '8': Direction.UP,
  '2': Direction.DOWN,
  '4': Direction.LEFT,
  '6': Direction.RIGHT,
  '7': Direction.UP_LEFT,
  '9': Direction.UP_RIGHT,
  '1': Direction.DOWN_LEFT,
  '3': Direction.DOWN_RIGHT,
}

/**
 * 鍵盤輸入處理 Hook
 * 支援方向鍵、WASD 和數字鍵盤
 *
 * @param onMove 移動回調函數
 * @param enabled 是否啟用鍵盤輸入（預設 true）
 * @param debounceMs 防抖動延遲（毫秒，預設 100）
 */
export function useKeyboard(
  onMove: (direction: Direction) => void,
  enabled: boolean = true,
  debounceMs: number = 100
) {
  const lastMoveTime = useRef<number>(0)
  const pressedKeys = useRef<Set<string>>(new Set())

  /**
   * 處理按鍵按下事件
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const key = event.key
      const direction = KEY_DIRECTION_MAP[key]

      if (!direction) return

      // 防止預設行為（如頁面滾動）
      event.preventDefault()

      // 檢查是否已按下（防止重複觸發）
      if (pressedKeys.current.has(key)) return
      pressedKeys.current.add(key)

      // 防抖動處理
      const now = Date.now()
      if (now - lastMoveTime.current < debounceMs) {
        return
      }

      lastMoveTime.current = now
      onMove(direction)
    },
    [enabled, onMove, debounceMs]
  )

  /**
   * 處理按鍵釋放事件
   */
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key)
  }, [])

  /**
   * 註冊/移除事件監聽器
   */
  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enabled, handleKeyDown, handleKeyUp])

  /**
   * 清理所有按鍵狀態
   */
  const clearKeys = useCallback(() => {
    pressedKeys.current.clear()
  }, [])

  return { clearKeys }
}
