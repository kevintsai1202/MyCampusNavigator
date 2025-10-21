import { useGameStore } from '@stores/gameStore'
import { DialogData } from '@models/GameState'

/**
 * 對話框組件
 * 顯示遊戲中的各種對話框（資訊、警告、確認等）
 */
export default function Dialog() {
  const { showDialog, currentDialog, hideDialogBox } = useGameStore()

  if (!showDialog || !currentDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={hideDialogBox}
      />

      {/* 對話框內容 */}
      <div className="relative bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-fade-in">
        {/* 標題列 */}
        <div
          className={`px-6 py-4 border-b border-gray-700 ${getHeaderColor(
            currentDialog.type
          )}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getDialogIcon(currentDialog.type)}</span>
            <h2 className="text-2xl font-bold text-white">
              {currentDialog.title}
            </h2>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="px-6 py-6">
          <div className="text-gray-200 whitespace-pre-line leading-relaxed">
            {currentDialog.content}
          </div>
        </div>

        {/* 按鈕區域 */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 flex justify-end gap-3">
          {currentDialog.cancelText && currentDialog.onCancel && (
            <button
              onClick={() => {
                currentDialog.onCancel?.()
                hideDialogBox()
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {currentDialog.cancelText}
            </button>
          )}
          {currentDialog.confirmText && (
            <button
              onClick={() => {
                currentDialog.onConfirm?.()
                if (!currentDialog.onCancel) {
                  // 如果沒有取消按鈕，確認後自動關閉
                  hideDialogBox()
                }
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${getButtonColor(
                currentDialog.type
              )}`}
            >
              {currentDialog.confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 根據對話框類型取得圖示
 */
function getDialogIcon(type: DialogData['type']): string {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }
  return icons[type]
}

/**
 * 根據對話框類型取得標題顏色
 */
function getHeaderColor(type: DialogData['type']): string {
  const colors = {
    info: 'bg-blue-900/50',
    success: 'bg-green-900/50',
    warning: 'bg-yellow-900/50',
    error: 'bg-red-900/50',
  }
  return colors[type]
}

/**
 * 根據對話框類型取得按鈕顏色
 */
function getButtonColor(type: DialogData['type']): string {
  const colors = {
    info: 'bg-blue-600 hover:bg-blue-500 text-white',
    success: 'bg-green-600 hover:bg-green-500 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-500 text-white',
    error: 'bg-red-600 hover:bg-red-500 text-white',
  }
  return colors[type]
}
