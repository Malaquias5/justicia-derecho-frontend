# 📚 GUÍA COMPLETA - Arquitectura del Sistema Judicial

## 🏗️ ESTRUCTURA GENERAL DEL PROYECTO

```
src/
├── app/                      # Aplicación Angular principal
│   ├── components/          # Componentes de interfaz (vistas)
│   ├── core/                # Lógica central del negocio
│   ├── environments/        # Configuración de entornos
│   ├── app.ts              # Componente raíz
│   ├── app.config.ts       # Configuración de la app
│   └── app.routes.ts       # Rutas y navegación
├── index.html              # Página HTML principal
├── main.ts                 # Punto de entrada Angular
└── styles.scss             # Estilos globales
```

---

## 📁 CARPETA: `src/app/components/`

Contiene TODOS los componentes visuales (pantallas) organizados por rol.

### 🔐 **1. components/auth/** (Autenticación)

#### `auth/login/`
**Funcionalidad:** Pantalla de inicio de sesión

**Archivos:**
- `login.component.ts` - Lógica del login
- `login.component.html` - Formulario de login
- `login.component.scss` - Estilos del login

**¿Cómo funciona?**
```typescript
// Proceso:
1. Usuario ingresa: usuario + contraseña
2. Llama a authService.login(credentials)
3. Si es correcto → Guarda token en localStorage
4. Detecta el rol del usuario (Admin/Abogado/Usuario)
5. Redirige a su dashboard correspondiente
```

**Validaciones:**
- Campos obligatorios
- Manejo de errores (cuenta inactiva, credenciales incorrectas)
- Loading spinner mientras carga

#### `auth/register/`
**Funcionalidad:** Registro de nuevos usuarios (opcional)

---

### 👨‍💼 **2. components/admin/** (Administrador)

#### `admin/dashboard/`
**Funcionalidad:** Panel principal del administrador

**Características:**
- Estadísticas generales del sistema
- Gráfico de distribución de casos (Chart.js)
- Tabla de casos próximos a vencer
- Actividades recientes
- Botones de acción rápida

**Cómo funciona:**
```typescript
ngOnInit() {
  this.cargarEstadisticas();     // Obtiene números totales
  this.cargarCasosUrgentes();    // Casos próximos a vencer
  this.inicializarGrafico();     // Chart.js doughnut chart
}
```

#### `admin/usuarios/usuarios-list`
**Funcionalidad:** Gestión completa de usuarios

**Características:**
- ✅ Listar todos los usuarios (Admin, Abogado, Usuario)
- ✅ Crear nuevo usuario (modal Bootstrap)
- ✅ Activar/desactivar cuentas
- ✅ Búsqueda en tiempo real
- ✅ Paginación (10 usuarios por página)
- ✅ Editar información de usuarios

**Cómo funciona:**
```typescript
// Cargar usuarios
cargarUsuarios() {
  this.usuariosService.listarUsuarios().subscribe({
    next: (response) => {
      this.usuarios = response.data;
      this.actualizarPaginacion();
    }
  });
}

// Filtrar
filtrarUsuarios() {
  this.usuariosFiltrados = this.usuarios.filter(u => 
    u.nombreCompleto.includes(this.searchTerm)
  );
}

// Paginación
get usuariosPaginados() {
  const inicio = (currentPage - 1) * itemsPerPage;
  return this.usuariosFiltrados.slice(inicio, inicio + 10);
}
```

#### `admin/estadisticas/`
**Funcionalidad:** Estadísticas detalladas por abogado

**Muestra:**
- Total de casos por abogado
- Casos pendientes/en proceso/finalizados
- Porcentaje de eficiencia
- Gráfico de barras comparativo

**Cómo funciona:**
```typescript
cargarEstadisticas() {
  this.estadisticasService.obtenerEstadisticas().subscribe({
    next: (response) => {
      this.estadisticas = response.data;
      this.actualizarChart(); // Genera gráfico Chart.js
    }
  });
}

getEficiencia(abogado) {
  return (abogado.finalizados / abogado.totales) * 100;
}
```

#### `admin/historial/` ⭐ NUEVO
**Funcionalidad:** Registro de todas las acciones del sistema

**Características:**
- ✅ Timeline de eventos (crear, editar, eliminar, login, logout)
- ✅ Filtros por: acción, entidad, usuario, fecha
- ✅ Estadísticas: cambios hoy, semana, usuarios activos
- ✅ Badges de colores por tipo de acción
- ✅ Paginación (15 registros por página)
- ✅ Exportar (preparado)

**Datos que registra:**
```typescript
interface Cambio {
  id: number;
  fecha: Date;
  usuario: string;           // Quién hizo el cambio
  rol: string;              // Admin/Abogado/Usuario
  accion: string;           // Crear/Editar/Eliminar/Login
  entidad: string;          // Usuario/Caso/Documento
  detalle: string;          // Descripción del cambio
  ip?: string;              // Dirección IP
}
```

---

### ⚖️ **3. components/abogado/** (Abogado)

