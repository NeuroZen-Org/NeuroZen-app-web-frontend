export class OnboardingStep {
  constructor({ id, title, description, image, step, totalSteps }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.step = step;
    this.totalSteps = totalSteps;
  }

  static fromApiResponse(data) {
    return new OnboardingStep(data);
  }

  isFirstStep() {
    return this.step === 1;
  }

  isLastStep() {
    return this.step === this.totalSteps;
  }

  getProgressPercentage() {
    return (this.step / this.totalSteps) * 100;
  }
}
