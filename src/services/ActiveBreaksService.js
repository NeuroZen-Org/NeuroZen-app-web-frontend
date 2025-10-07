import { HttpClient } from './HttpClient.js';

export class ActiveBreaksService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getActiveBreaksConfig(userId) {
    try {
      const configs = await this.httpClient.get('/activeBreaks');
      return configs.find(config => config.userId === userId) || this.getDefaultConfig();
    } catch (error) {
      throw new Error('Failed to fetch active breaks config: ' + error.message);
    }
  }

  async updateActiveBreaksConfig(userId, config) {
    try {
      const updatedConfig = await this.httpClient.put(`/activeBreaks/${config.id}`, {
        ...config,
        userId
      });
      return updatedConfig;
    } catch (error) {
      throw new Error('Failed to update active breaks config: ' + error.message);
    }
  }

  getDefaultConfig() {
    return {
      id: null,
      userId: null,
      frequency: 60, // minutes
      duration: 5,   // minutes
      isActive: true,
      settings: {
        workingHours: {
          start: "09:00",
          end: "18:00"
        },
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      }
    };
  }

  getFrequencyOptions() {
    return [
      { value: 30, label: 'Cada 30 minutos' },
      { value: 45, label: 'Cada 45 minutos' },
      { value: 60, label: 'Cada 60 minutos' },
      { value: 90, label: 'Cada 90 minutos' },
      { value: 120, label: 'Cada 2 horas' }
    ];
  }

  getDurationOptions() {
    return [
      { value: 5, label: '5 minutos' },
      { value: 10, label: '10 minutos' },
      { value: 15, label: '15 minutos' },
      { value: 20, label: '20 minutos' }
    ];
  }

  generateCalendarData(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push({
        day,
        date: new Date(year, month, day),
        hasBreaks: Math.random() > 0.3, // Mock data for demonstration
        completedBreaks: Math.floor(Math.random() * 8)
      });
    }
    
    return calendar;
  }

  // Additional methods used by the component
  async getConfiguration(userId) {
    return this.getActiveBreaksConfig(userId);
  }
  
  async updateConfiguration(userId, config) {
    return this.updateActiveBreaksConfig(userId, config);
  }

  async getTodaySchedule(userId) {
    try {
      const config = await this.getActiveBreaksConfig(userId);
      const now = new Date();
      const startTime = new Date(now.toDateString() + ' ' + config.settings.workingHours.start);
      const endTime = new Date(now.toDateString() + ' ' + config.settings.workingHours.end);
      
      const schedule = [];
      let currentTime = new Date(startTime);
      
      while (currentTime < endTime) {
        currentTime = new Date(currentTime.getTime() + config.frequency * 60000);
        if (currentTime < endTime) {
          schedule.push({
            time: currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: Math.random() > 0.5 ? 'completed' : 'pending',
            duration: config.duration
          });
        }
      }
      
      return schedule;
    } catch (error) {
      throw new Error('Failed to get today schedule: ' + error.message);
    }
  }

  async getWeeklyStats(userId) {
    try {
      const stats = {
        totalBreaks: 35,
        completedBreaks: 28,
        completionRate: 80,
        averageDuration: 5.2,
        streakDays: 4,
        weeklyGoal: 40,
        dailyStats: [
          { day: 'L', breaks: 6, completed: 5 },
          { day: 'M', breaks: 6, completed: 6 },
          { day: 'X', breaks: 6, completed: 4 },
          { day: 'J', breaks: 6, completed: 5 },
          { day: 'V', breaks: 6, completed: 4 },
          { day: 'S', breaks: 5, completed: 4 },
          { day: 'D', breaks: 0, completed: 0 }
        ]
      };
      return stats;
    } catch (error) {
      throw new Error('Failed to get weekly stats: ' + error.message);
    }
  }
}
