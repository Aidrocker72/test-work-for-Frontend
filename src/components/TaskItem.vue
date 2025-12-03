<template>
  <v-list-item :key="task.id">
    <template v-slot:prepend>
      <v-checkbox
        :model-value="task.completed"
        @update:model-value="toggleTask"
        density="comfortable"
      />
    </template>

    <v-list-item-title
      :class="{ 'task-item__completed': task.completed }"
      class="font-weight-medium"
    >
      {{ task.title }}
    </v-list-item-title>
    <v-list-item-subtitle>
      Создано: {{ formatDate(task.createdAt) }}
      | Обновлено: {{ formatDate(task.updatedAt) }}
      <span v-if="task.completed">
        | Завершено: {{ formatTaskDate(task.completedAt) }}
      </span>
    </v-list-item-subtitle>

    <template v-slot:append>
      <div v-if="pendingDeletions.has(task.id)" class="task-item__deletion-pending">
        <v-chip color="error" size="small" class="mr-2">
          Удаление через {{ deletionTimers[task.id]?.timeLeft || 10 }}
        </v-chip>
        <v-btn
          @click="cancelDeletion"
          variant="text"
          color="warning"
          size="small"
        >
          Отмена
        </v-btn>
      </div>
      <v-btn
        v-else
        icon
        @click="startDeletion"
        variant="text"
        color="error"
        size="small"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { formatDate, formatTaskDate } from '@/utils/dateUtils'
import { ITaskItemProps } from '@/interfaces/TaskItemProps'
import { ITaskItemEmits } from '@/interfaces/TaskItemEmits'

const props = defineProps<ITaskItemProps>()
const emit = defineEmits<ITaskItemEmits>()

const toggleTask = () => {
  emit('toggle', props.task.id)
}

const startDeletion = () => {
  emit('startDeletion', props.task.id)
}

const cancelDeletion = () => {
  emit('cancelDeletion', props.task.id)
}
</script>

