import { HttpClient } from './HttpClient.js';

export class ResourceLibraryService {
  constructor() {
    this.httpClient = new HttpClient();
  }

  async getResources() {
    try {
      const resources = await this.httpClient.get('/resourceLibrary');
      return resources;
    } catch (error) {
      throw new Error('Failed to fetch resources: ' + error.message);
    }
  }

  async getResource(id) {
    try {
      const resources = await this.httpClient.get('/resourceLibrary');
      const resource = resources.find(r => r.id.toString() === id.toString());
      
      if (resource) {
        return resource;
      } else {
        throw new Error('Resource not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch resource: ' + error.message);
    }
  }

  async getResourcesByCategory(category) {
    try {
      const resources = await this.httpClient.get('/resourceLibrary');
      return resources.filter(resource => resource.category === category);
    } catch (error) {
      throw new Error('Failed to fetch resources by category: ' + error.message);
    }
  }

  async searchResources(query) {
    try {
      const resources = await this.httpClient.get('/resourceLibrary');
      const lowerQuery = query.toLowerCase();
      
      return resources.filter(resource =>
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.author.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      throw new Error('Failed to search resources: ' + error.message);
    }
  }

  getCategories() {
    return [
      {
        id: 'audio',
        name: 'Audio',
        description: 'Guided meditations and audio content',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAunrGe3YCJ0zxIVOP4EYtOkzqNaa1lVu2Q1giXc-bpOdRPo_sNc6Chepddi6TNtEDNwD-5EcqgZqRIyzIZ6-aQyLCmhVSUNlsZ3VlglbL-Xp47Zs3ZYcDHby6TdaEmPjUAM4m0lOWtGLm0Y9wpS6FnxFLP95JlQJXmxTRuvxtrDZQoEGll7q-1YZvdXdPSv2MXcVlzMVgUl48msKLRMdrHzWmqwY3ogg6uLAWMYh-Nc_D8fB5BsZuNILrXYSarlt-AreG8EfS4_qQ2'
      },
      {
        id: 'video',
        name: 'Video',
        description: 'Visual guides and video content',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVnF2TWw73fErpHd8yNzMClhv7ppJZwDEll4vnglE_V2_JusbKi_n55sRXt2aeJ0_RSHKp0vaTIpyH5ZtlK8kQKJF1sHoqh-szwaeAj4NufnW033sVBggnBMfYHma_kxBGxaTCXOsqAupGNKCkFAfdhrHROzZc_nzpw4XIPANxo1hi8YAuPBT7_SOzS99lJdYzQWJRifCeNQjzHBukZErTmoB2ff5mdTKlnTDw8hrJUODwbQNlQiWH4qtFBUYNvidOHmkfd6VChJSo'
      },
      {
        id: 'reading',
        name: 'Reading',
        description: 'Articles and written resources',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk9w6uWqyNE9iQrCElADq0mLbLxt28FlrJwRl-f37Eae0zPM3R9yeUPYs1RavQdXAHHxFLwhnJB6t7tJjf3SRpFYLYR5gj7ReS6vNZ7OKc2OdP9pLAjjzQATg8oz6OYZdnNKb_kpXlSLwIIkYBgNdr592b4EU1Wk55clGo2E8vjhm4nKoB_H2sh0J7OmxliPh-Mg2z-i2H8FHuwTmMWdIVlGw3d2A7bcFzUyOACPAYHAveL86yH4rr7N4ZPVI4PnQwAdXdmZKyebZq'
      },
      {
        id: 'exercises',
        name: 'Exercises',
        description: 'Physical and mental exercises',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASzCJ22_1ztNrIsCmRFtbh4Z6D340iD2ukNMvMYyVWwY7dY39EqWuDwmkWR0OI7eM_ET6XiTslt3v3e6-JVIypMi3UvbtCmw-Ned3Yw0kngrWe7A4bwiKP55oZ70tYXyKCnruJbBCn-QnMwKBdj9YCM0hxFYaWgvGYRqJWgwwjY4YGX1iMWOVVg6TRh44rzAarkLjVCU0RHGVqR2g1RqjRryo7ZL3BaHyntW7tLXBY4DgIyWD7wh7hL3wURz06HPjpmRgGUOSKbvuD'
      }
    ];
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Mock player functionality
  createPlayerSession(resourceId) {
    return {
      id: Date.now().toString(),
      resourceId,
      currentTime: 0,
      isPlaying: false,
      isLoaded: false,
      volume: 1.0,
      playbackRate: 1.0
    };
  }

  // Additional methods used by components
  async getResourceById(id) {
    return this.getResource(id);
  }

  async getRelatedResources(resourceId) {
    try {
      const resources = await this.getResources();
      const currentResource = resources.find(r => r.id.toString() === resourceId.toString());
      
      if (!currentResource) {
        return [];
      }
      
      // Return resources with similar categories or tags
      const related = resources
        .filter(r => r.id.toString() !== resourceId.toString())
        .filter(r => r.category === currentResource.category || 
                     (r.tags && currentResource.tags && 
                      r.tags.some(tag => currentResource.tags.includes(tag))))
        .slice(0, 3); // Limit to 3 related resources
      
      return related;
    } catch (error) {
      throw new Error('Failed to fetch related resources: ' + error.message);
    }
  }
}
