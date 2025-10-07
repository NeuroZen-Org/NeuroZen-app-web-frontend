<template>
  <div class="resource-library-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>{{ $t('stress.management.resourceLibrary.title') }}</h1>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Buscar recursos..."
          @input="performSearch"
        >
        <button v-if="searchQuery" class="clear-search" @click="clearSearch">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="filters">
        <button 
          v-for="category in categories" 
          :key="category.value"
          :class="{ active: selectedCategory === category.value }"
          @click="selectCategory(category.value)"
        >
          <i :class="category.icon"></i>
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loadingResources') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ $t('common.errorLoading') }}</h3>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadResources">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else class="content">
      <!-- Results Info -->
      <div class="results-info" v-if="searchQuery || selectedCategory !== 'all'">
        <p>
          {{ filteredResources.length }} resultado{{ filteredResources.length !== 1 ? 's' : '' }}
          <span v-if="searchQuery"> para "{{ searchQuery }}"</span>
          <span v-if="selectedCategory !== 'all'"> en {{ getCategoryLabel(selectedCategory) }}</span>
        </p>
        <button class="clear-filters" @click="clearFilters" v-if="searchQuery || selectedCategory !== 'all'">
          Limpiar filtros
        </button>
      </div>

      <!-- No Results -->
      <div v-if="filteredResources.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No se encontraron recursos</h3>
        <p>Intenta con otros términos de búsqueda o categorías diferentes.</p>
      </div>

      <!-- Resources Grid -->
      <div v-else class="resources-grid">
        <div 
          v-for="resource in filteredResources" 
          :key="resource.id"
          class="resource-card"
          @click="openResource(resource)"
        >
          <div class="resource-thumbnail">
            <img :src="resource.thumbnail" :alt="resource.title" />
            <div class="resource-type">
              <i :class="getTypeIcon(resource.category)"></i>
            </div>
            <div class="resource-duration">
              {{ formatDuration(resource.duration) }}
            </div>
          </div>
          
          <div class="resource-content">
            <h3>{{ resource.title }}</h3>
            <p class="resource-author">{{ resource.author }}</p>
            <p class="resource-description">{{ resource.description }}</p>
            
            <div class="resource-tags">
              <span 
                v-for="tag in resource.tags.slice(0, 3)" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Section -->
      <div v-if="!searchQuery && selectedCategory === 'all'" class="featured-section">
        <h2>Recursos destacados</h2>
        <div class="featured-grid">
          <div 
            v-for="resource in featuredResources" 
            :key="resource.id"
            class="featured-card"
            @click="openResource(resource)"
          >
            <div class="featured-image">
              <img :src="resource.thumbnail" :alt="resource.title" />
              <div class="play-overlay">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="featured-content">
              <h4>{{ resource.title }}</h4>
              <p>{{ resource.author }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Categories -->
      <div v-if="!searchQuery && selectedCategory === 'all'" class="quick-categories">
        <h2>Explorar por categoría</h2>
        <div class="category-cards">
          <div 
            v-for="category in categories.filter(c => c.value !== 'all')" 
            :key="category.value"
            class="category-card"
            @click="selectCategory(category.value)"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h4>{{ category.label }}</h4>
            <p>{{ getCategoryCount(category.value) }} recursos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Viewed (if user has history) -->
    <div v-if="recentlyViewed.length > 0 && !searchQuery" class="recent-section">
      <h2>Vistos recientemente</h2>
      <div class="recent-grid">
        <div 
          v-for="resource in recentlyViewed" 
          :key="resource.id"
          class="recent-card"
          @click="openResource(resource)"
        >
          <img :src="resource.thumbnail" :alt="resource.title" />
          <div class="recent-info">
            <h5>{{ resource.title }}</h5>
            <p>{{ resource.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ResourceLibraryService } from '../../services/ResourceLibraryService.js';

export default {
  name: 'ResourceLibraryComponent',
  data() {
    return {
      loading: true,
      error: null,
      // Service instance
      resourceLibraryService: new ResourceLibraryService(),
      resources: [],
      filteredResources: [],
      searchQuery: '',
      selectedCategory: 'all',
      recentlyViewed: [],
      searchTimeout: null,
      
      categories: [
        { value: 'all', label: 'Todos', icon: 'fas fa-th' },
        { value: 'audio', label: 'Audio', icon: 'fas fa-headphones' },
        { value: 'video', label: 'Video', icon: 'fas fa-play-circle' },
        { value: 'reading', label: 'Lectura', icon: 'fas fa-book-open' },
        { value: 'exercises', label: 'Ejercicios', icon: 'fas fa-dumbbell' }
      ]
    }
  },
  computed: {
    featuredResources() {
      return this.resources.slice(0, 3);
    }
  },
  async mounted() {
    await this.loadResources();
    this.loadRecentlyViewed();
  },
  methods: {
    async loadResources() {
      try {
        this.loading = true;
        this.error = null;
        this.resources = await this.resourceLibraryService.getResources();
        this.filteredResources = [...this.resources];
      } catch (error) {
        console.error('Error loading resources:', error);
        this.error = 'No se pudieron cargar los recursos';
      } finally {
        this.loading = false;
      }
    },

    loadRecentlyViewed() {
      // Load from localStorage or service
      const recent = localStorage.getItem('neurozen_recent_resources');
      if (recent) {
        this.recentlyViewed = JSON.parse(recent);
      }
    },

    performSearch() {
      // Debounce search
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.filterResources();
      }, 300);
    },

    filterResources() {
      let filtered = [...this.resources];

      // Filter by category
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(resource => resource.category === this.selectedCategory);
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(resource => 
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.author.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      this.filteredResources = filtered;
    },

    selectCategory(category) {
      this.selectedCategory = category;
      this.filterResources();
    },

    clearSearch() {
      this.searchQuery = '';
      this.filterResources();
    },

    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.filterResources();
    },

    getCategoryLabel(value) {
      const category = this.categories.find(c => c.value === value);
      return category ? category.label.toLowerCase() : value;
    },

    getCategoryCount(category) {
      return this.resources.filter(resource => resource.category === category).length;
    },

    getTypeIcon(category) {
      const icons = {
        'audio': 'fas fa-headphones',
        'video': 'fas fa-play-circle',
        'reading': 'fas fa-book-open',
        'exercises': 'fas fa-dumbbell'
      };
      return icons[category] || 'fas fa-file';
    },

    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (minutes > 0) {
        return `${minutes}m`;
      }
      return `${remainingSeconds}s`;
    },

    openResource(resource) {
      // Add to recently viewed
      this.addToRecentlyViewed(resource);
      
      // Navigate to resource detail
      this.$router.push(`/resources/${resource.id}`);
    },

    addToRecentlyViewed(resource) {
      let recent = [...this.recentlyViewed];
      
      // Remove if already exists
      recent = recent.filter(r => r.id !== resource.id);
      
      // Add to beginning
      recent.unshift(resource);
      
      // Limit to 5 items
      recent = recent.slice(0, 5);
      
      this.recentlyViewed = recent;
      localStorage.setItem('neurozen_recent_resources', JSON.stringify(recent));
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.resource-library-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  display: flex;
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
  margin-right: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.search-section {
  padding: 0 20px 20px;
}

.search-bar {
  position: relative;
  margin-bottom: 20px;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 16px;
  backdrop-filter: blur(10px);
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
}

.filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.filters button {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters button.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.filters button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.25);
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

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.results-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.clear-filters {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-results h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
}

.no-results p {
  margin: 0;
  opacity: 0.8;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.resource-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}

.resource-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-5px);
}

.resource-thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.resource-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-type {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.resource-duration {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.resource-content {
  padding: 20px;
}

.resource-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.resource-author {
  margin: 0 0 12px 0;
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

.resource-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.featured-section,
.quick-categories,
.recent-section {
  margin-bottom: 40px;
}

.featured-section h2,
.quick-categories h2,
.recent-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.featured-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.featured-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.featured-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.featured-image img {
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.featured-content {
  padding: 15px;
}

.featured-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.featured-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.category-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.category-icon {
  margin-bottom: 15px;
}

.category-icon i {
  font-size: 32px;
  opacity: 0.8;
}

.category-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.recent-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.recent-card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.recent-card img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.recent-info {
  padding: 12px;
}

.recent-info h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.recent-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .resource-library-container {
    padding-bottom: 20px;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .featured-grid,
  .category-cards,
  .recent-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .results-info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .filters {
    justify-content: center;
  }
}
</style>
