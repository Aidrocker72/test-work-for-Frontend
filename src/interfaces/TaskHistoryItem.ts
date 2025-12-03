export interface ITaskHistoryItem {
  id: number
  taskId: number
  taskTitle: string
  action: 'created' | 'updated' | 'completed' | 'deleted'
  timestamp: Date
}
