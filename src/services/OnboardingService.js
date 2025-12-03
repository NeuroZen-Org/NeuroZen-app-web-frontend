import { HttpClient } from './HttpClient.js';

export class OnboardingService {
  constructor() {
    this.httpClient = new HttpClient();
    // Datos de onboarding locales (el backend no tiene este endpoint)
    this.localSteps = [
      {
        id: "1",
        title: "welcome",
        description: "welcomeDescription",
        icon: "👋",
        order: 1
      },
      {
        id: "2",
        title: "profile",
        description: "profileDescription",
        icon: "👤",
        order: 2
      },
      {
        id: "3",
        title: "preferences",
        description: "preferencesDescription",
        icon: "⚙️",
        order: 3
      },
      {
        id: "4",
        title: "ready",
        description: "readyDescription",
        icon: "🎉",
        order: 4
      }
    ];
  }

  async getOnboardingSteps() {
    try {
      // Intentar obtener del backend primero
      const steps = await this.httpClient.get('/api/v1/onboarding');
      return this._extractList(steps);
    } catch (error) {
      // Si falla, usar datos locales
      console.info('Using local onboarding steps');
      return this.localSteps;
    }
  }

  async getOnboardingStep(id) {
    try {
      // Intentar obtener del backend primero
      const step = await this.httpClient.get(`/api/v1/onboarding/${id}`);
      return this._extractData(step);
    } catch (error) {
      // Si falla, buscar en datos locales
      console.info('Using local onboarding step');
      const step = this.localSteps.find(s => s.id.toString() === id.toString());
      
      if (step) {
        return step;
      } else {
        throw new Error('Onboarding step not found');
      }
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
}
