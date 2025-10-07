import { HttpClient } from './HttpClient.js';

export class OnboardingService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getOnboardingSteps() {
    try {
      const steps = await this.httpClient.get('/onboarding');
      return steps;
    } catch (error) {
      throw new Error('Failed to fetch onboarding steps: ' + error.message);
    }
  }

  async getOnboardingStep(id) {
    try {
      const steps = await this.httpClient.get('/onboarding');
      // Convert both to string for comparison since API returns string IDs
      const step = steps.find(s => s.id.toString() === id.toString());
      
      if (step) {
        return step;
      } else {
        throw new Error('Onboarding step not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch onboarding step: ' + error.message);
    }
  }
}
