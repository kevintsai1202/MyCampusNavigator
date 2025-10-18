/**
 * 資料模型統一匯出
 */

// Position
export type { Position, IsometricPosition } from './Position'
export {
  isSamePosition,
  getManhattanDistance,
  getAdjacentPositions,
  isValidPosition,
} from './Position'

// MapPosition
export { MapPositionType } from './MapPosition'
export { isWalkable, getMapPositionTypeName } from './MapPosition'

// Place
export { PlaceType } from './Place'
export type { Place } from './Place'
export {
  getPlaceTypeName,
  getPlaceTypeDescription,
  getPlaceTypeIcon,
} from './Place'

// Event
export { EventType } from './Event'
export type { Event } from './Event'
export {
  getEventTypeName,
  getEventTypeIcon,
  generateEventName,
} from './Event'

// Player
export type { Player, PlayerStats } from './Player'
export {
  createPlayer,
  calculatePlayerStats,
  hasCompletedAllEvents,
} from './Player'

// CampusMap
export type {
  CampusMap,
  MapGenerationConfig,
  MapStats,
} from './CampusMap'
export {
  getMapPositionType,
  getPlaceAt,
  getAllPlaces,
  calculateMapStats,
} from './CampusMap'

// GameState
export { GameStatus } from './GameState'
export type {
  GameSettings,
  GameSave,
  DialogData,
  HighScore,
} from './GameState'
export { createDefaultSettings, formatGameTime } from './GameState'
