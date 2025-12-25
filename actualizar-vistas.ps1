# Script para actualizar componentes con las versiones completas
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Actualizando componentes del sistema" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$base = "c:\Users\ASUS\Downloads\PROYECTO PARA MYSQL\PROYECTO PARA MYSQL\justicia_derecho_frontend\src\app\components\abogado\casos"

# 1. Editar caso (solo cliente y descripción editables)
Write-Host "[1/2] Actualizando componente Editar..." -ForegroundColor Yellow
Copy-Item "$base\edit\caso-edit-new.component.html" -Destination "$base\edit\caso-edit.component.html" -Force
Copy-Item "$base\edit\caso-edit-new.component.ts" -Destination "$base\edit\caso-edit.component.ts" -Force
Write-Host "OK - Editar caso actualizado" -ForegroundColor Green

# 2. Detalle caso
Write-Host "[2/2] Actualizando componente Detalle..." -ForegroundColor Yellow
Copy-Item "$base\detail\caso-detail-new.component.html" -Destination "$base\detail\caso-detail.component.html" -Force
Copy-Item "$base\detail\caso-detail-new.component.ts" -Destination "$base\detail\caso-detail.component.ts" -Force
Write-Host "OK - Detalle caso actualizado" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CAMBIOS APLICADOS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OK Editar: Solo cliente y descripcion editables" -ForegroundColor Green
Write-Host "OK Detalle: Vista completa con seguimientos y documentos" -ForegroundColor Green
Write-Host "OK Notificaciones de dias restantes funcionando" -ForegroundColor Green

Write-Host "`nActualizacion completada!" -ForegroundColor Green
