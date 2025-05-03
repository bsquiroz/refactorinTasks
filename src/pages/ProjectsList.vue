<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { projectService } from '../services/projectService';
import type { Project } from '../types/project';

const projects = ref<Project[]>([]);
const newProjectName = ref('');
const newProjectDescription = ref('');
const isLoading = ref(false);
const isCreating = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await loadProjects();
});

async function loadProjects() {
  isLoading.value = true;
  try {
    projects.value = await projectService.getUserProjects();
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    errorMessage.value = 'No se pudieron cargar los proyectos';
  } finally {
    isLoading.value = false;
  }
}

async function createProject() {
  if (!newProjectName.value.trim()) {
    errorMessage.value = 'El nombre del proyecto es obligatorio';
    return;
  }

  isCreating.value = true;
  errorMessage.value = '';

  try {
    if (!authStore.user) {
      throw new Error('No hay usuario autenticado');
    }

    const newProject = await projectService.createProject({
      name: newProjectName.value.trim(),
      description: newProjectDescription.value.trim() || undefined,
      user_id: authStore.user.id
    });

    if (newProject) {
      projects.value = [newProject, ...projects.value];
      newProjectName.value = '';
      newProjectDescription.value = '';
    } else {
      throw new Error('No se pudo crear el proyecto');
    }
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    errorMessage.value = 'No se pudo crear el proyecto';
  } finally {
    isCreating.value = false;
  }
}

function goToProject(projectId: string) {
  router.push(`/projects/${projectId}`);
}
</script>

<template>
  <div class="projects-list-page min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-600">Mis Proyectos</h1>
        <router-link
          to="/account"
          class="text-amber-600 hover:text-amber-700 font-medium"
        >
          Mi Cuenta
        </router-link>
      </div>

      <!-- Formulario para crear nuevo proyecto -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-semibold mb-4">Crear nuevo proyecto</h2>

        <form @submit.prevent="createProject" class="space-y-4">
          <div>
            <label
              for="projectName"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del proyecto*
            </label>
            <input
              v-model="newProjectName"
              id="projectName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Mi nuevo proyecto"
            />
          </div>

          <div>
            <label
              for="projectDescription"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción (opcional)
            </label>
            <textarea
              v-model="newProjectDescription"
              id="projectDescription"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Descripción del proyecto..."
              rows="2"
            ></textarea>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>

          <div>
            <button
              type="submit"
              class="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              :disabled="isCreating"
            >
              <span v-if="isCreating">Creando...</span>
              <span v-else>Crear Proyecto</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de proyectos -->
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-600">Cargando proyectos...</p>
      </div>

      <div
        v-else-if="projects.length === 0"
        class="bg-white p-8 rounded-lg shadow-md text-center"
      >
        <p class="text-gray-600">
          No tienes proyectos todavía. Crea uno nuevo para comenzar.
        </p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2">
        <div
          v-for="project in projects"
          :key="project.id"
          @click="goToProject(project.id)"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 class="text-lg font-semibold mb-2 text-amber-700">
            {{ project.name }}
          </h3>
          <p v-if="project.description" class="text-gray-600 mb-4 text-sm">
            {{ project.description }}
          </p>
          <p class="text-gray-500 text-xs">
            Creado:
            {{ new Date(project.created_at || '').toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