#### `abogado/dashboard/`
**Funcionalidad:** Panel de control del abogado

**Muestra:**
- Total de casos del abogado
- Casos por estado (pendientes, en proceso, finalizados)
- Tabla de casos próximos a vencer
- Accesos rápidos (nuevo caso, documentos, calendario)

**Filtrado automático:**
```typescript
// Solo carga casos donde el abogado logueado es el asignado
cargarCasos() {
  this.casosService.listarCasos().subscribe({
    next: (response) => {
      // Filtra solo los casos del abogado actual
      this.casos = response.data.filter(c => 
        c.abogado === this.usuario.nombreCompleto
      );
    }
  });
}
```

#### `abogado/casos/list/`
**Funcionalidad:** Lista completa de casos del abogado

**Características:**
- ✅ Tabla con todos los casos asignados
- ✅ Búsqueda por número de caso, cliente, tipo
- ✅ Filtros: estado, fecha desde/hasta
- ✅ Acciones: ver, editar, eliminar
- ✅ Paginación (10 casos por página)
- ✅ Estadísticas en tarjetas

**Cómo funciona:**
```typescript
buscarCasos() {
  const criterios = {
    numeroCaso: this.filtros.numeroCaso,
    estado: this.filtros.estado,
    fechaDesde: this.filtros.fechaDesde,
    fechaHasta: this.filtros.fechaHasta
  };
  
  this.casosService.buscarCasos(criterios).subscribe({
    next: (response) => {
      this.casos = response.data;
      this.actualizarPaginacion();
    }
  });
}
```

#### `abogado/casos/create/`
**Funcionalidad:** Crear nuevo caso judicial

**Formulario incluye:**
- Número de caso
- Tipo de caso (Civil, Penal, Laboral, etc.)
- Dependencia (juzgado)
- Patrocinado (cliente)
- Abogado
- Fecha de ingreso
- Fecha de vencimiento
- Estado inicial
- Observaciones

**Validaciones:**
```typescript
onSubmit() {
  // 1. Validar campos obligatorios
  if (!this.casoForm.valid) {
    this.toastr.error('Complete todos los campos');
    return;
  }
  
  // 2. Formatear fechas correctamente
  const caso = {
    ...this.casoForm.value,
    fechaIngreso: this.formatDate(this.casoForm.value.fechaIngreso),
    fechaVencimiento: this.formatDate(this.casoForm.value.fechaVencimiento)
  };
  
  // 3. Enviar al backend
  this.casosService.crearCaso(caso).subscribe({
    next: () => {
      this.toastr.success('Caso creado exitosamente');
      this.router.navigate(['/abogado/casos']);
    },
    error: (err) => {
      this.toastr.error('Error al crear caso');
    }
  });
}
```

#### `abogado/casos/edit/`
**Funcionalidad:** Editar caso existente

**Proceso:**
```typescript
ngOnInit() {
  // 1. Obtener ID del caso desde la URL
  const id = this.route.snapshot.params['id'];
  
  // 2. Cargar datos del caso
  this.casosService.obtenerCaso(id).subscribe({
    next: (caso) => {
      // 3. Llenar el formulario con los datos
      this.casoForm.patchValue({
        numeroCaso: caso.numeroCaso,
        tipoCaso: caso.tipoCaso,
        // ... resto de campos
      });
    }
  });
}

onSubmit() {
  // Actualizar el caso
  this.casosService.actualizarCaso(id, datos).subscribe(...);
}
```

#### `abogado/casos/detail/`
**Funcionalidad:** Ver detalles completos de un caso

**Muestra:**
- Toda la información del caso
- Estado actual con badge de color
- Timeline de seguimientos
- Documentos adjuntos
- Botones: editar, eliminar, volver

#### `abogado/documentos/`
**Funcionalidad:** Gestión de documentos

**Características:**
- ✅ Estadísticas (total docs, subidos hoy, espacio usado)
- ✅ Modal para subir documentos
- ✅ Formulario: título, tipo, caso relacionado, archivo, descripción
- ✅ Validación de tamaño (max 10MB)
- ✅ Tipos: PDF, Word, Imágenes

**Cómo funciona el modal:**
```typescript
abrirModalSubir() {
  this.mostrarModal = true;
  document.body.classList.add('modal-open'); // Bloquea scroll
}

onFileSelected(event) {
  const file = event.target.files[0];
  
  // Validar tamaño
  if (file.size > 10 * 1024 * 1024) {
    alert('Archivo muy grande (max 10MB)');
    return;
  }
  
  this.archivoSeleccionado = file;
}

subirDocumento() {
  // En producción: enviar FormData con el archivo al backend
  const formData = new FormData();
  formData.append('archivo', this.archivoSeleccionado);
  formData.append('titulo', this.nuevoDocumento.titulo);
  // ... resto de campos
  
  // this.documentosService.subir(formData).subscribe(...);
}
```

#### `abogado/seguimientos/` ⭐ NUEVO
**Funcionalidad:** Registro y consulta de seguimientos de casos

