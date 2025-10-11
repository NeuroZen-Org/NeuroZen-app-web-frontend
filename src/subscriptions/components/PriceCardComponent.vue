<template>
  <div
    :class="[
      'bg-white rounded-2xl shadow-sm p-8 flex flex-col',
      isAdvanced ? 'border-2 border-black' : ''
    ]"
  >
    <h3 class="text-2xl font-semibold text-green-600 mb-2">{{ name }}</h3>
    <p class="text-gray-600 mb-4">{{ subtitle }}</p>
    <p class="text-3xl font-bold text-gray-800 mb-6">{{ price }}</p>

    <ul class="text-left space-y-2 mb-8 text-gray-600">
      <li v-for="(feature, index) in features" :key="index">
        ✔️ {{ feature }}
      </li>
    </ul>
    
    <button
      @click="handlePurchase"
      class="mt-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
    >
      {{ $t('subscriptions.plans.getplan') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PriceCardComponent',
  props: {
    name: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    features: {
      type: Array,
      required: true
    },
    isAdvanced: {
      type: Boolean,
      default: false
    },
    planKey: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    handlePurchase() {
      // Use planKey if provided, otherwise try to derive it from the name
      let key = this.planKey;
      
      if (!key) {
        // Try to match the translated name to get the key
        const basicNames = [this.$t('subscriptions.plans.basic.name'), 'Basic', 'Básico'];
        const advancedNames = [this.$t('subscriptions.plans.advanced.name'), 'Advanced', 'Avanzado'];
        const professionalNames = [this.$t('subscriptions.plans.professional.name'), 'Professional', 'Profesional'];
        
        if (basicNames.includes(this.name)) {
          key = 'basic';
        } else if (advancedNames.includes(this.name)) {
          key = 'advanced';
        } else if (professionalNames.includes(this.name)) {
          key = 'professional';
        }
      }
      
      const purchaseUrl = `/subscriptions/purchase?plan=${encodeURIComponent(key)}&price=${encodeURIComponent(this.price)}`;
      this.$router.push(purchaseUrl);
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
