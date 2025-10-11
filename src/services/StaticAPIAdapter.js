/**
 * Static API Adapter - Adaptador para API estática en Firebase Hosting
 * Permite usar la misma interfaz del HttpClient pero con datos estáticos
 */

class StaticAPIAdapter {
  constructor() {
    this.data = null;
    this.isStatic = import.meta.env.VITE_API_MODE === 'static' || 
                    import.meta.env.VITE_API_BASE_URL === 'static';
  }

  async loadData() {
    if (this.data) return this.data;
    
    try {
      const response = await fetch('/data/db.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading static data:', error);
      throw new Error('Failed to load API data');
    }
  }

  async get(endpoint) {
    const data = await this.loadData();
    
    // Limpiar endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const [resource, id, ...rest] = cleanEndpoint.split('/');
    
    if (!resource) {
      return data;
    }

    if (!data[resource]) {
      throw new Error(`Resource '${resource}' not found`);
    }

    // Si hay ID, buscar item específico
    if (id && id !== '') {
      const item = data[resource].find(item => 
        item.id === id || item.id === parseInt(id) || item.id === id.toString()
      );
      
      if (!item) {
        // En modo estático, si no encontramos el usuario específico, 
        // devolver el primer usuario como fallback para que la app funcione
        if (resource === 'users' && data[resource].length > 0) {
          console.warn(`🚧 Static API: User ID '${id}' not found, using fallback user`);
          return data[resource][0]; // Devolver el primer usuario
        }
        throw new Error(`Item with id '${id}' not found in ${resource}`);
      }
      return item;
    }

    // Retornar toda la colección
    return data[resource];
  }

  async post(endpoint, body) {
    console.warn('🚧 POST operation simulated (not persisted in static mode):', endpoint, body);
    
    // Simular creación exitosa
    const newItem = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    return newItem;
  }

  async put(endpoint, body) {
    console.warn('🚧 PUT operation simulated (not persisted in static mode):', endpoint, body);
    
    // Simular actualización exitosa
    return {
      ...body,
      updatedAt: new Date().toISOString()
    };
  }

  async delete(endpoint) {
    console.warn('🚧 DELETE operation simulated (not persisted in static mode):', endpoint);
    
    // Simular eliminación exitosa
    return { 
      success: true, 
      message: 'Resource deleted successfully (simulated)' 
    };
  }
}

export { StaticAPIAdapter };
