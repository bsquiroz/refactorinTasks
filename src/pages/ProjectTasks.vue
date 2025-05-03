<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { projectService, taskService } from '../services/projectService';
import type { Project, Task } from '../types/project';

const project = ref<Project | null>(null);
const tasks = ref<Task[]>([]);
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const isLoading = ref(true);
const isCreatingTask = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const projectId = ref<string | null>(null);

// Obtener el ID del proyecto de la ruta
watch(
  () => route.params.id,
  (newId) => {
    if (newId && typeof newId === 'string') {
      projectId.value = newId;
      loadProjectAndTasks();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Si no tenemos un ID de proyecto, redirigir a la lista de proyectos
  if (!projectId.value) {
    router.push('/projects');
  }
});

async function loadProjectAndTasks() {
  if (!projectId.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Cargar detalles del proyecto
    const projectData = await projectService.getProject(projectId.value);
    if (!projectData) {
      throw new Error('No se pudo encontrar el proyecto');
    }
    project.value = projectData;

    // Cargar tareas del proyecto
    tasks.value = await taskService.getProjectTasks(projectId.value);
  } catch (error) {
    console.error('Error al cargar el proyecto o sus tareas:', error);
    errorMessage.value = 'No se pudo cargar la información del proyecto';
  } finally {
    isLoading.value = false;
  }
}

async function createTask() {
  if (!newTaskTitle.value.trim() || !projectId.value || !authStore.user) {
    errorMessage.value = 'El título de la tarea es obligatorio';
    return;
  }

  isCreatingTask.value = true;
  errorMessage.value = '';

  try {
    const newTask = await taskService.createTask({
      title: newTaskTitle.value.trim(),
      description: newTaskDescription.value.trim() || undefined,
      is_completed: false,
      project_id: projectId.value,
      user_id: authStore.user.id
    });

    if (newTask) {
      tasks.value = [newTask, ...tasks.value];
      newTaskTitle.value = '';
      newTaskDescription.value = '';
    } else {
      throw new Error('No se pudo crear la tarea');
    }
  } catch (error) {
    console.error('Error al crear tarea:', error);
    errorMessage.value = 'No se pudo crear la tarea';
  } finally {
    isCreatingTask.value = false;
  }
}

async function toggleTaskCompletion(task: Task) {
  try {
    const updatedTask = await taskService.toggleTaskCompletion(
      task.id,
      !task.is_completed
    );
    if (updatedTask) {
      // Actualizar la tarea en la lista local
      const index = tasks.value.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    }
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
  }
}

async function deleteTask(taskId: string) {
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    try {
      const success = await taskService.deleteTask(taskId);
      if (success) {
        tasks.value = tasks.value.filter((task) => task.id !== taskId);
      } else {
        throw new Error('No se pudo eliminar la tarea');
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      alert('No se pudo eliminar la tarea');
    }
  }
}

function goToProjects() {
  router.push('/projects');
}
</script>

<template>
  <div class="project-tasks-page min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <button
            @click="goToProjects"
            class="text-amber-600 hover:text-amber-700 mb-2 flex items-center"
          >
            <span class="mr-1">←</span> Todos los proyectos
          </button>
          <h1 v-if="project" class="text-3xl font-bold text-amber-600">
            {{ project.name }}
          </h1>
          <p v-if="project && project.description" class="text-gray-600 mt-2">
            {{ project.description }}
          </p>
        </div>
        <router-link
          to="/account"
          class="text-amber-600 hover:text-amber-700 font-medium"
        >
          Mi Cuenta
        </router-link>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-600">Cargando proyecto...</p>
      </div>

      <div
        v-else-if="errorMessage"
        class="bg-red-100 p-4 rounded-lg text-red-700 mb-6"
      >
        {{ errorMessage }}
      </div>

      <div v-else>
        <!-- Formulario para crear nueva tarea -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 class="text-xl font-semibold mb-4">Añadir nueva tarea</h2>

          <form @submit.prevent="createTask" class="space-y-4">
            <div>
              <label
                for="taskTitle"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Título de la tarea*
              </label>
              <input
                v-model="newTaskTitle"
                id="taskTitle"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Qué hay que hacer..."
              />
            </div>

            <div>
              <label
                for="taskDescription"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción (opcional)
              </label>
              <textarea
                v-model="newTaskDescription"
                id="taskDescription"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Detalles de la tarea..."
                rows="2"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                class="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                :disabled="isCreatingTask"
              >
                <span v-if="isCreatingTask">Añadiendo...</span>
                <span v-else>Añadir Tarea</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de tareas -->
        <div
          v-if="tasks.length === 0"
          class="bg-white p-8 rounded-lg shadow-md text-center"
        >
          <p class="text-gray-600">
            No hay tareas en este proyecto. Añade una nueva para comenzar.
          </p>
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold mb-4 text-gray-700">Tareas</h2>

          <div class="space-y-3">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="bg-white p-4 rounded-lg shadow-md flex items-start"
              :class="{ 'opacity-75': task.is_completed }"
            >
              <input
                type="checkbox"
                :checked="task.is_completed"
                @change="toggleTaskCompletion(task)"
                class="mr-3 mt-1 h-5 w-5 text-amber-500 rounded"
              />

              <div class="flex-grow">
                <h3
                  class="text-lg font-medium"
                  :class="{ 'line-through text-gray-500': task.is_completed }"
                >
                  {{ task.title }}
                </h3>
                <p
                  v-if="task.description"
                  class="text-gray-600 text-sm mt-1"
                  :class="{ 'line-through text-gray-400': task.is_completed }"
                >
                  {{ task.description }}
                </p>
              </div>

              <button
                @click="deleteTask(task.id)"
                class="ml-2 text-red-500 hover:text-red-700"
                title="Eliminar tarea"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
