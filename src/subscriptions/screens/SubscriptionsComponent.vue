<template>
  <div class="subscriptions-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>{{ $t('subscriptions.plans.title') }}</h1>
    </div>

    <!-- Section Content -->
    <div class="plans-section">
      <div class="section-header">
        <h2>{{ $t('subscriptions.plans.title') }}</h2>
        <p class="text-gray-600 max-w-2xl mx-auto mb-6">
          {{ $t('subscriptions.plans.subtitle') }}
        </p>
      </div>

      <!-- Price Cards Grid -->
      <div class="plans-grid">
        <PriceCardComponent
          :name="$t('subscriptions.plans.basic.name')"
          :price="$t('subscriptions.plans.basic.price')"
          :subtitle="$t('subscriptions.plans.basic.subtitle')"
          :features="basicFeatures"
        />
        <PriceCardComponent
          :name="$t('subscriptions.plans.advanced.name')"
          :price="$t('subscriptions.plans.advanced.price')"
          :subtitle="$t('subscriptions.plans.advanced.subtitle')"
          :features="advancedFeatures"
          :isAdvanced="true"
        />
        <PriceCardComponent
          :name="$t('subscriptions.plans.professional.name')"
          :price="$t('subscriptions.plans.professional.price')"
          :subtitle="$t('subscriptions.plans.professional.subtitle')"
          :features="professionalFeatures"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PriceCardComponent from '../components/PriceCardComponent.vue';

export default {
  name: 'SubscriptionsComponent',
  components: {
    PriceCardComponent
  },
  computed: {
    basicFeatures() {
      return [
        this.$t('subscriptions.plans.feature.1'),
        this.$t('subscriptions.plans.feature.2'),
        this.$t('subscriptions.plans.feature.3'),
        this.$t('subscriptions.plans.feature.4'),
        this.$t('subscriptions.plans.feature.5'),
        this.$t('subscriptions.plans.feature.6')
      ];
    },
    advancedFeatures() {
      return [
        this.$t('subscriptions.plans.feature.7'),
        this.$t('subscriptions.plans.feature.8'),
        this.$t('subscriptions.plans.feature.9'),
        this.$t('subscriptions.plans.feature.10'),
        this.$t('subscriptions.plans.feature.11'),
        this.$t('subscriptions.plans.feature.12'),
        this.$t('subscriptions.plans.feature.13'),
        this.$t('subscriptions.plans.feature.14')
      ];
    },
    professionalFeatures() {
      return [
        this.$t('subscriptions.plans.feature.15'),
        this.$t('subscriptions.plans.feature.16'),
        this.$t('subscriptions.plans.feature.17'),
        this.$t('subscriptions.plans.feature.18'),
        this.$t('subscriptions.plans.feature.19'),
        this.$t('subscriptions.plans.feature.20'),
        this.$t('subscriptions.plans.feature.21')
      ];
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.subscriptions-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #104914 0%, #aeebab 100%);
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 16px;
  color: white;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 18px;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.plans-section {
  padding: 40px 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
  color: white;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.section-header p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  justify-items: center;
}

@media (min-width: 1024px) {
  .plans-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 22px;
  }

  .section-header h2 {
    font-size: 2rem;
  }
}
</style>