**Características:**
- ✅ Timeline visual de seguimientos
- ✅ Formulario para nuevo seguimiento
- ✅ Tipos: Audiencia, Presentación, Resolución, Notificación, Diligencia
- ✅ Adjuntar documentos al seguimiento
- ✅ Filtros: caso, tipo, fecha
- ✅ Estadísticas: total, hoy, casos activos
- ✅ Paginación (10 seguimientos por página)

**Estructura de seguimiento:**
```typescript
interface Seguimiento {
  id: number;
  idCaso: number;
  numeroCaso: string;
  fecha: Date;
  usuario: string;          // Abogado que registró
  tipo: string;            // Tipo de seguimiento
  descripcion: string;     // Detalle de lo realizado
  documentos?: number;     // Cantidad de docs adjuntos
}
```

**Cómo funciona:**
```typescript
guardarSeguimiento() {
  const seguimiento = {
    numeroCaso: this.nuevoSeguimiento.numeroCaso,
    tipo: this.nuevoSeguimiento.tipo,
    descripcion: this.nuevoSeguimiento.descripcion,
    fecha: new Date(),
    usuario: this.authService.getUser().nombreCompleto
  };
  
  // Enviar al backend
  this.seguimientosService.crear(seguimiento).subscribe({
    next: () => {
      this.toastr.success('Seguimiento registrado');
      this.cargarSeguimientos(); // Recargar lista
      this.cancelarFormulario();
    }
  });
}
```

#### `abogado/calendario/`
**Funcionalidad:** Vista de calendario con fechas importantes

**Estado:** Placeholder (en desarrollo)
- Audiencias programadas
- Vencimientos próximos
- Diligencias pendientes

---

### 👤 **4. components/usuario/** (Cliente)

#### `usuario/mis-casos/`
**Funcionalidad:** Ver casos donde el usuario es el patrocinado (cliente)

**Características:**
- ✅ Tarjetas visuales con colores por urgencia
- ✅ Estadísticas personales (total, pendientes, en proceso, finalizados)
- ✅ Filtro de búsqueda
- ✅ Paginación (6 casos por página)
- ✅ Botón "Ver Detalles" en cada caso

**Filtrado automático:**
```typescript
cargarMisCasos() {
  const usuario = this.authService.getUser();
  
  this.casosService.listarCasos().subscribe({
    next: (response) => {
      // Solo muestra casos donde el usuario actual es el patrocinado
      if (usuario.rol === 'Usuario') {
        this.casos = response.data.filter(c => 
          c.patrocinado.includes(usuario.nombreCompleto)
        );
      }
      
      this.calcularEstadisticas();
      this.actualizarPaginacion();
    }
  });
}
```

**Cálculo de urgencia:**
```typescript
calcularUrgencia(fechaVencimiento) {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diasRestantes = Math.floor(
    (vencimiento - hoy) / (1000 * 60 * 60 * 24)
  );
  
  if (diasRestantes < 0) return 'Vencido';
  if (diasRestantes <= 3) return 'Urgente';
  if (diasRestantes <= 7) return 'Próximo';
  return 'Normal';
}
```

#### `usuario/seguimiento/`
**Funcionalidad:** Ver timeline de actualizaciones de casos

**Muestra:**
- Ejemplo visual de timeline
- Instrucciones para ver seguimiento real
- Guía: ir a "Mis Casos" → "Ver Detalles" → Ver timeline

#### `usuario/configuracion/`
**Funcionalidad:** Ver información de la cuenta (solo lectura)

**Muestra:**
- Nombre completo
- Usuario
- Email
- Rol (badge)
- Estado de cuenta (Activa/Inactiva)
- Fecha de registro

**Nota:** El usuario NO puede editar, solo consultar

#### `usuario/ayuda/`
**Funcionalidad:** Centro de ayuda y contacto

**Incluye:**
- Tarjetas: Guía de usuario, Tutoriales, FAQs, Contacto
- Información de contacto (email, teléfono, horario)
- Consejos rápidos

---

### 🔄 **5. components/shared/** (Compartidos)

#### `shared/navbar/`
**Funcionalidad:** Barra superior de navegación

**Muestra:**
- Logo del sistema
- Nombre del usuario logueado
- Rol del usuario
- Botón de logout
- Responsive (hamburger menu en móvil)

**Cómo funciona:**
```typescript
ngOnInit() {
  // Obtener usuario del servicio de autenticación
  this.user = this.authService.getUser();
  this.userRole = this.authService.getUserRole();
}

logout() {
  // Cerrar sesión
  this.authService.logout();
  this.router.navigate(['/auth/login']);
}
```

#### `shared/sidebar/`
**Funcionalidad:** Menú lateral de navegación

**Características:**
- ✅ Menú diferente por rol
- ✅ Items con iconos (PrimeIcons)
- ✅ Badges (notificaciones)
- ✅ Active state (resalta ruta actual)
- ✅ Responsive (colapsable en móvil)

