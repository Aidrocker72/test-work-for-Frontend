import { ITask } from '@/interfaces/Task'
import { IDeletionTimer } from '@/interfaces/DeletionTimer'

export interface ITaskItemProps {
  task: ITask
  pendingDeletions: Set<number>
  deletionTimers: Record<number, IDeletionTimer>
}
