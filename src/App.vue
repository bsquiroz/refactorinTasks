<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

// Inicializar el store de autenticación al cargar la aplicación
const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>
