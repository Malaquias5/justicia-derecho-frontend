export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  mockMode: false, // Conectado al backend Spring Boot
  appName: 'Sistema Judicial BCI',
  version: '1.0.0',
  roles: {
    admin: 'Admin',
    abogado: 'Abogado',
    usuario: 'Usuario'
  },
  estadosCaso: [
    'Pendiente',
    'En Proceso',
    'Finalizado'
  ],
  dependencias: [
    'COMISARIA',
    'FISCALIA'
  ],
  tiposCaso: [
    'Violencia Familiar',
    'Pensión de Alimentos',
    'Lesiones Graves',
    'Divorcio',
    'Violación',
    'Robo',
    'Estafa',
    'Homicidio'
  ]
};