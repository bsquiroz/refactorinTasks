<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Por favor, completa todos los campos';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  const result = await authStore.register({
    email: email.value,
    password: password.value
  });

  isLoading.value = false;

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.error || 'Error al registrarse';
  }
};
</script>

<template>
  <div
    class="register-form w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="email"
          id="email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Contraseña</label
        >
        <input
          v-model="password"
          id="password"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Confirmar Contraseña</label
        >
        <input
          v-model="confirmPassword"
          id="confirmPassword"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="••••••••"
        />
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div>
        <button
          type="submit"
          class="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Registrarse</span>
        </button>
      </div>

      <div class="text-center text-sm mt-4">
        <p>
          ¿Ya tienes cuenta?
          <router-link to="/login" class="text-amber-600 hover:text-amber-700">
            Iniciar Sesión
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>
