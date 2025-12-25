# Script para copiar archivos nuevos y reemplazar componentes
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Actualizando componentes del módulo Abogado" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$basePath = "c:\Users\ASUS\Downloads\PROYECTO PARA MYSQL\PROYECTO PARA MYSQL\justicia_derecho_frontend\src\app\components\abogado"

# 1. Copiar archivos del listado de casos
Write-Host "[1/2] Actualizando lista de casos..." -ForegroundColor Yellow
Copy-Item "$basePath\casos\list\casos-list-new.html" -Destination "$basePath\casos\list\casos-list.component.html" -Force
Copy-Item "$basePath\casos\list\casos-list-full.component.ts" -Destination "$basePath\casos\list\casos-list.component.ts" -Force
Write-Host "✓ Lista de casos actualizada" -ForegroundColor Green

# 2. Copiar archivos de creación de casos
Write-Host "[2/2] Actualizando formulario de creación..." -ForegroundColor Yellow
Copy-Item "$basePath\casos\create\caso-create-full.component.html" -Destination "$basePath\casos\create\caso-create.component.html" -Force
Write-Host "✓ Formulario de creación actualizado" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "COMPONENTES NUEVOS CREADOS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Próximos a Vencer (Nuevo componente completo)" -ForegroundColor Green
Write-Host "✓ Rutas actualizadas en app.routes.ts" -ForegroundColor Green
Write-Host "✓ Menú actualizado en sidebar.component.ts" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Listado de casos con filtros avanzados" -ForegroundColor Green
Write-Host "✓ Búsqueda por número, estado, dependencia y fechas" -ForegroundColor Green
Write-Host "✓ Paginación de resultados" -ForegroundColor Green
Write-Host "✓ Formulario completo de creación de casos" -ForegroundColor Green
Write-Host "✓ Casos próximos a vencer con filtros de 3, 7 y 15 días" -ForegroundColor Green
Write-Host "✓ Indicadores de urgencia y días restantes" -ForegroundColor Green
Write-Host "✓ Navegación integrada en el menú lateral" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ARCHIVOS PENDIENTES (Para completar):" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "- Detalle de caso (caso-detail.component.*)" -ForegroundColor Yellow
Write-Host "- Editar caso (caso-edit.component.*)" -ForegroundColor Yellow
Write-Host "- Estilos SCSS personalizados" -ForegroundColor Yellow

Write-Host "`n¡Actualización completada!" -ForegroundColor Green
Write-Host "Recarga la aplicación para ver los cambios.`n" -ForegroundColor Cyan