**Filtrado por rol:**
```typescript
loadMenuItems() {
  this.menuItems = [
    // Admin
    { label: 'Panel', icon: 'pi pi-home', 
      route: '/admin/dashboard', roles: ['Admin'] },
    { label: 'Usuarios', icon: 'pi pi-users', 
      route: '/admin/usuarios', roles: ['Admin'] },
    
    // Abogado
    { label: 'Mis Casos', icon: 'pi pi-briefcase', 
      route: '/abogado/casos', roles: ['Abogado'] },
    
    // Usuario
    { label: 'Mis Casos', icon: 'pi pi-folder', 
      route: '/usuario/mis-casos', roles: ['Usuario'] }
  ];
}

filterMenuByRole() {
  const userRole = this.authService.getUserRole();
  this.filteredMenuItems = this.menuItems.filter(item =>
    item.roles.includes(userRole)
  );
}
```

#### `shared/footer/`
**Funcionalidad:** Pie de página

**Muestra:**
- Copyright
- Versión del sistema
- Enlaces legales

#### `shared/loading/`
**Funcionalidad:** Spinner de carga global

**Se muestra cuando:**
- Se hace petición HTTP
- Se cambia de ruta
- Se procesa información

#### `shared/confirm-dialog/`
**Funcionalidad:** Modal de confirmación

**Uso:**
```typescript
// Antes de eliminar algo
if (confirm('¿Está seguro de eliminar este caso?')) {
  this.casosService.eliminarCaso(id).subscribe(...);
}
```

---

## 📁 CARPETA: `src/app/core/`

Contiene la lógica de negocio central.

### 🔐 **core/guards/** (Guardias de Ruta)

#### `auth.guard.ts`
**Funcionalidad:** Proteger rutas que requieren autenticación

**¿Cómo funciona?**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verifica si hay token válido
  if (authService.isAuthenticated()) {
    return true; // Permite acceso
  } else {
    router.navigate(['/auth/login']); // Redirige a login
    return false; // Bloquea acceso
  }
};
```

**Se usa en:**
```typescript
// app.routes.ts
{
  path: 'admin',
  canActivate: [authGuard], // ← Requiere login
  children: [...]
}
```

#### `role.guard.ts`
**Funcionalidad:** Verificar que el usuario tenga el rol adecuado

**¿Cómo funciona?**
```typescript
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as string[];
  
  // Verifica si el rol del usuario está en los permitidos
  if (allowedRoles.includes(userRole)) {
    return true; // Permite acceso
  } else {
    router.navigate(['/']); // Redirige a inicio
    return false; // Bloquea acceso
  }
};
```

**Se usa en:**
```typescript
// app.routes.ts
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['Admin'] }, // Solo Admin puede acceder
  children: [...]
}
```

---

### 🔌 **core/interceptors/** (Interceptores HTTP)

#### `auth.interceptor.ts`
**Funcionalidad:** Agregar token JWT a todas las peticiones HTTP

**¿Cómo funciona?**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Si hay token, lo agrega al header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req); // Continúa con la petición
};
```

**Flujo:**
```
1. Frontend hace petición: GET /api/casos
2. Interceptor agrega: Authorization: Bearer eyJhbGc...
3. Backend valida el token
4. Backend responde con los datos
```

#### `error.interceptor.ts`
**Funcionalidad:** Manejo centralizado de errores HTTP

**Captura:**
- ❌ 401 Unauthorized → Redirige a login
- ❌ 403 Forbidden → Muestra "Sin permisos"
- ❌ 404 Not Found → Muestra "No encontrado"
- ❌ 500 Server Error → Muestra "Error del servidor"
- ❌ DisabledException → Muestra "Cuenta inactiva"

**¿Cómo funciona?**
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Error 401 - No autenticado
      if (error.status === 401) {
        toastr.error('Sesión expirada', 'Error');
        router.navigate(['/auth/login']);
      }
      
      // Cuenta inactiva
      if (error.error?.message?.includes('inactiva')) {
        toastr.error('Tu cuenta está inactiva', 'Error', {
          timeOut: 10000
        });
        router.navigate(['/auth/login']);
      }
      
      // Error genérico
      else {
        toastr.error('Error al procesar la solicitud', 'Error');
      }
      
      return throwError(() => error);
    })
  );
};
```

#### `loading.interceptor.ts`
**Funcionalidad:** Muestra/oculta spinner de carga automáticamente

**¿Cómo funciona?**
```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show(); // Muestra spinner
  
  return next(req).pipe(
    finalize(() => {
      loadingService.hide(); // Oculta spinner cuando termina
    })
  );
};
```

---

### 📊 **core/models/** (Modelos de Datos)

Define la estructura de los objetos que se usan en toda la app.

#### `usuario.model.ts`
```typescript
export interface Usuario {
  idUsuario: number;
  usuario: string;           // Username único
  nombreCompleto: string;
  email: string;
  rol: 'Admin' | 'Abogado' | 'Usuario';
  activo: boolean;          // true = activa, false = inactiva
  fechaCreacion: Date;
  fechaUltimaModificacion?: Date;
}
```

#### `caso.model.ts`
```typescript
export interface Caso {
  idRegistro: number;
  numeroCaso: string;       // CASO-2024-001
  tipoCaso: string;         // Civil, Penal, Laboral, etc.
  dependencia: string;      // Nombre del juzgado
  patrocinado: string;      // Nombre del cliente
  abogado: string;          // Nombre del abogado
  fechaIngreso: string;     // YYYY-MM-DD
  fechaVencimiento: string; // YYYY-MM-DD
  estado: string;           // Pendiente, En Proceso, Finalizado
  observaciones?: string;
}
```

#### `documento.model.ts`
```typescript
export interface Documento {
  idDocumento: number;
  titulo: string;
  tipo: string;             // Acta, Escrito, Sentencia, etc.
  idCaso: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tamano: number;           // En bytes
  fechaSubida: Date;
  usuarioSubio: string;
}
```

#### `seguimiento.model.ts`
```typescript
export interface Seguimiento {
  idSeguimiento: number;
  idCaso: number;
  fecha: Date;
  descripcion: string;
  usuario: string;          // Quien hizo el seguimiento
  tipo: string;             // Audiencia, Resolución, etc.
}
```

#### `estadistica.model.ts`
```typescript
export interface EstadisticasResponse {
  totalCasos: number;
  casosPendientes: number;
  casosEnProceso: number;
  casosFinalizados: number;
  estadisticasAbogados: EstadisticaAbogado[];
}

