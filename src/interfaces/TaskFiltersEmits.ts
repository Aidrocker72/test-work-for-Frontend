export interface ITaskFiltersEmits {
  (e: 'update:filter', filter: 'all' | 'active' | 'completed'): void
}
