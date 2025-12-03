<template>
  <v-form @submit.prevent="submitTask" class="mb-6">
    <v-text-field
      v-model="taskTitle"
      label="Новая задача"
      :rules="[value => !!value || 'Введите текст задачи']"
      variant="outlined"
      density="comfortable"
    />
    <v-btn type="submit" color="primary" class="mt-2">Добавить</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IAddTaskFormEmits } from '@/interfaces/AddTaskFormEmits'

const emit = defineEmits<IAddTaskFormEmits>()
const taskTitle = ref('')

const submitTask = () => {
  if (taskTitle.value.trim()) {
    emit('add-task', taskTitle.value)
    taskTitle.value = ''
  }
}
</script>
