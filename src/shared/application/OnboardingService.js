import { ApiOnboardingRepository } from '../infrastructure/ApiOnboardingRepository.js';

export class OnboardingService {
  constructor() {
    this.onboardingRepository = new ApiOnboardingRepository();
    // Datos de onboarding locales (fallback)
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
      const response = await this.onboardingRepository.getOnboardingSteps();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      // Si falla, usar datos locales
      console.info('Using local onboarding steps');
      return this.localSteps;
    }
  }

  async getOnboardingStep(id) {
    try {
      const response = await this.onboardingRepository.getOnboardingStep(id);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
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
}
