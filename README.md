# Aplicación de Gestión de Proyectos y Tareas

Una aplicación moderna para gestionar proyectos y tareas con autenticación de usuarios, construida con Vue 3, TypeScript, Tailwind CSS y Supabase.

![Vista previa de la aplicación](https://via.placeholder.com/800x400?text=Vista+Previa+de+la+Aplicación)

## Características

- 👤 **Autenticación completa**: Registro, inicio de sesión y cierre de sesión de usuarios
- 📊 **Gestión de proyectos**: Crear y listar proyectos personales
- ✅ **Gestión de tareas**: Añadir, completar y eliminar tareas en cada proyecto
- 📱 **Diseño responsive**: Funciona en dispositivos móviles y de escritorio
- 🎨 **Interfaz moderna**: UI atractiva con Tailwind CSS

## Tecnologías utilizadas

- [Vue 3](https://vuejs.org/): Framework JavaScript progresivo
- [TypeScript](https://www.typescriptlang.org/): Superconjunto de JavaScript con tipado estático
- [Tailwind CSS](https://tailwindcss.com/): Framework CSS utilitario
- [Supabase](https://supabase.com/): Alternativa de código abierto a Firebase
- [Vue Router](https://router.vuejs.org/): Enrutador oficial para Vue.js
- [Pinia](https://pinia.vuejs.org/): Biblioteca de gestión de estado para Vue

## Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta en Supabase

## Configuración del proyecto

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repositorio>
cd adminProjects
npm install
```

### 2. Configuración de Supabase

1. Crear una cuenta en [Supabase](https://supabase.com/) si aún no tienes una
2. Crear un nuevo proyecto
3. En el editor SQL de Supabase, ejecuta los siguientes scripts para crear las tablas necesarias:

```sql
-- Crear tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de tareas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear políticas de seguridad (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para proyectos
CREATE POLICY "Usuarios pueden ver sus propios proyectos" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propios proyectos" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios proyectos" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios proyectos" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tareas
CREATE POLICY "Usuarios pueden ver sus propias tareas" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias tareas" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias tareas" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias tareas" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

4. Opcional: Para facilitar el desarrollo, puedes desactivar la verificación de email en "Authentication" > "Providers" > "Email" > Desactivar "Enable email confirmations".

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Reemplaza los valores con tus credenciales de Supabase, que puedes encontrar en:

- Panel de Supabase > Configuración del proyecto > API > URL y anon key

### 4. Iniciar la aplicación en modo desarrollo

```bash
npm run dev
```

### 5. Compilar para producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── components/       # Componentes Vue reutilizables
│   └── auth/         # Componentes de autenticación
├── pages/            # Páginas principales
│   └── auth/         # Páginas de autenticación
├── router/           # Configuración de rutas
├── services/         # Servicios para conectar con Supabase
├── stores/           # Stores de Pinia
└── types/            # Definiciones de tipos TypeScript
```

## Flujo de la aplicación

1. **Autenticación**: Los usuarios pueden registrarse o iniciar sesión
2. **Página de proyectos**: Muestra todos los proyectos del usuario y permite crear nuevos
3. **Página de tareas**: Al hacer clic en un proyecto, muestra todas sus tareas
4. **Perfil de usuario**: Muestra información del usuario y estadísticas

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por Stiven y cursor
