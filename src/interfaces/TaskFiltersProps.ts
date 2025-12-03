export interface ITaskFiltersProps {
  currentFilter: 'all' | 'active' | 'completed'
  taskCount: number
  activeCount: number
  completedCount: number
}
