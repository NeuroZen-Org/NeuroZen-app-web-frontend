#!/bin/bash

# NeuroZen Firebase Deployment Script
# @author Juan Carlos Angulo

echo "🚀 NeuroZen Firebase Deployment Setup"
echo "======================================"

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado."
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

# Inicializar Firebase (si no está inicializado)
if [ ! -f ".firebaserc" ]; then
    echo "🔧 Configurando Firebase proyecto..."
    echo "Por favor, ejecuta: firebase login"
    echo "Luego: firebase init"
    echo "Selecciona:"
    echo "- Hosting: Configure files for Firebase Hosting"
    echo "- Functions: Configure a Cloud Functions directory"
    exit 1
fi

# Instalar dependencias de la API
echo "📦 Instalando dependencias de la API..."
cd api
npm install
cd ..

# Build del frontend
echo "🏗️  Building frontend..."
npm run build

# Configurar targets de Firebase
echo "🎯 Configurando targets de Firebase..."
firebase target:apply hosting frontend neurozen-frontend
firebase target:apply hosting api neurozen-api

echo "✅ Setup completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. firebase deploy --only functions  # Desplegar API"
echo "2. firebase deploy --only hosting:frontend  # Desplegar Frontend"
echo "3. firebase deploy  # Desplegar todo"
echo ""
echo "🔗 URLs esperadas:"
echo "Frontend: https://neurozen-frontend.web.app"
echo "API: https://us-central1-[PROJECT-ID].cloudfunctions.net/api"
