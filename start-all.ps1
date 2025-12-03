# NeuroZen - Script de inicio para Frontend + Backend
# Ejecuta el backend .NET y el frontend Vue.js simultáneamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeuroZen - Iniciando aplicación" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Rutas de los proyectos
$backendPath = "C:\Miguel\AplicacionesWeb\NeuroZen\Neurozen_back_idk\neurozen-back\neurozen.API"
$frontendPath = "C:\Miguel\AplicacionesWeb\NeuroZen\NeuroZen-app-web-frontend"

# Verificar que existan las rutas
if (!(Test-Path $backendPath)) {
    Write-Host "❌ Error: No se encontró el backend en: $backendPath" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $frontendPath)) {
    Write-Host "❌ Error: No se encontró el frontend en: $frontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Rutas verificadas" -ForegroundColor Green
Write-Host ""

# Iniciar Backend (.NET)
Write-Host "🚀 Iniciando Backend (.NET)..." -ForegroundColor Yellow
Write-Host "   Puerto: http://localhost:5059" -ForegroundColor Gray
Write-Host "   Swagger: http://localhost:5059/swagger" -ForegroundColor Gray
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '=====================================' -ForegroundColor Magenta; `
     Write-Host '  BACKEND - .NET API' -ForegroundColor Magenta; `
     Write-Host '=====================================' -ForegroundColor Magenta; `
     Write-Host ''; `
     Write-Host 'Puerto HTTP: http://localhost:5059' -ForegroundColor Cyan; `
     Write-Host 'Puerto HTTPS: https://localhost:7051' -ForegroundColor Cyan; `
     Write-Host 'Swagger UI: http://localhost:5059/swagger' -ForegroundColor Cyan; `
     Write-Host ''; `
     cd '$backendPath'; `
     dotnet run"

# Esperar 8 segundos para que el backend inicie completamente
Write-Host "⏳ Esperando 8 segundos para que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Iniciar Frontend (Vue.js)
Write-Host "🚀 Iniciando Frontend (Vue.js)..." -ForegroundColor Yellow
Write-Host "   Puerto: http://localhost:5173" -ForegroundColor Gray
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '=====================================' -ForegroundColor Green; `
     Write-Host '  FRONTEND - Vue.js + Vite' -ForegroundColor Green; `
     Write-Host '=====================================' -ForegroundColor Green; `
     Write-Host ''; `
     Write-Host 'App: http://localhost:5173' -ForegroundColor Cyan; `
     Write-Host 'API: http://localhost:5059' -ForegroundColor Cyan; `
     Write-Host ''; `
     cd '$frontendPath'; `
     npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Aplicación iniciada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor White
Write-Host "  • Frontend:    http://localhost:5173" -ForegroundColor Cyan
Write-Host "  • Backend:     http://localhost:5059" -ForegroundColor Cyan
Write-Host "  • Swagger UI:  http://localhost:5059/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener, cierra las ventanas de PowerShell." -ForegroundColor Yellow
Write-Host ""

