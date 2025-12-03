export interface ITaskItemEmits {
  (e: 'toggle', id: number): void
  (e: 'startDeletion', id: number): void
  (e: 'cancelDeletion', id: number): void
}
