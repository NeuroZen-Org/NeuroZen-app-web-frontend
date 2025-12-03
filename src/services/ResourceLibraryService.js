import { HttpClient } from './HttpClient.js';

export class ResourceLibraryService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getResources() {
    try {
      const response = await this.httpClient.get('/api/v1/resource-libraries');
      return this._extractList(response);
    } catch (error) {
      console.warn('Backend resources endpoint not available, using mock data:', error);
      
      // Fallback: retornar recursos mock
      return this._getMockResources();
    }
  }

  async getResource(id) {
    try {
      const response = await this.httpClient.get(`/api/v1/resources/${id}`);
      return this._extractData(response);
    } catch (error) {
      console.error('Failed to fetch resource:', error);
      throw new Error('No se pudo cargar el recurso. Por favor intenta nuevamente.');
    }
  }

  async getResourcesByCategory(category) {
    try {
      const response = await this.httpClient.get(`/api/v1/resources?category=${category}`);
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to fetch resources by category:', error);
      throw new Error('No se pudieron cargar los recursos. Por favor intenta nuevamente.');
    }
  }

  async searchResources(query) {
    try {
      const response = await this.httpClient.get(`/api/v1/resource-libraries?search=${encodeURIComponent(query)}`);
      return this._extractList(response);
    } catch (error) {
      console.error('Failed to search resources:', error);
      throw new Error('No se pudo realizar la búsqueda. Por favor intenta nuevamente.');
    }
  }

  /**
   * Extrae datos de diferentes formatos de respuesta
   * @private
   */
  _extractData(response) {
    if (response.data) return response.data;
    if (response.success && response.data) return response.data;
    return response;
  }

  /**
   * Extrae listas de diferentes formatos de respuesta
   * @private
   */
  _extractList(response) {
    if (Array.isArray(response)) return response;
    if (response.items) return response.items;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.success && response.data && Array.isArray(response.data)) return response.data;
    return [];
  }

  getCategories() {
    return [
      {
        id: 'audio',
        name: 'Audio',
        description: 'Guided meditations and audio content',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAunrGe3YCJ0zxIVOP4EYtOkzqNaa1lVu2Q1giXc-bpOdRPo_sNc6Chepddi6TNtEDNwD-5EcqgZqRIyzIZ6-aQyLCmhVSUNlsZ3VlglbL-Xp47Zs3ZYcDHby6TdaEmPjUAM4m0lOWtGLm0Y9wpS6FnxFLP95JlQJXmxTRuvxtrDZQoEGll7q-1YZvdXdPSv2MXcVlzMVgUl48msKLRMdrHzWmqwY3ogg6uLAWMYh-Nc_D8fB5BsZuNILrXYSarlt-AreG8EfS4_qQ2'
      },
      {
        id: 'video',
        name: 'Video',
        description: 'Visual guides and video content',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVnF2TWw73fErpHd8yNzMClhv7ppJZwDEll4vnglE_V2_JusbKi_n55sRXt2aeJ0_RSHKp0vaTIpyH5ZtlK8kQKJF1sHoqh-szwaeAj4NufnW033sVBggnBMfYHma_kxBGxaTCXOsqAupGNKCkFAfdhrHROzZc_nzpw4XIPANxo1hi8YAuPBT7_SOzS99lJdYzQWJRifCeNQjzHBukZErTmoB2ff5mdTKlnTDw8hrJUODwbQNlQiWH4qtFBUYNvidOHmkfd6VChJSo'
      },
      {
        id: 'reading',
        name: 'Reading',
        description: 'Articles and written resources',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk9w6uWqyNE9iQrCElADq0mLbLxt28FlrJwRl-f37Eae0zPM3R9yeUPYs1RavQdXAHHxFLwhnJB6t7tJjf3SRpFYLYR5gj7ReS6vNZ7OKc2OdP9pLAjjzQATg8oz6OYZdnNKb_kpXlSLwIIkYBgNdr592b4EU1Wk55clGo2E8vjhm4nKoB_H2sh0J7OmxliPh-Mg2z-i2H8FHuwTmMWdIVlGw3d2A7bcFzUyOACPAYHAveL86yH4rr7N4ZPVI4PnQwAdXdmZKyebZq'
      },
      {
        id: 'exercises',
        name: 'Exercises',
        description: 'Physical and mental exercises',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASzCJ22_1ztNrIsCmRFtbh4Z6D340iD2ukNMvMYyVWwY7dY39EqWuDwmkWR0OI7eM_ET6XiTslt3v3e6-JVIypMi3UvbtCmw-Ned3Yw0kngrWe7A4bwiKP55oZ70tYXyKCnruJbBCn-QnMwKBdj9YCM0hxFYaWgvGYRqJWgwwjY4YGX1iMWOVVg6TRh44rzAarkLjVCU0RHGVqR2g1RqjRryo7ZL3BaHyntW7tLXBY4DgIyWD7wh7hL3wURz06HPjpmRgGUOSKbvuD'
      }
    ];
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Mock player functionality
  createPlayerSession(resourceId) {
    return {
      id: Date.now().toString(),
      resourceId,
      currentTime: 0,
      isPlaying: false,
      isLoaded: false,
      volume: 1.0,
      playbackRate: 1.0
    };
  }

  // Additional methods used by components
  async getResourceById(id) {
    return this.getResource(id);
  }

  async getRelatedResources(resourceId) {
    try {
      const resources = await this.getResources();
      const currentResource = resources.find(r => r.id.toString() === resourceId.toString());
      
      if (!currentResource) {
        return [];
      }
      
      // Return resources with similar categories or tags
      const related = resources
        .filter(r => r.id.toString() !== resourceId.toString())
        .filter(r => r.category === currentResource.category || 
                     (r.tags && currentResource.tags && 
                      r.tags.some(tag => currentResource.tags.includes(tag))))
        .slice(0, 3); // Limit to 3 related resources
      
      return related;
    } catch (error) {
      throw new Error('Failed to fetch related resources: ' + error.message);
    }
  }

  /**
   * Retorna recursos mock cuando el backend no está disponible
   * @private
   */
  _getMockResources() {
    return [
      {
        id: 1,
        title: "Técnicas de Respiración Profunda",
        description: "Aprende técnicas de respiración diafragmática para reducir el estrés y la ansiedad en cualquier momento del día.",
        resourceType: "Video",
        category: "video",
        contentUrl: "https://www.youtube.com/watch?v=example1",
        thumbnail: "https://picsum.photos/400/300?random=1",
        duration: 900, // 15 minutos en segundos
        author: "Dr. Juan Pérez",
        tags: ["respiración", "mindfulness", "relajación"],
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        title: "Mindfulness para Principiantes",
        description: "Una guía completa para comenzar con la práctica de mindfulness. Descubre cómo estar presente en el momento.",
        resourceType: "Article",
        category: "reading",
        contentUrl: "https://neurozen.com/articles/mindfulness-principiantes",
        thumbnail: "https://picsum.photos/400/300?random=2",
        duration: 600, // 10 minutos
        author: "Lic. María González",
        tags: ["mindfulness", "meditación", "principiantes"],
        createdAt: "2024-01-20"
      },
      {
        id: 3,
        title: "Meditación Guiada de 5 Minutos",
        description: "Meditación rápida perfecta para hacer en tu pausa laboral. Ideal para recuperar la calma y concentración.",
        resourceType: "Audio",
        category: "audio",
        contentUrl: "https://neurozen.com/audio/meditacion-5min.mp3",
        thumbnail: "https://picsum.photos/400/300?random=3",
        duration: 300, // 5 minutos
        author: "Ana Martínez",
        tags: ["meditación", "audio", "pausa"],
        createdAt: "2024-02-01"
      },
      {
        id: 4,
        title: "Ejercicios de Estiramiento para Oficina",
        description: "Serie de estiramientos diseñados para aliviar la tensión muscular causada por largas jornadas frente al ordenador.",
        resourceType: "Video",
        category: "exercises",
        contentUrl: "https://www.youtube.com/watch?v=example2",
        thumbnail: "https://picsum.photos/400/300?random=4",
        duration: 480, // 8 minutos
        author: "Carlos Rodríguez",
        tags: ["ejercicios", "estiramiento", "oficina"],
        createdAt: "2024-02-10"
      },
      {
        id: 5,
        title: "Gestión del Tiempo y Productividad",
        description: "Estrategias probadas para organizar tu tiempo, establecer prioridades y reducir el estrés relacionado con la carga de trabajo.",
        resourceType: "Article",
        category: "reading",
        contentUrl: "https://neurozen.com/articles/gestion-tiempo",
        thumbnail: "https://picsum.photos/400/300?random=5",
        duration: 720, // 12 minutos
        author: "Dr. Laura Sánchez",
        tags: ["productividad", "gestión", "tiempo"],
        createdAt: "2024-02-15"
      },
      {
        id: 6,
        title: "Música Relajante para Dormir",
        description: "Composición de 30 minutos de música ambient diseñada específicamente para facilitar el sueño profundo.",
        resourceType: "Audio",
        category: "audio",
        contentUrl: "https://neurozen.com/audio/musica-dormir.mp3",
        thumbnail: "https://picsum.photos/400/300?random=6",
        duration: 1800, // 30 minutos
        author: "Estudio NeuroZen",
        tags: ["música", "sueño", "relajación"],
        createdAt: "2024-02-20"
      },
      {
        id: 7,
        title: "Yoga para Reducir la Ansiedad",
        description: "Secuencia de yoga suave enfocada en posturas que calman el sistema nervioso y reducen los síntomas de ansiedad.",
        resourceType: "Video",
        category: "exercises",
        contentUrl: "https://www.youtube.com/watch?v=example3",
        thumbnail: "https://picsum.photos/400/300?random=7",
        duration: 1200, // 20 minutos
        author: "Sofía Ramírez",
        tags: ["yoga", "ansiedad", "ejercicios"],
        createdAt: "2024-03-01"
      },
      {
        id: 8,
        title: "Guía de Alimentación Anti-Estrés",
        description: "Descubre qué alimentos ayudan a combatir el estrés y la ansiedad. Incluye recetas saludables.",
        resourceType: "Article",
        category: "reading",
        contentUrl: "https://neurozen.com/articles/alimentacion-antiestres",
        thumbnail: "https://picsum.photos/400/300?random=8",
        duration: 900, // 15 minutos
        author: "Dra. Patricia López",
        tags: ["alimentación", "nutrición", "salud"],
        createdAt: "2024-03-05"
      }
    ];
  }
}
