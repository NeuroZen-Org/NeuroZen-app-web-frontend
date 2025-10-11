/**
 * API mock para Firebase Hosting - Sirve datos estáticos
 * Funciona en el plan gratuito de Firebase
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

// Cargar datos desde archivo JSON
async function loadData() {
  try {
    const response = await fetch('/data/db.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}

// Simulador de API REST
class MockAPI {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    this.data = await loadData();
  }

  // GET endpoints
  async get(endpoint) {
    if (!this.data) await this.init();
    
    const path = endpoint.replace('/api/', '').split('/');
    const resource = path[0];
    const id = path[1];

    if (id) {
      // Get single item
      const items = this.data[resource] || [];
      return items.find(item => item.id === id);
    } else {
      // Get all items
      return this.data[resource] || [];
    }
  }

  // POST endpoint (simulado - no persiste)
  async post(endpoint, newData) {
    if (!this.data) await this.init();
    
    const resource = endpoint.replace('/api/', '').split('/')[0];
    const items = this.data[resource] || [];
    
    const newItem = {
      ...newData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    return newItem;
  }
}

// API global
window.MockAPI = new MockAPI();
