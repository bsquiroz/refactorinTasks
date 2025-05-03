import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import type { User, UserCredentials } from '../types/user';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Verificar si hay una sesión activa
  const initialize = async () => {
    loading.value = true;
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          user.value = {
            id: userData.user.id,
            email: userData.user.email || ''
          };
        }
      }
    } catch (err) {
      console.error('Error al inicializar la sesión:', err);
      error.value = 'Error al inicializar la sesión';
    } finally {
      loading.value = false;
    }
  };

  // Login con correo y contraseña
  const login = async (credentials: UserCredentials) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: credentials.email,
          password: credentials.password
        }
      );

      if (authError) throw authError;

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || ''
        };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      error.value = err.message || 'Error al iniciar sesión';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Registro con correo y contraseña
  const register = async (credentials: UserCredentials) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          // Esta opción establece a dónde redirigir después de hacer clic en el enlace de confirmación
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) throw authError;

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || ''
        };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error al registrarse:', err);
      error.value = err.message || 'Error al registrarse';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    loading.value = true;
    error.value = null;
    try {
      await supabase.auth.signOut();
      user.value = null;
      return { success: true };
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
      error.value = err.message || 'Error al cerrar sesión';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    initialize,
    login,
    register,
    logout
  };
});
