<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../services/supabase';

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Stats
const projectCount = ref(0);
const taskCount = ref(0);
const completedTaskCount = ref(0);

onMounted(async () => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }

  await loadUserStats();
});

async function loadUserStats() {
  if (!authStore.user) return;

  try {
    // Contar proyectos
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id);

    if (projectsError) throw projectsError;
    projectCount.value = projectsCount || 0;

    // Contar tareas totales
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id);

    if (tasksError) throw tasksError;
    taskCount.value = tasksCount || 0;

    // Contar tareas completadas
    const { count: completedCount, error: completedError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id)
      .eq('is_completed', true);

    if (completedError) throw completedError;
    completedTaskCount.value = completedCount || 0;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

async function handleLogout() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await authStore.logout();
    if (result.success) {
      router.push('/login');
    } else {
      throw new Error(result.error || 'Error al cerrar sesión');
    }
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error);
    errorMessage.value = error.message || 'Error al cerrar sesión';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="user-account-page min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-amber-600">Mi Cuenta</h1>
        <router-link
          to="/projects"
          class="text-amber-600 hover:text-amber-700 font-medium"
        >
          Mis Proyectos
        </router-link>
      </div>

      <div v-if="authStore.user" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="flex items-center mb-6">
          <div
            class="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl mr-4"
          >
            {{ authStore.user.email.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ authStore.user.email }}</h2>
            <p class="text-gray-500 text-sm">ID: {{ authStore.user.id }}</p>
          </div>
        </div>

        <!-- Estadísticas del usuario -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-amber-600 text-2xl font-bold">{{ projectCount }}</p>
            <p class="text-gray-700">Proyectos</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-amber-600 text-2xl font-bold">{{ taskCount }}</p>
            <p class="text-gray-700">Tareas</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-amber-600 text-2xl font-bold">
              {{ completedTaskCount }}
            </p>
            <p class="text-gray-700">Completadas</p>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-100 p-4 rounded-lg text-red-700 mb-4"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-100 p-4 rounded-lg text-green-700 mb-4"
        >
          {{ successMessage }}
        </div>

        <button
          @click="handleLogout"
          class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Cerrando sesión...</span>
          <span v-else>Cerrar Sesión</span>
        </button>
      </div>

      <div v-else class="bg-white p-8 rounded-lg shadow-md text-center">
        <p class="text-gray-600">No has iniciado sesión.</p>
        <router-link
          to="/login"
          class="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Iniciar Sesión
        </router-link>
      </div>
    </div>
  </div>
</template>