export interface EstadisticaAbogado {
  abogado: string;
  totalCasos: number;
  casosPendientes: number;
  casosEnProceso: number;
  casosFinalizados: number;
  eficiencia: number;       // Porcentaje
}
```

#### `api-response.model.ts`
**Estructura estándar de respuestas del backend:**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Ejemplo de uso:
ApiResponse<Caso[]>     // Lista de casos
ApiResponse<Usuario>    // Un usuario
ApiResponse<null>       // Sin datos (solo mensaje)
```

---

### 🔧 **core/services/** (Servicios - Comunicación con Backend)

#### `auth.service.ts`
**Funcionalidad:** Gestión de autenticación y sesión

**Métodos principales:**
```typescript
class AuthService {
  
  // Login
  login(credentials: {usuario: string, password: string}) {
    return this.http.post('/api/auth/login', credentials).pipe(
      tap(response => {
        // Guarda token y usuario en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }
  
  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
  
  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }
  
  // Obtener usuario actual
  getUser(): Usuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  // Obtener rol del usuario
  getUserRole(): string {
    const user = this.getUser();
    return user?.rol || '';
  }
  
  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Decodificar token JWT
  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
```

**Flujo de autenticación:**
```
1. Usuario ingresa credenciales
2. authService.login() → POST /api/auth/login
3. Backend valida y devuelve token + usuario
4. Service guarda en localStorage
5. Redirige según rol:
   - Admin → /admin/dashboard
   - Abogado → /abogado/dashboard
   - Usuario → /usuario/mis-casos
```

#### `casos.service.ts`
**Funcionalidad:** CRUD de casos judiciales

**Métodos:**
```typescript
class CasosService {
  private apiUrl = 'http://localhost:8080/api';
  
  // Listar todos los casos
  listarCasos(): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/registros`);
  }
  
  // Obtener un caso por ID
  obtenerCaso(id: number): Observable<ApiResponse<Caso>> {
    return this.http.get<ApiResponse<Caso>>(`${this.apiUrl}/registros/${id}`);
  }
  
  // Crear nuevo caso
  crearCaso(caso: Caso): Observable<ApiResponse<Caso>> {
    return this.http.post<ApiResponse<Caso>>(`${this.apiUrl}/registros`, caso);
  }
  
  // Actualizar caso
  actualizarCaso(id: number, caso: Caso): Observable<ApiResponse<Caso>> {
    return this.http.put<ApiResponse<Caso>>(`${this.apiUrl}/registros/${id}`, caso);
  }
  
  // Eliminar caso
  eliminarCaso(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/registros/${id}`);
  }
  
  // Buscar casos con criterios
  buscarCasos(criterios: any): Observable<ApiResponse<Caso[]>> {
    return this.http.post<ApiResponse<Caso[]>>(`${this.apiUrl}/registros/buscar`, criterios);
  }
  
  // Casos próximos a vencer
  listarCasosProximosVencer(dias: number): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/registros/proximos-vencer?dias=${dias}`);
  }
}
```

**Ejemplo de uso:**
```typescript
// En un componente
constructor(private casosService: CasosService) {}

