import { useEffect } from 'react'
import { useGameStore } from './stores/gameStore'
import { GameStatus } from './models/GameState'
import { getAllPlaces, calculateMapStats } from './models/CampusMap'
import { getPlaceTypeIcon, getPlaceTypeName } from './models/Place'
import GameCanvas from './components/game/GameCanvas'
import Dialog from './components/ui/Dialog'
import PlaceDialog from './components/ui/PlaceDialog'

/**
 * 主應用程式組件
 * 負責管理整體遊戲狀態和路由
 */
function App() {
  const { status, map, player, startNewGame, showPlaceDialog, currentPlace, closePlaceDialog } = useGameStore()

  // 測試：自動開始遊戲（開發模式）
  useEffect(() => {
    if (status === GameStatus.MENU) {
      console.log('自動開始遊戲（開發測試模式）')
      // startNewGame('測試玩家')
    }
  }, [status])

  // 主選單畫面
  if (status === GameStatus.MENU) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            My Campus Navigator
          </h1>
          <p className="text-xl text-gray-300 mb-12">校園導航冒險遊戲</p>

          <div className="space-y-4">
            <button
              onClick={() => startNewGame('玩家')}
              className="btn-primary text-2xl py-4 px-8"
            >
              開始遊戲
            </button>
            <div className="text-gray-400 text-sm mt-8">
              <p>✓ 專案架構已建立</p>
              <p>✓ 資料模型已完成</p>
              <p>✓ 地圖生成器已完成</p>
              <p>✓ 遊戲狀態管理已完成</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 遊戲畫面
  if (status === GameStatus.PLAYING && map && player) {
    const places = getAllPlaces(map)
    const stats = calculateMapStats(map)

    return (
      <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
        {/* 頂部資訊列 */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{map.name}</h2>
              <p className="text-sm text-gray-400">
                玩家：{player.name} | 位置：({player.position.row},{' '}
                {player.position.col})
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">
                {player.totalScore} 分
              </div>
              <div className="text-sm text-gray-400">
                移動次數：{player.moveCount} | 訪問：
                {player.visitedPlaces.length}/{places.length}
              </div>
            </div>
          </div>
        </div>

        {/* 主要遊戲區域 */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Canvas 遊戲視窗 */}
          <div className="flex-1 relative overflow-hidden bg-gray-900">
            <GameCanvas />

            {/* 遊戲提示（覆蓋在 Canvas 上） */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
              <p>🎮 使用方向鍵或 WASD 移動</p>
              <p>🗺️ 等距視角渲染系統已啟用</p>
            </div>
          </div>

          {/* 右側資訊面板 */}
          <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 overflow-auto">
            {/* 地圖統計 */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">地圖資訊</h3>
              <div className="text-sm space-y-1">
                <p>大小：{map.rows} × {map.columns}</p>
                <p>地點總數：{stats.totalPlaces}</p>
                <p>活動總數：{stats.totalEvents}</p>
                <p>可通行格子：{stats.walkableTiles}</p>
              </div>
            </div>

            {/* 地點列表 */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">地點列表</h3>
              <div className="space-y-2 max-h-96 overflow-auto">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className={`p-3 rounded ${
                      place.visited ? 'bg-blue-900/30' : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getPlaceTypeIcon(place.type)}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{place.name}</div>
                        <div className="text-xs text-gray-400">
                          {getPlaceTypeName(place.type)} | 位置: ({place.position.row}
                          ,{place.position.col})
                        </div>
                        <div className="text-xs text-gray-500">
                          {place.events.length} 個活動
                        </div>
                      </div>
                      {place.visited && (
                        <span className="text-green-400 text-sm">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 對話框系統 */}
        <Dialog />

        {/* 地點互動對話框 */}
        {showPlaceDialog && currentPlace && (
          <PlaceDialog place={currentPlace} onClose={closePlaceDialog} />
        )}
      </div>
    )
  }

  // 其他狀態
  return (
    <div className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl">載入中...</p>
      </div>
    </div>
  )
}

export default App
