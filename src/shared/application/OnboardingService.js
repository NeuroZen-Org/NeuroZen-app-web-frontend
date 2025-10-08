import { ApiOnboardingRepository } from '../infrastructure/ApiOnboardingRepository.js';

export class OnboardingService {
  constructor() {
    this.onboardingRepository = new ApiOnboardingRepository();
  }

  async getOnboardingSteps() {
    const response = await this.onboardingRepository.getOnboardingSteps();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }

  async getOnboardingStep(id) {
    const response = await this.onboardingRepository.getOnboardingStep(id);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
}