cargarCasos() {
  this.casosService.listarCasos().subscribe({
    next: (response) => {
      if (response.success) {
        this.casos = response.data;
      }
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

#### `usuarios.service.ts`
**Funcionalidad:** Gestión de usuarios

**Métodos:**
```typescript
class UsuariosService {
  
  // Listar todos
  listarUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/usuarios`);
  }
  
  // Crear usuario
  crearUsuario(usuario: Usuario): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios`, usuario);
  }
  
  // Actualizar usuario
  actualizarUsuario(id: number, usuario: Usuario): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }
  
  // Activar usuario
  activarUsuario(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/usuarios/${id}/activar`, {});
  }
  
  // Desactivar usuario
  desactivarUsuario(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/usuarios/${id}/desactivar`, {});
  }
}
```

#### `documentos.service.ts`
**Funcionalidad:** Gestión de documentos

**Métodos:**
```typescript
class DocumentosService {
  
  // Subir documento
  subirDocumento(formData: FormData): Observable<ApiResponse<Documento>> {
    // FormData contiene: archivo, titulo, tipo, idCaso, descripcion
    return this.http.post<ApiResponse<Documento>>(`${this.apiUrl}/documentos`, formData);
  }
  
  // Listar documentos de un caso
  listarPorCaso(idCaso: number): Observable<ApiResponse<Documento[]>> {
    return this.http.get<ApiResponse<Documento[]>>(`${this.apiUrl}/documentos/caso/${idCaso}`);
  }
  
  // Descargar documento
  descargarDocumento(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documentos/${id}/descargar`, {
      responseType: 'blob' // Para archivos binarios
    });
  }
  
  // Eliminar documento
  eliminarDocumento(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/documentos/${id}`);
  }
}
```

#### `seguimientos.service.ts`
**Funcionalidad:** Gestión de seguimientos

**Métodos:**
```typescript
class SeguimientosService {
  
  // Crear seguimiento
  crearSeguimiento(seguimiento: Seguimiento): Observable<ApiResponse<Seguimiento>> {
    return this.http.post<ApiResponse<Seguimiento>>(`${this.apiUrl}/seguimientos`, seguimiento);
  }
  
  // Listar seguimientos de un caso
  listarPorCaso(idCaso: number): Observable<ApiResponse<Seguimiento[]>> {
    return this.http.get<ApiResponse<Seguimiento[]>>(`${this.apiUrl}/seguimientos/caso/${idCaso}`);
  }
  
  // Actualizar seguimiento
  actualizarSeguimiento(id: number, seguimiento: Seguimiento): Observable<ApiResponse<Seguimiento>> {
    return this.http.put<ApiResponse<Seguimiento>>(`${this.apiUrl}/seguimientos/${id}`, seguimiento);
  }
}
```

#### `estadisticas.service.ts`
**Funcionalidad:** Obtener estadísticas del sistema

**Métodos:**
```typescript
class EstadisticasService {
  
  // Estadísticas generales
  obtenerEstadisticas(): Observable<ApiResponse<EstadisticasResponse>> {
    return this.http.get<ApiResponse<EstadisticasResponse>>(`${this.apiUrl}/estadisticas`);
  }
  
  // Estadísticas por abogado
  obtenerPorAbogado(nombreAbogado: string): Observable<ApiResponse<EstadisticaAbogado>> {
    return this.http.get<ApiResponse<EstadisticaAbogado>>(`${this.apiUrl}/estadisticas/abogado/${nombreAbogado}`);
  }
  
  // Estadísticas por período
  obtenerPorPeriodo(fechaInicio: string, fechaFin: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas/periodo?inicio=${fechaInicio}&fin=${fechaFin}`);
  }
}
```

---

### 🌍 **core/environments/** (Configuración de Entornos)

#### `environment.ts`
**Funcionalidad:** Variables de configuración del entorno

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  
  // Arrays de opciones
  tiposCaso: ['Civil', 'Penal', 'Laboral', 'Familiar', 'Administrativo'],
  
  dependencias: [
    '1° Juzgado Civil',
    '2° Juzgado Civil',
    '1° Juzgado Penal',
    '2° Juzgado Penal',
    'Juzgado de Familia'
  ],
  
  estadosCaso: ['Pendiente', 'En Proceso', 'Finalizado', 'Rechazado']
};
```

**Uso:**
```typescript
import { environment } from '../environments/environment';

// En un componente
tiposCaso = environment.tiposCaso;
apiUrl = environment.apiUrl;
```

---

## 🛣️ **app.routes.ts** (Configuración de Rutas)

Define todas las rutas de navegación de la aplicación.

**Estructura:**
```typescript
export const routes: Routes = [
  
  // ============ AUTH ROUTES ============
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/layout/auth-layout.component'),
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  
  // ============ ADMIN ROUTES ============
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }, // Solo Admin puede acceder
    loadComponent: () => import('./components/admin/layout/admin-layout.component'),
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'casos', component: CasosListComponent },
      { path: 'casos/nuevo', component: CasoCreateComponent },
      { path: 'casos/:id', component: CasoDetailComponent },
      { path: 'casos/editar/:id', component: CasoEditComponent }
    ]
  },
  
  // ============ ABOGADO ROUTES ============
  {
    path: 'abogado',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Abogado', 'Admin'] }, // Abogado y Admin pueden acceder
    loadComponent: () => import('./components/abogado/layout/abogado-layout.component'),
    children: [
      { path: 'dashboard', component: AbogadoDashboardComponent },
      { path: 'casos', component: CasosListComponent },
      { path: 'casos/nuevo', component: CasoCreateComponent },
      { path: 'casos/:id', component: CasoDetailComponent },
      { path: 'casos/editar/:id', component: CasoEditComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'seguimientos', component: SeguimientosComponent },
      { path: 'calendario', component: CalendarioComponent }
    ]
  },
  
  // ============ USUARIO ROUTES ============
  {
    path: 'usuario',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Usuario'] }, // Solo Usuario puede acceder
    loadComponent: () => import('./components/usuario/layout/usuario-layout.component'),
    children: [
      { path: 'mis-casos', component: MisCasosComponent },
      { path: 'seguimiento', component: SeguimientoComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'ayuda', component: AyudaComponent }
    ]
  },
  
  // ============ REDIRECT ============
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
```

