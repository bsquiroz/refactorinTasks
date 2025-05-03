<script setup lang="ts">
import UserProfile from '../components/auth/UserProfile.vue';
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>

<template>
  <div class="home-page min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center text-amber-600">
        Mi Aplicación
      </h1>

      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-semibold mb-4">Bienvenido</h2>
        <p class="mb-2">
          Esta es una aplicación de ejemplo con autenticación usando Supabase.
        </p>
        <p v-if="authStore.user">
          Has iniciado sesión como <strong>{{ authStore.user.email }}</strong
          >.
        </p>
        <p v-else>
          No has iniciado sesión. Por favor,
          <router-link to="/login" class="text-amber-600 hover:text-amber-700"
            >inicia sesión</router-link
          >
          o
          <router-link
            to="/register"
            class="text-amber-600 hover:text-amber-700"
            >regístrate</router-link
          >.
        </p>
      </div>

      <UserProfile />
    </div>
  </div>
</template>
