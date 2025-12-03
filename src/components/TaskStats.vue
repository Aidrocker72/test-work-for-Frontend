<template>
  <v-card class="task-stats">
    <v-card-text>
      <p>Всего задач: {{ taskCount }}</p>
      <p>Активных: {{ activeCount }}</p>
      <p>Завершенных: {{ completedCount }}</p>
      <p>Процент завершения: {{ completionPercentage }}%</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ITaskStatsProps } from '@/interfaces/TaskStatsProps'

defineProps<ITaskStatsProps>()
</script>

