import { ITaskHistoryItem } from '@/interfaces/TaskHistoryItem'

export interface ITaskHistoryProps {
  showHistory: boolean
  historyItems: ITaskHistoryItem[]
}
