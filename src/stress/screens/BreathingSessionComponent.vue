<template>
  <div class="breathing-session-container">
    <!-- Header -->
    <div class="header" v-if="!sessionActive">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>{{ $t('stress.breathing.session') }}</h1>
    </div>

    <!-- Exercise Selection -->
    <div v-if="!sessionActive && !sessionCompleted" class="content">
      <div class="intro-section">
        <div class="intro-card">
          <h2>{{ $t('stress.breathing.findYourCalm') }}</h2>
          <p>{{ $t('stress.breathing.introDescription') }}</p>
        </div>
      </div>

      <div class="exercises-section">
        <h3>{{ $t('stress.breathing.availableExercises') }}</h3>
        <div class="exercises-grid">
          <div 
            v-for="exercise in exercises" 
            :key="exercise.id"
            class="exercise-card"
            @click="selectExercise(exercise)"
          >
            <div class="exercise-icon">
              <i class="fas fa-lungs"></i>
            </div>
            <h4>{{ exercise.name }}</h4>
            <p class="exercise-description">{{ exercise.description }}</p>
            <div class="exercise-details">
              <span class="duration">
                <i class="fas fa-clock"></i>
                {{ formatDuration(exercise.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section">
        <h3>{{ $t('stress.breathing.practiceTips') }}</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <i class="fas fa-chair"></i>
            <p>{{ $t('stress.breathing.tips.posture') }}</p>
          </div>
          <div class="tip-card">
            <i class="fas fa-volume-up"></i>
            <p>{{ $t('stress.breathing.tips.headphones') }}</p>
          </div>
          <div class="tip-card">
            <i class="fas fa-eye-slash"></i>
            <p>{{ $t('stress.breathing.tips.eyes') }}</p>
          </div>
          <div class="tip-card">
            <i class="fas fa-mobile-alt"></i>
            <p>{{ $t('stress.breathing.tips.silentMode') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Session -->
    <div v-else-if="sessionActive" class="session-container">
      <!-- Session Header -->
      <div class="session-header">
        <button class="exit-button" @click="exitSession">
          <i class="fas fa-times"></i>
        </button>
        <h2>{{ selectedExercise.name }}</h2>
        <div class="session-progress">
          <div 
            class="progress-bar" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Breathing Animation -->
      <div class="breathing-animation">
        <div 
          class="breathing-circle"
          :class="{
            'inhale': currentPhase === 'inhale',
            'hold-in': currentPhase === 'hold-in',
            'exhale': currentPhase === 'exhale',
            'hold-out': currentPhase === 'hold-out'
          }"
        >
          <div class="inner-circle">
            <div class="phase-text">{{ phaseText }}</div>
            <div class="counter">{{ counter }}</div>
          </div>
        </div>
      </div>

      <!-- Session Controls -->
      <div class="session-controls">
        <button 
          class="control-button"
          @click="toggleSession"
        >
          <i :class="sessionPaused ? 'fas fa-play' : 'fas fa-pause'"></i>
          {{ sessionPaused ? $t('stress.breathing.resume') : $t('stress.breathing.pause') }}
        </button>
        
        <div class="time-remaining">
          {{ formatTime(timeRemaining) }} {{ $t('stress.breathing.timeRemaining') }}
        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <p>{{ currentInstruction }}</p>
      </div>
    </div>

    <!-- Session Completed -->
    <div v-else-if="sessionCompleted" class="completion-container">
      <div class="completion-content">
        <div class="completion-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>{{ $t('stress.breathing.sessionCompleted') }}</h2>
        <p>{{ $t('stress.breathing.completedMessage', { duration: formatDuration(selectedExercise.duration) }) }}</p>
        
        <!-- Rating -->
        <div class="rating-section">
          <h3>{{ $t('stress.breathing.howDoYouFeel') }}</h3>
          <div class="mood-selector">
            <button 
              v-for="mood in moodOptions" 
              :key="mood.value"
              :class="{ active: selectedMood === mood.value }"
              @click="selectedMood = mood.value"
            >
              {{ mood.emoji }}
              <span>{{ mood.label }}</span>
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div class="notes-section">
          <h3>{{ $t('stress.breathing.notesOptional') }}</h3>
          <textarea 
            v-model="sessionNotes"
            :placeholder="$t('stress.breathing.notesPlaceholder')"
            rows="3"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="completion-actions">
          <button class="secondary-button" @click="startNewSession">
            {{ $t('stress.breathing.anotherSession') }}
          </button>
          <button class="primary-button" @click="saveAndFinish">
            {{ $t('stress.breathing.saveAndFinish') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Exit Confirmation Modal -->
    <div v-if="showExitModal" class="modal-overlay" @click="cancelExit">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('stress.breathing.exitConfirmation.title') }}</h3>
        <p>{{ $t('stress.breathing.exitConfirmation.message') }}</p>
        <div class="modal-actions">
          <button class="cancel-button" @click="cancelExit">{{ $t('stress.breathing.exitConfirmation.cancel') }}</button>
          <button class="confirm-button" @click="confirmExit">{{ $t('stress.breathing.exitConfirmation.exit') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * BreathingSessionComponent - Componente para sesiones de ejercicios de respiración
 * Proporciona ejercicios guiados de respiración con temporizador y seguimiento
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

export default {
  name: 'BreathingSessionComponent',
  data() {
    return {
      loading: false,
      error: null,
      // Ejercicios hardcoded (sin backend)
      exercises: [
        {
          id: 1,
          name: 'Respiración Consciente',
          description: 'Técnica básica de respiración profunda para calmar la mente',
          duration: 300, // 5 minutos en segundos
          difficulty: 'Principiante',
          instructions: [
            'Siéntate en una posición cómoda',
            'Cierra los ojos suavemente',
            'Inhala profundamente por la nariz',
            'Mantén el aire',
            'Exhala lentamente por la boca',
            'Pausa breve'
          ]
        },
        {
          id: 2,
          name: 'Respiración Cuadrada',
          description: 'Técnica de respiración en cuatro tiempos, ideal para reducir el estrés',
          duration: 240, // 4 minutos en segundos
          difficulty: 'Intermedio',
          instructions: [
            'Encuentra un lugar tranquilo',
            'Mantén la espalda recta',
            'Inhala contando hasta 4',
            'Retén el aire por 4 segundos',
            'Exhala contando hasta 4',
            'Espera 4 segundos antes de inhalar'
          ]
        },
        {
          id: 3,
          name: 'Respiración 4-7-8',
          description: 'Técnica avanzada para relajación profunda y mejor sueño',
          duration: 180, // 3 minutos en segundos
          difficulty: 'Avanzado',
          instructions: [
            'Coloca la lengua detrás de los dientes superiores',
            'Exhala completamente',
            'Inhala por la nariz contando 4',
            'Retén la respiración por 7 segundos',
            'Exhala por la boca contando 8',
            'Pausa y repite'
          ]
        }
      ],
      selectedExercise: null,
      sessionActive: false,
      sessionPaused: false,
      sessionCompleted: false,
      showExitModal: false,
      
      // Session state
      currentPhase: 'inhale', // inhale, hold-in, exhale, hold-out
      counter: 4,
      timeRemaining: 0,
      sessionTimer: null,
      phaseTimer: null,
      sessionStartTime: null,
      
      // Completion data
      selectedMood: null,
      sessionNotes: '',
      
      // Phase patterns (in seconds)
      phasePatterns: {
        1: { // Mindful Breathing
          inhale: 4,
          'hold-in': 4,
          exhale: 6,
          'hold-out': 0
        },
        2: { // Box Breathing
          inhale: 4,
          'hold-in': 4,
          exhale: 4,
          'hold-out': 4
        },
        3: { // 4-7-8 Breathing
          inhale: 4,
          'hold-in': 7,
          exhale: 8,
          'hold-out': 0
        }
      }
    }
  },
  computed: {
    progressPercentage() {
      if (!this.selectedExercise || !this.sessionStartTime) return 0;
      const elapsed = Date.now() - this.sessionStartTime;
      const total = this.selectedExercise.duration * 1000;
      return Math.min((elapsed / total) * 100, 100);
    },
    
    phaseText() {
      const texts = {
        'inhale': this.$t('stress.breathing.phases.inhale'),
        'hold-in': this.$t('stress.breathing.phases.holdIn'),
        'exhale': this.$t('stress.breathing.phases.exhale'),
        'hold-out': this.$t('stress.breathing.phases.holdOut')
      };
      return texts[this.currentPhase] || '';
    },
    
    currentInstruction() {
      if (!this.selectedExercise) return '';
      const instructions = this.selectedExercise.instructions;
      const phaseIndex = {
        'inhale': 2,
        'hold-in': 3,
        'exhale': 4,
        'hold-out': 5
      };
      return instructions[phaseIndex[this.currentPhase]] || instructions[0];
    },

    moodOptions() {
      return [
        { value: 1, emoji: '😫', label: this.$t('stress.breathing.moodOptions.veryStressed') },
        { value: 2, emoji: '😰', label: this.$t('stress.breathing.moodOptions.stressed') },
        { value: 3, emoji: '😐', label: this.$t('stress.breathing.moodOptions.neutral') },
        { value: 4, emoji: '😌', label: this.$t('stress.breathing.moodOptions.relaxed') },
        { value: 5, emoji: '😊', label: this.$t('stress.breathing.moodOptions.veryRelaxed') }
      ];
    }
  },
  mounted() {
    // Los ejercicios ya están cargados en data(), no necesita cargar del backend
  },
  beforeUnmount() {
    this.stopSession();
  },
  methods: {

    selectExercise(exercise) {
      this.selectedExercise = exercise;
      this.timeRemaining = exercise.duration;
      this.startSession();
    },

    startSession() {
      this.sessionActive = true;
      this.sessionPaused = false;
      this.sessionCompleted = false;
      this.sessionStartTime = Date.now();
      this.currentPhase = 'inhale';
      
      // Start the breathing cycle
      this.startBreathingCycle();
      
      // Start session timer
      this.sessionTimer = setTimeout(() => {
        this.completeSession();
      }, this.selectedExercise.duration * 1000);
    },

    startBreathingCycle() {
      const pattern = this.phasePatterns[this.selectedExercise.id] || this.phasePatterns[1];
      this.startPhase('inhale', pattern.inhale);
    },

    startPhase(phase, duration) {
      if (this.sessionPaused || !this.sessionActive) return;
      
      this.currentPhase = phase;
      this.counter = duration;
      
      const countDown = () => {
        if (this.sessionPaused || !this.sessionActive) return;
        
        this.counter--;
        if (this.counter > 0) {
          this.phaseTimer = setTimeout(countDown, 1000);
        } else {
          this.nextPhase();
        }
      };
      
      if (duration > 0) {
        this.phaseTimer = setTimeout(countDown, 1000);
      } else {
        this.nextPhase();
      }
    },

    nextPhase() {
      const pattern = this.phasePatterns[this.selectedExercise.id] || this.phasePatterns[1];
      const phases = ['inhale', 'hold-in', 'exhale', 'hold-out'];
      const currentIndex = phases.indexOf(this.currentPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      const nextPhase = phases[nextIndex];
      
      this.startPhase(nextPhase, pattern[nextPhase]);
    },

    toggleSession() {
      this.sessionPaused = !this.sessionPaused;
      
      if (!this.sessionPaused) {
        // Resume
        const pattern = this.phasePatterns[this.selectedExercise.id] || this.phasePatterns[1];
        this.startPhase(this.currentPhase, this.counter);
        
        // Restart session timer with remaining time
        this.sessionTimer = setTimeout(() => {
          this.completeSession();
        }, this.timeRemaining * 1000);
      } else {
        // Pause
        clearTimeout(this.phaseTimer);
        clearTimeout(this.sessionTimer);
      }
    },

    exitSession() {
      this.showExitModal = true;
    },

    confirmExit() {
      this.stopSession();
      this.resetSession();
      this.showExitModal = false;
    },

    cancelExit() {
      this.showExitModal = false;
    },

    stopSession() {
      clearTimeout(this.sessionTimer);
      clearTimeout(this.phaseTimer);
    },

    resetSession() {
      this.sessionActive = false;
      this.sessionPaused = false;
      this.sessionCompleted = false;
      this.selectedExercise = null;
      this.selectedMood = null;
      this.sessionNotes = '';
    },

    completeSession() {
      this.stopSession();
      this.sessionActive = false;
      this.sessionCompleted = true;
    },

    startNewSession() {
      this.sessionCompleted = false;
      this.selectedMood = null;
      this.sessionNotes = '';
    },

    async saveAndFinish() {
      try {
        const sessionData = {
          exerciseId: this.selectedExercise.id,
          duration: this.selectedExercise.duration,
          mood: this.selectedMood,
          notes: this.sessionNotes,
          completedAt: new Date().toISOString()
        };
        
        await this.breathingService.saveSession(1, sessionData); // User ID 1
        this.goBack();
      } catch (error) {
        console.error('Error saving session:', error);
        // Still go back even if save fails
        this.goBack();
      }
    },

    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.breathing-session-container {
  min-height: 100vh;
  background: linear-gradient(135deg, hsl(137, 19%, 30%) 0%, #5b8662 100%);
  color: white;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
}

.back-button, .exit-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover, .exit-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.retry-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
}

.content {
  padding: 0 20px 40px;
}

.intro-section {
  margin-bottom: 30px;
}

.intro-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.intro-card h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
}

.intro-card p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

.exercises-section {
  margin-bottom: 30px;
}

.exercises-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.exercises-grid {
  display: grid;
  gap: 15px;
}

.exercise-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}

.exercise-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.exercise-icon {
  text-align: center;
  margin-bottom: 15px;
}

.exercise-icon i {
  font-size: 32px;
  opacity: 0.8;
}

.exercise-card h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
}

.exercise-description {
  margin: 0 0 15px 0;
  opacity: 0.8;
  line-height: 1.4;
}

.exercise-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
}

.tips-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.tip-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.tip-card i {
  font-size: 24px;
  opacity: 0.8;
}

.tip-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

/* Session Styles */
.session-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.session-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.session-header h2 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.session-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.breathing-animation {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.breathing-circle {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease-in-out;
}

.breathing-circle.inhale {
  transform: scale(1.3);
  background: rgba(255, 255, 255, 0.2);
  animation-duration: 4s;
}

.breathing-circle.hold-in {
  transform: scale(1.3);
  background: rgba(255, 255, 255, 0.25);
}

.breathing-circle.exhale {
  transform: scale(1);
  background: rgba(255, 255, 255, 0.1);
  animation-duration: 6s;
}

.breathing-circle.hold-out {
  transform: scale(1);
  background: rgba(255, 255, 255, 0.05);
}

.inner-circle {
  text-align: center;
}

.phase-text {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.counter {
  font-size: 36px;
  font-weight: 700;
}

.session-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.control-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.time-remaining {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.8;
}

.instructions {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-top: auto;
}

.instructions p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

/* Completion Styles */
.completion-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.completion-content {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.completion-icon {
  margin-bottom: 20px;
}

.completion-icon i {
  font-size: 64px;
  color: #4CAF50;
}

.completion-content h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
}

.completion-content > p {
  margin: 0 0 30px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.rating-section,
.notes-section {
  margin-bottom: 25px;
  text-align: left;
}

.rating-section h3,
.notes-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

.mood-selector {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.mood-selector button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 20px;
}

.mood-selector button.active {
  background: rgba(255, 255, 255, 0.3);
}

.mood-selector button span {
  font-size: 10px;
  font-weight: 500;
}

.notes-section textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px;
  border-radius: 10px;
  resize: vertical;
  font-family: inherit;
}

.notes-section textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.completion-actions {
  display: flex;
  gap: 10px;
}

.primary-button,
.secondary-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-button {
  background: white;
  color: #667eea;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 30px;
  border-radius: 20px;
  max-width: 300px;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-content p {
  margin: 0 0 25px 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.cancel-button,
.confirm-button {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.confirm-button {
  background: #f44336;
  color: white;
}

@media (max-width: 768px) {
  .breathing-circle {
    width: 200px;
    height: 200px;
  }
  
  .phase-text {
    font-size: 20px;
  }
  
  .counter {
    font-size: 28px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .completion-content {
    padding: 30px 20px;
  }
  
  .mood-selector {
    flex-wrap: wrap;
  }
  
  .completion-actions {
    flex-direction: column;
  }
}
</style>
