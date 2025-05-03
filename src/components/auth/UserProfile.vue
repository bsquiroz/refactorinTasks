<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  const result = await authStore.logout();
  if (result.success) {
    router.push('/login');
  }
};
</script>

<template>
  <div class="user-profile p-4 bg-white rounded-lg shadow-md">
    <div v-if="authStore.user" class="flex flex-col items-center">
      <div
        class="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-xl mb-4"
      >
        {{ authStore.user.email.charAt(0).toUpperCase() }}
      </div>

      <h3 class="font-medium text-lg">{{ authStore.user.email }}</h3>

      <button
        @click="handleLogout"
        class="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        :disabled="authStore.loading"
      >
        <span v-if="authStore.loading">Cargando...</span>
        <span v-else>Cerrar Sesión</span>
      </button>
    </div>

    <div v-else class="text-center">
      <p>No has iniciado sesión</p>
      <router-link
        to="/login"
        class="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Iniciar Sesión
      </router-link>
    </div>
  </div>
</template>
