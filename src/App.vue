<template>
  <v-app>
    <v-app-bar color="white" density="compact">
      <object
        class="task-app__logo ml-12 mr-4"
        data="https://storage.yandexcloud.net/forlogo/logo.svg"
      />
      <v-app-bar-title>Управление задачами</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h1 class="task-app__main-title">Мои задачи</h1>

                  <TaskFilters
                    :current-filter="currentFilter"
                    :task-count="tasks.length"
                    :active-count="tasks.filter(t => !t.completed).length"
                    :completed-count="tasks.filter(t => t.completed).length"
                    @update:filter="updateFilter"
                  />

                  <AddTaskForm @add-task="addTask" />

                  <v-list lines="two" class="elevation-1 rounded">
                    <TaskItem
                      v-for="task in filteredTasks"
                      :key="task.id"
                      :task="task"
                      :pending-deletions="pendingDeletions"
                      :deletion-timers="deletionTimers"
                      @toggle="toggleTask"
                      @start-deletion="startDeletion"
                      @cancel-deletion="cancelDeletion"
                    />
                  </v-list>

                  <TaskStats
                    :task-count="tasks.length"
                    :active-count="tasks.filter(t => !t.completed).length"
                    :completed-count="tasks.filter(t => t.completed).length"
                    :completion-percentage="(tasks.filter(t => t.completed).length / tasks.length * 100).toFixed(1)"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <TaskHistory
      :show-history="showHistory"
      :history-items="taskHistory"
      @update:show="showHistory = $event"
    />

    <v-btn
      color="primary"
      icon
      size="large"
      class="task-app__history-btn"
      @click="showHistory = true"
    >
      <v-icon>mdi-history</v-icon>
    </v-btn>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskItem from '@/components/TaskItem.vue'
import TaskFilters from '@/components/TaskFilters.vue'
import AddTaskForm from '@/components/AddTaskForm.vue'
import TaskStats from '@/components/TaskStats.vue'
import TaskHistory from '@/components/TaskHistory.vue'
import { IDeletionTimer } from '@/interfaces/DeletionTimer'
import { ITaskHistoryItem } from '@/interfaces/TaskHistoryItem'
import { TASKS } from '@/constants/tasks'

const taskHistory = ref<ITaskHistoryItem[]>([])
const tasks = ref<any[]>([])
const currentFilter = ref<'all' | 'active' | 'completed'>('all')
const pendingDeletions = ref<Set<number>>(new Set())
const deletionTimers = ref<Record<number, IDeletionTimer>>({})
const showHistory = ref(false)

const filteredTasks = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return tasks.value.filter(t => !t.completed)
    case 'completed':
      return tasks.value.filter(t => t.completed)
    default:
      return tasks.value
  }
})

const loadTasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  tasks.value = TASKS;

  saveTasksDebounced()
}

const updateFilter = (filter: 'all' | 'active' | 'completed') => {
  currentFilter.value = filter
}

const addTask = (title: string) => {
  const newTask: any = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null
 }

  tasks.value.push(newTask)

  taskHistory.value.unshift({
    id: Date.now(),
    taskId: newTask.id,
    taskTitle: newTask.title.substring(0, 20) + (newTask.title.length > 20 ? '...' : ''),
    action: 'created',
    timestamp: new Date()
  })

  saveTasksDebounced()
}

const toggleTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
    task.updatedAt = new Date()
    task.completedAt = task.completed ? new Date() : null

    const action = task.completed ? 'completed' : 'updated'
    taskHistory.value.unshift({
      id: Date.now(),
      taskId: task.id,
      taskTitle: task.title.substring(0, 20) + (task.title.length > 20 ? '...' : ''),
      action: action,
      timestamp: new Date()
    })
  }

  saveTasksDebounced()
}

const startDeletion = (id: number) => {
  pendingDeletions.value.add(id)

  const timerId = window.setInterval(() => {
    if (deletionTimers.value[id]) {
      deletionTimers.value[id].timeLeft--

      if (deletionTimers.value[id].timeLeft <= 0) {
        const deletedTask = tasks.value.find(t => t.id === id)
        tasks.value = tasks.value.filter(t => t.id !== id)
        pendingDeletions.value.delete(id)

        if (deletedTask) {
          taskHistory.value.unshift({
            id: Date.now(),
            taskId: deletedTask.id,
            taskTitle: deletedTask.title.substring(0, 20) + (deletedTask.title.length > 20 ? '...' : ''),
            action: 'deleted',
            timestamp: new Date()
          })
        }

        const timer = deletionTimers.value[id]
        if (timer) {
          clearInterval(timer.timerId)
          delete deletionTimers.value[id]
        }
      }
    }
  }, 1000)

  deletionTimers.value[id] = {
    timerId,
    timeLeft: 10
  }

  saveTasksDebounced()
}

const cancelDeletion = (id: number) => {
  pendingDeletions.value.delete(id)

  const timer = deletionTimers.value[id]
  if (timer) {
    clearInterval(timer.timerId)
    delete deletionTimers.value[id]
  }

  saveTasksDebounced()
}

const saveTasksToStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
  localStorage.setItem('taskHistory', JSON.stringify(taskHistory.value))
}

const loadTasksFromStorage = () => {
  const savedTasks = localStorage.getItem('tasks')
  const savedHistory = localStorage.getItem('taskHistory')

  if (savedTasks) {
    try {
      tasks.value = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : null
      }))
    } catch (e) {
      console.error('Error loading tasks from storage:', e)
    }
 }

  if (savedHistory) {
    try {
      taskHistory.value = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
    } catch (e) {
      console.error('Error loading task history from storage:', e)
    }
  }
}

onMounted(() => {
  loadTasksFromStorage()
   if (tasks.value.length === 0) {
     loadTasks()
   }
})

window.addEventListener('beforeunload', saveTasksToStorage)

const saveTasksDebounced = () => {
 setTimeout(() => {
    saveTasksToStorage()
  }, 0)
}
</script>

