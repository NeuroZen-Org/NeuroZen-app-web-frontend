import { HttpClient } from './HttpClient.js';
import { OnboardingRepository } from '../domain/repositories/OnboardingRepository.js';
import { OnboardingStep } from '../domain/models/OnboardingStep.js';
import { ApiResponse } from '../domain/models/ApiResponse.js';

export class ApiOnboardingRepository extends OnboardingRepository {
  constructor() {
    super();
    this.httpClient = new HttpClient();
  }

  async getOnboardingSteps() {
    try {
      const steps = await this.httpClient.get('/onboarding');
      const onboardingSteps = steps.map(step => OnboardingStep.fromApiResponse(step));
      return ApiResponse.success(onboardingSteps);
    } catch (error) {
      return ApiResponse.error('Failed to fetch onboarding steps: ' + error.message);
    }
  }

  async getOnboardingStep(id) {
    try {
      const steps = await this.httpClient.get('/onboarding');
      const step = steps.find(s => s.id === parseInt(id));
      
      if (step) {
        return ApiResponse.success(OnboardingStep.fromApiResponse(step));
      } else {
        return ApiResponse.error('Onboarding step not found');
      }
    } catch (error) {
      return ApiResponse.error('Failed to fetch onboarding step: ' + error.message);
    }
  }
}
