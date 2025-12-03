<template>
  <v-navigation-drawer
    location="right"
    width="400"
    :model-value="showHistory"
    @update:model-value="(value) => emit('update:show', value)"
  >
    <v-toolbar class="task-history__toolbar" density="compact">
      <v-toolbar-title>История изменений</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="emit('update:show', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list density="compact">
      <v-list-item
        v-for="item in historyItems"
        :key="item.id"
        :title="getActionText(item.action)"
        :subtitle="`${item.taskTitle} | ${formatDate(item.timestamp)}`"
        :prepend-icon="getActionIcon(item.action)"
        :color="getActionColor(item.action)"
      >
        <template v-slot:append>
          <v-chip size="x-small" :color="getActionColor(item.action)">
            {{ getActionText(item.action) }}
          </v-chip>
        </template>
      </v-list-item>
      <v-list-item v-if="historyItems.length === 0">
        <v-list-item-title>История изменений пуста</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/dateUtils'
import { ITaskHistoryProps } from '@/interfaces/TaskHistoryProps'
import { ITaskHistoryEmits } from '@/interfaces/TaskHistoryEmits'

const props = defineProps<ITaskHistoryProps>()
const emit = defineEmits<ITaskHistoryEmits>()

const getActionText = (action: string) => {
  switch (action) {
    case 'created': return 'Создано'
    case 'updated': return 'Обновлено'
    case 'completed': return 'Завершено'
    case 'deleted': return 'Удалено'
    default: return action
  }
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'created': return 'mdi-plus-circle'
    case 'updated': return 'mdi-update'
    case 'completed': return 'mdi-check-circle'
    case 'deleted': return 'mdi-delete'
    default: return 'mdi-help-circle'
 }
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'created': return 'info'
    case 'updated': return 'warning'
    case 'completed': return 'success'
    case 'deleted': return 'error'
    default: return 'default'
  }
}
</script>