**Cómo funcionan las guardias:**
```typescript
// Usuario intenta acceder a /admin/usuarios
1. authGuard verifica si hay token válido → ✅ Tiene
2. roleGuard verifica si rol es 'Admin' → ❌ Es 'Usuario'
3. Redirige a / (inicio)
4. Muestra error: "No tienes permisos"
```

---

## ⚙️ **app.config.ts** (Configuración de la Aplicación)

Registra providers, interceptores y configuraciones globales.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),
    
    // HttpClient
    provideHttpClient(
      withInterceptors([
        authInterceptor,      // Agrega token a peticiones
        errorInterceptor,     // Maneja errores
        loadingInterceptor    // Muestra spinner
      ])
    ),
    
    // Animaciones
    provideAnimations(),
    
    // Toastr (notificaciones)
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ]
};
```

---

## 🎨 **styles.scss** (Estilos Globales)

Define estilos que aplican a toda la aplicación.

```scss
// Importar Bootstrap
@use 'bootstrap/scss/bootstrap';

// Importar Bootstrap Icons
@import "bootstrap-icons/font/bootstrap-icons.css";

// Importar PrimeIcons
@import "primeicons/primeicons.css";

// Importar Toastr
@use 'ngx-toastr/toastr';

// Estilos globales
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

// Clases útiles
.text-primary { color: #0d6efd; }
.text-success { color: #198754; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }

// Animaciones
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

---

## 🔄 FLUJO COMPLETO DE LA APLICACIÓN

### **1. Inicio de la Aplicación**
```
1. main.ts carga app.config.ts
2. app.config.ts registra todos los providers
3. app.ts (componente raíz) se inicializa
4. app.routes.ts define las rutas
5. Usuario navega a http://localhost:4200
6. Redirige a /auth/login (ruta por defecto)
```

### **2. Proceso de Login**
```
1. Usuario ingresa credenciales en login.component.html
2. login.component.ts llama authService.login(credentials)
3. authService hace POST /api/auth/login
4. authInterceptor NO agrega token (primera vez)
5. Backend valida credenciales
6. Backend devuelve: { token, user: { id, usuario, rol, ... } }
7. authService guarda token y user en localStorage
8. authService detecta rol: Admin/Abogado/Usuario
9. Redirige a dashboard correspondiente:
   - Admin → /admin/dashboard
   - Abogado → /abogado/dashboard
   - Usuario → /usuario/mis-casos
```

### **3. Protección de Rutas**
```
1. Usuario intenta navegar a /abogado/casos
2. authGuard verifica:
   - ¿Hay token en localStorage? → Sí
   - ¿Token es válido? → Sí
   - Permite continuar ✅
3. roleGuard verifica:
   - Rol del usuario: 'Abogado'
   - Roles permitidos: ['Abogado', 'Admin']
   - Rol coincide → Permite acceso ✅
4. Componente CasosListComponent se carga
```

### **4. Carga de Datos**
```
1. Componente inicializa: ngOnInit()
2. Componente llama servicio: casosService.listarCasos()
3. Servicio hace: GET http://localhost:8080/api/registros
4. authInterceptor agrega: Authorization: Bearer eyJhbG...
5. loadingInterceptor muestra spinner
6. Backend valida token
7. Backend filtra casos según rol:
   - Admin: todos los casos
   - Abogado: solo sus casos
   - Usuario: solo donde es patrocinado
8. Backend devuelve: { success: true, data: [...] }
9. errorInterceptor verifica si hubo error
10. loadingInterceptor oculta spinner
11. Componente recibe datos: this.casos = response.data
12. Vista se actualiza con los datos
```

### **5. Creación de un Caso**
```
1. Usuario navega a /abogado/casos/nuevo
2. CasoCreateComponent carga
3. Formulario se inicializa con validaciones
4. Usuario llena el formulario
5. Usuario hace clic en "Guardar"
6. onSubmit() valida campos
7. Si es válido, llama casosService.crearCaso(datos)
8. Servicio hace: POST /api/registros con body: { numeroCaso, tipoCaso, ... }
9. Backend valida y guarda en base de datos
10. Backend devuelve: { success: true, data: casoCreado, message: "Caso creado" }
11. Componente muestra toast: "Caso creado exitosamente"
12. Redirige a: /abogado/casos (lista de casos)
```

### **6. Paginación**
```
1. Componente tiene: casos[] (100 casos), currentPage = 1, itemsPerPage = 10
2. Vista usa: *ngFor="let caso of casosPaginados"
3. Getter casosPaginados calcula:
   - inicio = (1 - 1) * 10 = 0
   - fin = 0 + 10 = 10
   - return casos.slice(0, 10) → Devuelve 10 casos
4. Usuario hace clic en página 2
5. cambiarPagina(2) se ejecuta
6. currentPage = 2
7. Getter recalcula:
   - inicio = (2 - 1) * 10 = 10
   - fin = 10 + 10 = 20
   - return casos.slice(10, 20) → Devuelve siguientes 10
8. Vista se actualiza automáticamente
```

### **7. Filtrado y Búsqueda**
```
1. Usuario escribe en campo de búsqueda: "CASO-2024"
2. (input)="filtrarCasos()" se dispara
3. filtrarCasos() ejecuta:
   this.casosFiltrados = this.casos.filter(c => 
     c.numeroCaso.includes(this.searchTerm)
   );
4. Resetea paginación: currentPage = 1
5. actualizarPaginacion() recalcula totalPages
6. Vista muestra solo casos filtrados
```

### **8. Manejo de Errores**
```
1. Usuario intenta crear caso con datos inválidos
2. Backend responde: 400 Bad Request
3. errorInterceptor captura el error
4. Analiza el código de estado:
   - 400 → Datos inválidos
   - 401 → No autenticado
   - 403 → Sin permisos
   - 404 → No encontrado
   - 500 → Error del servidor
5. Muestra toast con mensaje apropiado
6. Si es 401, redirige a login
7. Componente puede hacer lógica adicional en el error handler
```

---

## 📦 DEPENDENCIAS PRINCIPALES

### **package.json**
```json
{
  "dependencies": {
    "@angular/core": "^18.x",           // Framework Angular
    "@angular/common": "^18.x",         // Módulos comunes
    "@angular/router": "^18.x",         // Sistema de rutas
    "@angular/forms": "^18.x",          // Formularios
    "bootstrap": "^5.3.x",              // Estilos UI
    "bootstrap-icons": "^1.11.x",       // Iconos Bootstrap
    "primeicons": "^7.0.x",             // Iconos PrimeNG
    "ngx-toastr": "^18.x",              // Notificaciones toast
    "chart.js": "^4.4.x",               // Gráficos
    "rxjs": "^7.8.x"                    // Programación reactiva
  }
}
```

---

## 🎯 CONCEPTOS CLAVE PARA ESTUDIAR

### **1. Inyección de Dependencias**
```typescript
// Angular inyecta servicios automáticamente
constructor(
  private casosService: CasosService,  // Se inyecta
  private router: Router,               // Se inyecta
  private toastr: ToastrService        // Se inyecta
) {}
```

### **2. Observables (RxJS)**
```typescript
// Observable: flujo de datos asíncrono
this.casosService.listarCasos().subscribe({
  next: (data) => console.log('Datos:', data),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Completado')
});
```

### **3. Pipes (Tuberías)**
```html
<!-- Formatear datos en la vista -->
{{ fecha | date:'dd/MM/yyyy' }}        <!-- Formato de fecha -->
{{ precio | currency:'PEN' }}          <!-- Formato de moneda -->
{{ texto | uppercase }}                <!-- Mayúsculas -->
```

### **4. Directivas**
```html
<!-- Estructurales -->
<div *ngIf="mostrar">Contenido</div>           <!-- Condición -->
<div *ngFor="let item of items">{{ item }}</div> <!-- Loop -->

<!-- Atributos -->
<div [class.activo]="esActivo">Texto</div>      <!-- Clase condicional -->
<div [style.color]="color">Texto</div>          <!-- Estilo dinámico -->
```

### **5. Lifecycle Hooks**
```typescript
export class MiComponente implements OnInit, OnDestroy {
  
  ngOnInit() {
    // Se ejecuta al inicializar el componente
    this.cargarDatos();
  }
  
  ngOnDestroy() {
    // Se ejecuta antes de destruir el componente
    this.limpiarRecursos();
  }
}
```

---

## 🚀 PARA ESTUDIAR EL CÓDIGO

### **Orden recomendado:**

1. **Conceptos básicos:**
   - Componentes (cómo se crean, estructura)
   - Servicios (cómo se usan, inyección)
   - Rutas (navegación)

2. **Flujo de autenticación:**
   - auth.service.ts
   - login.component.ts
   - auth.guard.ts
   - role.guard.ts

3. **CRUD básico:**
   - casos-list.component.ts (Read)
   - caso-create.component.ts (Create)
   - caso-edit.component.ts (Update)
   - casos.service.ts (conexión backend)

4. **Características avanzadas:**
   - Interceptores (auth, error, loading)
   - Paginación
   - Filtrado y búsqueda
   - Gráficos con Chart.js

5. **Integración completa:**
   - Seguir el flujo completo: Login → Dashboard → Listar → Crear → Editar

---

¿Necesitas profundizar en alguna carpeta o funcionalidad específica? 😊
