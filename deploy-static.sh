#!/bin/bash

# NeuroZen Static API Deploy Script
# Despliega la aplicación con API estática en Firebase Hosting

echo "🚀 Desplegando NeuroZen con API estática..."

# 1. Verificar que Firebase esté configurado
echo "📋 Verificando configuración de Firebase..."
if ! firebase projects:list | grep -q "neurozen-frontend"; then
    echo "❌ Error: Proyecto Firebase no configurado"
    echo "💡 Ejecuta: firebase use neurozen-frontend"
    exit 1
fi

# 2. Copiar base de datos a public/data
echo "📂 Copiando base de datos..."
mkdir -p public/data
cp server/db.json public/data/db.json
echo "✅ Base de datos copiada a public/data/"

# 3. Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

# 4. Verificar que los datos estén en dist
if [ ! -f "dist/data/db.json" ]; then
    echo "❌ Error: db.json no encontrado en dist/data/"
    exit 1
fi

echo "✅ Build completado"

# 5. Deploy a Firebase
echo "🚀 Desplegando a Firebase Hosting..."
firebase deploy --only hosting:frontend

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Despliegue exitoso!"
    echo "🌐 Frontend: https://neurozen-frontend.web.app"
    echo "📊 Datos: https://neurozen-frontend.web.app/data/db.json"
    echo ""
    echo "💡 Para actualizar datos:"
    echo "   1. Modifica server/db.json"
    echo "   2. Ejecuta este script nuevamente"
else
    echo "❌ Error en el despliegue"
    exit 1
fi
