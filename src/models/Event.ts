/**
 * 活動相關介面定義
 */

/**
 * 活動類型枚舉
 */
export enum EventType {
  CLUB_ACTIVITY = 'CLUB_ACTIVITY', // 社團活動
  ACADEMIC_LECTURE = 'ACADEMIC_LECTURE', // 學術講座
  SPORTS_COMPETITION = 'SPORTS_COMPETITION', // 運動比賽
  CULTURAL_FESTIVAL = 'CULTURAL_FESTIVAL', // 文化節慶
  WORKSHOP = 'WORKSHOP', // 工作坊
  CONCERT = 'CONCERT', // 音樂會
  EXHIBITION = 'EXHIBITION', // 展覽
  SEMINAR = 'SEMINAR', // 研討會
}

/**
 * 活動介面
 */
export interface Event {
  id: string // 唯一識別碼
  name: string // 活動名稱
  type: EventType // 活動類型
  description: string // 活動描述
  duration: number // 持續時間（分鐘）
  participants: number // 參與人數
  completed: boolean // 是否已完成
  completedAt?: number // 完成時間戳記
  score: number // 完成後獲得的分數
}

/**
 * 取得活動類型的顯示名稱
 */
export function getEventTypeName(type: EventType): string {
  const names: Record<EventType, string> = {
    [EventType.CLUB_ACTIVITY]: '社團活動',
    [EventType.ACADEMIC_LECTURE]: '學術講座',
    [EventType.SPORTS_COMPETITION]: '運動比賽',
    [EventType.CULTURAL_FESTIVAL]: '文化節慶',
    [EventType.WORKSHOP]: '工作坊',
    [EventType.CONCERT]: '音樂會',
    [EventType.EXHIBITION]: '展覽',
    [EventType.SEMINAR]: '研討會',
  }
  return names[type]
}

/**
 * 取得活動類型的圖示 emoji
 */
export function getEventTypeIcon(type: EventType): string {
  const icons: Record<EventType, string> = {
    [EventType.CLUB_ACTIVITY]: '👥',
    [EventType.ACADEMIC_LECTURE]: '📖',
    [EventType.SPORTS_COMPETITION]: '🏆',
    [EventType.CULTURAL_FESTIVAL]: '🎉',
    [EventType.WORKSHOP]: '🛠️',
    [EventType.CONCERT]: '🎵',
    [EventType.EXHIBITION]: '🖼️',
    [EventType.SEMINAR]: '💼',
  }
  return icons[type]
}

/**
 * 根據活動類型生成隨機活動名稱
 */
export function generateEventName(type: EventType): string {
  const names: Record<EventType, string[]> = {
    [EventType.CLUB_ACTIVITY]: [
      '攝影社成果展',
      '動漫研討會',
      '登山社迎新',
      '舞蹈社練習',
    ],
    [EventType.ACADEMIC_LECTURE]: [
      'AI 與未來講座',
      '量子物理入門',
      '文學賞析會',
      '歷史專題演講',
    ],
    [EventType.SPORTS_COMPETITION]: [
      '校際籃球賽',
      '羽球友誼賽',
      '游泳競賽',
      '足球錦標賽',
    ],
    [EventType.CULTURAL_FESTIVAL]: [
      '國際美食節',
      '傳統文化週',
      '語言交流日',
      '音樂祭',
    ],
    [EventType.WORKSHOP]: [
      '程式設計工作坊',
      '陶藝創作課',
      '烘焙體驗營',
      '攝影技巧班',
    ],
    [EventType.CONCERT]: [
      '校園歌唱大賽',
      '交響樂團演出',
      '流行音樂之夜',
      '民謠音樂會',
    ],
    [EventType.EXHIBITION]: [
      '學生藝術展',
      '科技創新展',
      '攝影作品展',
      '設計畢業展',
    ],
    [EventType.SEMINAR]: [
      '職涯規劃研討',
      '創業經驗分享',
      '產學合作論壇',
      '學術交流會',
    ],
  }

  const typeNames = names[type]
  return typeNames[Math.floor(Math.random() * typeNames.length)]
}
