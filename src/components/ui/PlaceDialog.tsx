import { useGameStore } from '@stores/gameStore'
import { Place, getPlaceTypeIcon, getPlaceTypeName } from '@models/Place'
import { getEventTypeIcon, getEventTypeName } from '@models/Event'

/**
 * 地點互動對話框組件
 * 顯示地點詳細資訊和可參加的活動列表
 */
interface PlaceDialogProps {
  place: Place
  onClose: () => void
}

export default function PlaceDialog({ place, onClose }: PlaceDialogProps) {
  const { completeEvent, player } = useGameStore()

  // 計算可參加的活動（未完成的）
  const availableEvents = place.events.filter((event) => !event.completed)
  const completedEvents = place.events.filter((event) => event.completed)

  // 計算地點訪問獎勵分數（首次訪問）
  const visitBonus = !place.visited ? 50 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 對話框內容 */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-600/50 rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-scale-in">
        {/* 標題區域 */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 px-6 py-5 border-b border-yellow-600/30">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{getPlaceTypeIcon(place.type)}</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
                {place.name}
              </h2>
              <p className="text-yellow-400 text-sm font-semibold">
                {getPlaceTypeName(place.type)}
              </p>
            </div>
            {!place.visited && (
              <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                +{visitBonus} 分 🎉
              </div>
            )}
          </div>
        </div>

        {/* 描述區域 */}
        <div className="px-6 py-4 bg-gray-800/50">
          <p className="text-gray-300 leading-relaxed">{place.description}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-400">
            <span>📍 位置: ({place.position.row}, {place.position.col})</span>
            <span>🎯 活動數: {place.events.length}</span>
          </div>
        </div>

        {/* 活動列表區域 */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>可參加的活動</span>
            {availableEvents.length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {availableEvents.length}
              </span>
            )}
          </h3>

          {availableEvents.length === 0 ? (
            <div className="bg-gray-700/50 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-lg">
                {completedEvents.length > 0
                  ? '🎊 此地點的所有活動都已完成！'
                  : '目前沒有可參加的活動'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 border border-gray-600 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getEventTypeIcon(event.type)}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">
                        {event.name}
                      </h4>
                      <p className="text-sm text-blue-400 mb-2">
                        {getEventTypeName(event.type)}
                      </p>
                      <p className="text-gray-300 text-sm mb-3">
                        {event.description}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>⏱️ {event.duration} 分鐘</span>
                        <span>👥 {event.participants} 人</span>
                        <span className="text-yellow-400 font-bold">
                          💰 +{event.score} 分
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        completeEvent(event.id)
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap"
                    >
                      參加活動
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 已完成的活動 */}
          {completedEvents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">
                <span>✅</span>
                <span>已完成的活動</span>
              </h3>
              <div className="space-y-2">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-green-900/20 rounded-lg p-3 border border-green-600/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl opacity-50">
                        {getEventTypeIcon(event.type)}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-300 font-semibold">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          已獲得 {event.score} 分
                        </p>
                      </div>
                      <span className="text-green-400 text-xl">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部按鈕區域 */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {player && (
              <span>
                目前總分: <span className="text-yellow-400 font-bold">{player.totalScore}</span> 分
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
          >
            離開
          </button>
        </div>
      </div>
    </div>
  )
}
