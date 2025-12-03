<template>
  <div class="task-filters">
    <v-btn
      @click="updateFilter('all')"
      :class="{ 'task-filters__button--active': currentFilter === 'all' }"
      variant="tonal"
      class="task-filters__button mr-2"
    >
      Все ({{ taskCount }})
    </v-btn>
    <v-btn
      @click="updateFilter('active')"
      :class="{ 'task-filters__button--active': currentFilter === 'active' }"
      variant="tonal"
      class="task-filters__button mr-2"
    >
      Активные ({{ activeCount }})
    </v-btn>
    <v-btn
      @click="updateFilter('completed')"
      :class="{ 'task-filters__button--active': currentFilter === 'completed' }"
      variant="tonal"
      class="task-filters__button mr-2"
    >
      Завершенные ({{ completedCount }})
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ITaskFiltersProps } from '@/interfaces/TaskFiltersProps'
import { ITaskFiltersEmits } from '@/interfaces/TaskFiltersEmits'

const props = defineProps<ITaskFiltersProps>()
const emit = defineEmits<ITaskFiltersEmits>()

const updateFilter = (filter: 'all' | 'active' | 'completed') => {
 emit('update:filter', filter)
}
</script>
