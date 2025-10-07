<template>
  <div class="resource-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loadingResource') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ $t('common.errorLoading') }}</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadResource">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else-if="resource" class="content">
      <!-- Header -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-actions">
          <button class="favorite-button" @click="toggleFavorite" :class="{ active: isFavorite }">
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
          <button class="share-button" @click="shareResource">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>

      <!-- Media Section -->
      <div class="media-section">
        <!-- Audio Player -->
        <div v-if="resource.category === 'audio'" class="audio-player">
          <div class="album-art">
            <img :src="resource.thumbnail" :alt="resource.title" />
            <div class="play-overlay" @click="togglePlayback">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </div>
          </div>
          
          <div class="audio-controls">
            <div class="progress-section">
              <span class="time current-time">{{ formatTime(currentTime) }}</span>
              <div class="progress-bar" @click="seekTo">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                <div class="progress-handle" :style="{ left: progressPercentage + '%' }"></div>
              </div>
              <span class="time total-time">{{ formatTime(totalTime) }}</span>
            </div>
            
            <div class="playback-controls">
              <button @click="seekBackward">
                <i class="fas fa-backward"></i>
              </button>
              <button class="play-pause-btn" @click="togglePlayback">
                <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button @click="seekForward">
                <i class="fas fa-forward"></i>
              </button>
            </div>
            
            <div class="volume-section">
              <i class="fas fa-volume-up"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="volume"
                @input="updateVolume"
                class="volume-slider"
              >
            </div>
          </div>
        </div>

        <!-- Video Player -->
        <div v-else-if="resource.category === 'video'" class="video-player">
          <div class="video-container">
            <video 
              ref="videoPlayer"
              :src="resource.videoUrl"
              :poster="resource.thumbnail"
              @loadedmetadata="onVideoLoaded"
              @timeupdate="onTimeUpdate"
              @ended="onPlaybackEnded"
              @play="isPlaying = true"
              @pause="isPlaying = false"
            ></video>
            
            <div class="video-overlay" v-if="!isPlaying" @click="togglePlayback">
              <div class="play-button">
                <i class="fas fa-play"></i>
              </div>
            </div>
          </div>
          
          <div class="video-controls">
            <div class="progress-section">
              <span class="time current-time">{{ formatTime(currentTime) }}</span>
              <div class="progress-bar" @click="seekTo">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <span class="time total-time">{{ formatTime(totalTime) }}</span>
            </div>
            
            <div class="control-buttons">
              <button @click="togglePlayback">
                <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button @click="toggleMute">
                <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
              </button>
              <button @click="toggleFullscreen">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Reading Content -->
        <div v-else-if="resource.category === 'reading'" class="reading-section">
          <div class="article-header">
            <img :src="resource.thumbnail" :alt="resource.title" class="article-image" />
          </div>
        </div>

        <!-- Exercise Content -->
        <div v-else-if="resource.category === 'exercises'" class="exercise-section">
          <div class="exercise-preview">
            <img :src="resource.thumbnail" :alt="resource.title" />
            <div class="exercise-overlay" @click="startExercise">
              <div class="start-button">
                <i class="fas fa-play"></i>
                <span>Comenzar ejercicio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Info -->
      <div class="content-info">
        <div class="title-section">
          <h1>{{ resource.title }}</h1>
          <p class="author">Por {{ resource.author }}</p>
        </div>
        
        <div class="meta-info">
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ formatDuration(resource.duration) }}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-tag"></i>
            <span>{{ getCategoryLabel(resource.category) }}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-calendar"></i>
            <span>Agregado recientemente</span>
          </div>
        </div>
        
        <div class="description">
          <h3>Descripción</h3>
          <p>{{ resource.description }}</p>
        </div>
        
        <!-- Reading Content (full text) -->
        <div v-if="resource.category === 'reading'" class="article-content">
          <div class="reading-controls">
            <div class="font-controls">
              <label>Tamaño de fuente:</label>
              <button @click="decreaseFontSize">A-</button>
              <button @click="increaseFontSize">A+</button>
            </div>
            <div class="theme-controls">
              <button @click="toggleReadingTheme" class="theme-toggle">
                <i :class="darkReadingMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
              </button>
            </div>
          </div>
          
          <div 
            class="article-text" 
            :class="{ 'dark-theme': darkReadingMode }"
            :style="{ fontSize: readingFontSize + 'px' }"
          >
            <div v-html="formattedContent"></div>
          </div>
        </div>
        
        <div class="tags-section">
          <h3>Etiquetas</h3>
          <div class="tags">
            <span v-for="tag in resource.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="actions-section">
        <button class="action-button primary" @click="markAsCompleted" v-if="!isCompleted">
          <i class="fas fa-check"></i>
          Marcar como completado
        </button>
        <button class="action-button completed" v-else disabled>
          <i class="fas fa-check-circle"></i>
          Completado
        </button>
        
        <button class="action-button secondary" @click="downloadResource" v-if="canDownload">
          <i class="fas fa-download"></i>
          Descargar
        </button>
        
        <button class="action-button secondary" @click="addToPlaylist">
          <i class="fas fa-plus"></i>
          Agregar a lista
        </button>
      </div>

      <!-- Related Resources -->
      <div class="related-section" v-if="relatedResources.length > 0">
        <h3>Recursos relacionados</h3>
        <div class="related-grid">
          <div 
            v-for="related in relatedResources" 
            :key="related.id"
            class="related-card"
            @click="navigateToResource(related.id)"
          >
            <img :src="related.thumbnail" :alt="related.title" />
            <div class="related-info">
              <h4>{{ related.title }}</h4>
              <p>{{ related.author }}</p>
              <span class="related-duration">{{ formatDuration(related.duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Messages -->
    <div v-if="showSuccessMessage" class="success-message">
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <!-- Audio element for audio resources -->
    <audio 
      ref="audioPlayer"
      v-if="resource && resource.category === 'audio'"
      :src="resource.audioUrl"
      @loadedmetadata="onAudioLoaded"
      @timeupdate="onTimeUpdate"
      @ended="onPlaybackEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></audio>
  </div>
</template>

<script>
import { ResourceLibraryService } from '../../services/ResourceLibraryService.js';

export default {
  name: 'ResourceDetailComponent',
  data() {
    return {
      loading: true,
      error: null,
      // Service instance
      resourceLibraryService: new ResourceLibraryService(),

      resource: null,
      relatedResources: [],
      
      // Playback state
      isPlaying: false,
      currentTime: 0,
      totalTime: 0,
      volume: 50,
      isMuted: false,
      
      // UI state
      isFavorite: false,
      isCompleted: false,
      showSuccessMessage: false,
      successMessage: '',
      
      // Reading mode
      darkReadingMode: false,
      readingFontSize: 16,
      
      categories: {
        'audio': 'Audio',
        'video': 'Video', 
        'reading': 'Artículo',
        'exercises': 'Ejercicio'
      }
    }
  },
  computed: {
    progressPercentage() {
      if (this.totalTime === 0) return 0;
      return (this.currentTime / this.totalTime) * 100;
    },
    
    canDownload() {
      return this.resource && ['audio', 'video'].includes(this.resource.category);
    },
    
    formattedContent() {
      if (!this.resource || !this.resource.content) return '';
      // Convert newlines to paragraphs and add basic formatting
      return this.resource.content
        .split('\n\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
    }
  },
  async mounted() {
    const resourceId = this.$route.params.id;
    await this.loadResource(resourceId);
    this.loadUserProgress();
  },
  beforeUnmount() {
    this.pausePlayback();
  },
  methods: {
    async loadResource(resourceId) {
      try {
        this.loading = true;
        this.error = null;
        
        if (!resourceId) {
          resourceId = this.$route.params.id;
        }
        
        this.resource = await this.resourceLibraryService.getResourceById(resourceId);
        
        if (!this.resource) {
          throw new Error('Recurso no encontrado');
        }
        
        // Load related resources
        this.relatedResources = await this.resourceLibraryService.getRelatedResources(resourceId);
        
      } catch (error) {
        console.error('Error loading resource:', error);
        this.error = 'No se pudo cargar el recurso';
      } finally {
        this.loading = false;
      }
    },

    loadUserProgress() {
      // Load user-specific data like favorites, completion status
      const favorites = JSON.parse(localStorage.getItem('neurozen_favorites') || '[]');
      this.isFavorite = favorites.includes(this.resource?.id);
      
      const completed = JSON.parse(localStorage.getItem('neurozen_completed') || '[]');
      this.isCompleted = completed.includes(this.resource?.id);
    },

    // Media Controls
    togglePlayback() {
      if (this.resource.category === 'audio') {
        if (this.isPlaying) {
          this.$refs.audioPlayer.pause();
        } else {
          this.$refs.audioPlayer.play();
        }
      } else if (this.resource.category === 'video') {
        if (this.isPlaying) {
          this.$refs.videoPlayer.pause();
        } else {
          this.$refs.videoPlayer.play();
        }
      }
    },

    pausePlayback() {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.pause();
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
      }
    },

    seekTo(event) {
      const progressBar = event.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      const newTime = percentage * this.totalTime;
      
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.currentTime = newTime;
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.currentTime = newTime;
      }
    },

    seekForward() {
      const newTime = Math.min(this.currentTime + 10, this.totalTime);
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.currentTime = newTime;
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.currentTime = newTime;
      }
    },

    seekBackward() {
      const newTime = Math.max(this.currentTime - 10, 0);
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.currentTime = newTime;
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.currentTime = newTime;
      }
    },

    updateVolume() {
      const volumeValue = this.volume / 100;
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.volume = volumeValue;
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.volume = volumeValue;
      }
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.muted = this.isMuted;
      }
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.muted = this.isMuted;
      }
    },

    toggleFullscreen() {
      if (this.$refs.videoPlayer) {
        if (this.$refs.videoPlayer.requestFullscreen) {
          this.$refs.videoPlayer.requestFullscreen();
        }
      }
    },

    // Event handlers
    onAudioLoaded() {
      this.totalTime = this.$refs.audioPlayer.duration;
      this.updateVolume();
    },

    onVideoLoaded() {
      this.totalTime = this.$refs.videoPlayer.duration;
      this.updateVolume();
    },

    onTimeUpdate() {
      if (this.$refs.audioPlayer) {
        this.currentTime = this.$refs.audioPlayer.currentTime;
      }
      if (this.$refs.videoPlayer) {
        this.currentTime = this.$refs.videoPlayer.currentTime;
      }
    },

    onPlaybackEnded() {
      this.isPlaying = false;
      this.currentTime = 0;
      // Auto-mark as completed when playback ends
      if (!this.isCompleted) {
        this.markAsCompleted();
      }
    },

    // Reading controls
    increaseFontSize() {
      this.readingFontSize = Math.min(this.readingFontSize + 2, 24);
    },

    decreaseFontSize() {
      this.readingFontSize = Math.max(this.readingFontSize - 2, 12);
    },

    toggleReadingTheme() {
      this.darkReadingMode = !this.darkReadingMode;
    },

    // Actions
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      
      let favorites = JSON.parse(localStorage.getItem('neurozen_favorites') || '[]');
      if (this.isFavorite) {
        favorites.push(this.resource.id);
        this.showSuccess('Agregado a favoritos');
      } else {
        favorites = favorites.filter(id => id !== this.resource.id);
        this.showSuccess('Removido de favoritos');
      }
      localStorage.setItem('neurozen_favorites', JSON.stringify(favorites));
    },

    markAsCompleted() {
      this.isCompleted = true;
      
      let completed = JSON.parse(localStorage.getItem('neurozen_completed') || '[]');
      if (!completed.includes(this.resource.id)) {
        completed.push(this.resource.id);
        localStorage.setItem('neurozen_completed', JSON.stringify(completed));
      }
      
      this.showSuccess('Recurso marcado como completado');
    },

    shareResource() {
      if (navigator.share) {
        navigator.share({
          title: this.resource.title,
          text: this.resource.description,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        this.showSuccess('Enlace copiado al portapapeles');
      }
    },

    downloadResource() {
      const url = this.resource.audioUrl || this.resource.videoUrl;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = this.resource.title;
        link.click();
        this.showSuccess('Descarga iniciada');
      }
    },

    addToPlaylist() {
      // Mock implementation
      this.showSuccess('Agregado a tu lista de reproducción');
    },

    startExercise() {
      // For exercise type resources, start the exercise
      this.showSuccess('Ejercicio iniciado');
    },

    // Utilities
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
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    getCategoryLabel(category) {
      return this.categories[category] || category;
    },

    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    },

    navigateToResource(resourceId) {
      this.$router.push(`/resources/${resourceId}`);
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.resource-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
  padding-bottom: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.favorite-button,
.share-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-button.active {
  background: #f44336;
}

.favorite-button:hover,
.share-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Media Players */
.media-section {
  margin-bottom: 30px;
}

.audio-player {
  padding: 20px;
}

.album-art {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 30px;
  border-radius: 20px;
  overflow: hidden;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.play-overlay:hover {
  background: white;
  transform: translate(-50%, -50%) scale(1.1);
}

.audio-controls {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.time {
  font-size: 14px;
  font-weight: 500;
  min-width: 45px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.1s ease;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.playback-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.playback-controls button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.play-pause-btn {
  width: 60px !important;
  height: 60px !important;
  background: white !important;
  color: #667eea !important;
  font-size: 20px;
}

.playback-controls button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-slider {
  flex: 1;
  max-width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

/* Video Player */
.video-player {
  padding: 20px;
}

.video-container {
  position: relative;
  background: black;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.video-container video {
  width: 100%;
  height: auto;
  max-height: 400px;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-button {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.video-controls {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.control-buttons button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-buttons button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Reading and Exercise Sections */
.reading-section,
.exercise-section {
  padding: 20px;
}

.article-header,
.exercise-preview {
  position: relative;
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.article-image,
.exercise-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.start-button {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  padding: 15px 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

/* Content Info */
.content-info {
  padding: 0 20px;
}

.title-section {
  margin-bottom: 20px;
}

.title-section h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}

.author {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
  font-weight: 500;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.description {
  margin-bottom: 25px;
}

.description h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
}

.description p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
}

/* Reading Controls */
.reading-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.font-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.font-controls label {
  font-size: 14px;
  font-weight: 500;
}

.font-controls button,
.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.article-text {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 30px;
  border-radius: 15px;
  line-height: 1.8;
  margin-bottom: 25px;
}

.article-text.dark-theme {
  background: rgba(0, 0, 0, 0.8);
  color: #e0e0e0;
}

/* Tags */
.tags-section {
  margin-bottom: 30px;
}

.tags-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

/* Actions */
.actions-section {
  padding: 0 20px;
  margin-bottom: 40px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 150px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.action-button.primary {
  background: white;
  color: #667eea;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-button.completed {
  background: #4CAF50;
  color: white;
  opacity: 0.8;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Related Resources */
.related-section {
  padding: 0 20px;
}

.related-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.related-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.related-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.related-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.related-info {
  padding: 15px;
}

.related-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.related-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.8;
}

.related-duration {
  font-size: 12px;
  opacity: 0.7;
}

/* Success Message */
.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

.success-content {
  background: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .album-art {
    width: 250px;
    height: 250px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .action-button {
    min-width: auto;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .reading-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .font-controls {
    justify-content: center;
  }
}
</style>
