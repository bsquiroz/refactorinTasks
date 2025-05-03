import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../services/supabase';
import ProjectsList from '../pages/ProjectsList.vue';
import ProjectTasks from '../pages/ProjectTasks.vue';
import UserAccount from '../pages/UserAccount.vue';
import LoginPage from '../pages/auth/LoginPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/projects',
    component: ProjectsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    component: ProjectTasks,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    component: UserAccount,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { guest: true }
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: { guest: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protección de rutas
router.beforeEach(async (to, _, next) => {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guest);

  if (requiresAuth && !isLoggedIn) {
    // Si requiere autenticación y no está autenticado, redirigir a login
    next('/login');
  } else if (guestOnly && isLoggedIn) {
    // Si es solo para invitados y está autenticado, redirigir al inicio
    next('/projects');
  } else {
    // En cualquier otro caso, continuar normalmente
    next();
  }
});

export default router;
