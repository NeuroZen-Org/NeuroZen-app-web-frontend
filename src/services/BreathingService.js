import { HttpClient } from './HttpClient.js';

export class BreathingService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getBreathingExercises() {
    try {
      const exercises = await this.httpClient.get('/breathingExercises');
      return exercises;
    } catch (error) {
      throw new Error('Failed to fetch breathing exercises: ' + error.message);
    }
  }

  async getBreathingExercise(id) {
    try {
      const exercises = await this.httpClient.get('/breathingExercises');
      const exercise = exercises.find(ex => ex.id.toString() === id.toString());
      
      if (exercise) {
        return exercise;
      } else {
        throw new Error('Breathing exercise not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch breathing exercise: ' + error.message);
    }
  }

  // Mock breathing session state management
  createBreathingSession(exerciseId, duration = 300) {
    return {
      id: Date.now().toString(),
      exerciseId,
      duration, // in seconds
      currentTime: 0,
      isPlaying: false,
      isCompleted: false,
      breathingCycle: {
        phase: 'inhale', // 'inhale', 'hold', 'exhale', 'pause'
        cycleTime: 0,
        inhaleTime: 4,
        holdTime: 4,
        exhaleTime: 6,
        pauseTime: 2
      }
    };
  }

  updateSessionTime(session, elapsedSeconds) {
    session.currentTime = Math.min(session.currentTime + elapsedSeconds, session.duration);
    session.isCompleted = session.currentTime >= session.duration;
    return session;
  }

  updateBreathingCycle(session) {
    const { breathingCycle } = session;
    const totalCycleTime = breathingCycle.inhaleTime + breathingCycle.holdTime + 
                          breathingCycle.exhaleTime + breathingCycle.pauseTime;
    
    breathingCycle.cycleTime = (breathingCycle.cycleTime + 1) % totalCycleTime;
    
    if (breathingCycle.cycleTime < breathingCycle.inhaleTime) {
      breathingCycle.phase = 'inhale';
    } else if (breathingCycle.cycleTime < breathingCycle.inhaleTime + breathingCycle.holdTime) {
      breathingCycle.phase = 'hold';
    } else if (breathingCycle.cycleTime < breathingCycle.inhaleTime + breathingCycle.holdTime + breathingCycle.exhaleTime) {
      breathingCycle.phase = 'exhale';
    } else {
      breathingCycle.phase = 'pause';
    }
    
    return session;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getPhaseInstruction(phase) {
    const instructions = {
      inhale: 'Inhala profundamente',
      hold: 'Mantén el aire',
      exhale: 'Exhala lentamente',
      pause: 'Pausa suavemente'
    };
    return instructions[phase] || 'Respira naturalmente';
  }

  // Additional methods used by components
  async getExercises() {
    return this.getBreathingExercises();
  }

  async saveSession(userId, sessionData) {
    try {
      const session = {
        userId,
        exerciseId: sessionData.exerciseId,
        duration: sessionData.duration,
        completedCycles: sessionData.completedCycles,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        rating: sessionData.rating || null,
        notes: sessionData.notes || '',
        timestamp: new Date().toISOString()
      };
      
      // Save to sessions endpoint
      const savedSession = await this.httpClient.post('/breathingSessions', session);
      return savedSession;
    } catch (error) {
      throw new Error('Failed to save breathing session: ' + error.message);
    }
  }
}
