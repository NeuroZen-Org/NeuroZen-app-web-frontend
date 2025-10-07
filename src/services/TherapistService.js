import { HttpClient } from './HttpClient.js';

export class TherapistService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getTherapists() {
    try {
      const therapists = await this.httpClient.get('/professionals');
      return therapists;
    } catch (error) {
      throw new Error('Failed to fetch therapists: ' + error.message);
    }
  }

  async getTherapist(id) {
    try {
      const therapists = await this.httpClient.get('/professionals');
      const therapist = therapists.find(t => t.id.toString() === id.toString());
      
      if (therapist) {
        return therapist;
      } else {
        throw new Error('Therapist not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch therapist: ' + error.message);
    }
  }

  async getTherapistReviews(therapistId) {
    try {
      const reviews = await this.httpClient.get('/reviews');
      return reviews.filter(review => review.professionalId.toString() === therapistId.toString());
    } catch (error) {
      throw new Error('Failed to fetch reviews: ' + error.message);
    }
  }
}
