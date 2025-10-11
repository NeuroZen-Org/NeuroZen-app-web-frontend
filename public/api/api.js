/**
 * NeuroZen Static API - Funciona desde Firebase Hosting
 * Simula una API REST usando archivos JSON estáticos
 */

class StaticAPI {
  constructor() {
    this.baseUrl = '';
    this.data = null;
  }

  async loadData() {
    if (this.data) return this.data;
    
    try {
      const response = await fetch('/data/db.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load API data');
    }
  }

  // Simular endpoints REST
  async get(endpoint) {
    const data = await this.loadData();
    
    // Parse endpoint
    const [resource, id] = endpoint.split('/').filter(Boolean);
    
    if (!resource) {
      return { error: 'Resource not specified' };
    }

    if (!data[resource]) {
      return { error: `Resource '${resource}' not found` };
    }

    // Si hay ID, buscar item específico
    if (id) {
      const item = data[resource].find(item => item.id === id);
      return item || { error: `Item with id '${id}' not found` };
    }

    // Retornar toda la colección
    return data[resource];
  }

  async post(endpoint, body) {
    // En una API estática, solo simulamos la respuesta
    // En un entorno real, necesitarías un backend
    console.warn('POST operation simulated (not persisted):', endpoint, body);
    
    return {
      success: true,
      message: 'Operation simulated (changes not persisted)',
      data: { ...body, id: Date.now().toString() }
    };
  }

  async put(endpoint, body) {
    console.warn('PUT operation simulated (not persisted):', endpoint, body);
    
    return {
      success: true,
      message: 'Operation simulated (changes not persisted)',
      data: body
    };
  }

  async delete(endpoint) {
    console.warn('DELETE operation simulated (not persisted):', endpoint);
    
    return {
      success: true,
      message: 'Operation simulated (changes not persisted)'
    };
  }
}

// Crear instancia global
window.NeuroZenAPI = new StaticAPI();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StaticAPI;
}
