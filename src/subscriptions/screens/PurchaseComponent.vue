<template>
  <div class="purchase-container">
    <!-- Toast Notification -->
    <ToastComponent
      ref="toast"
      :message="$t('subscriptions.purchase.success')"
      :subtitle="$t('subscriptions.purchase.redirecting')"
      type="success"
    />

    <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            {{ $t('subscriptions.purchase.title') }}
          </h1>
          <p class="text-gray-600">
            {{ $t('subscriptions.purchase.description') }}
          </p>
        </div>

        <!-- Plan Selected -->
        <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-500 mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                {{ planName }}
              </h2>
              <p class="text-gray-600">{{ $t('subscriptions.purchase.plan') }}</p>
            </div>

            <div class="text-right">
              <p class="text-3xl font-bold text-green-600">
                {{ planPrice }}
              </p>
              <p class="text-sm text-gray-500">{{ $t('subscriptions.purchase.perMonth') }}</p>
            </div>
          </div>
        </div>

        <!-- Purchase Form -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">
            {{ $t('subscriptions.purchase.paymentInfo') }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Personal Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('subscriptions.purchase.form.name') }}
                </label>
                <input
                  type="text"
                  id="firstName"
                  v-model="form.firstName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :placeholder="$t('subscriptions.purchase.form.namePlaceholder')"
                />
              </div>
              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('subscriptions.purchase.form.lastName') }}
                </label>
                <input
                  type="text"
                  id="lastName"
                  v-model="form.lastName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :placeholder="$t('subscriptions.purchase.form.lastNamePlaceholder')"
                />
              </div>
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t('subscriptions.purchase.form.email') }}
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                :placeholder="$t('subscriptions.purchase.form.emailPlaceholder')"
              />
            </div>

            <!-- Card Information -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">
                {{ $t('subscriptions.purchase.cardInfo') }}
              </h4>

              <div class="space-y-4">
                <div>
                  <label
                    for="cardNumber"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {{ $t('subscriptions.purchase.form.card') }}
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    v-model="form.cardNumber"
                    @input="formatCardNumber"
                    required
                    maxlength="19"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    :placeholder="$t('subscriptions.purchase.form.cardPlaceholder')"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="expiry"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {{ $t('subscriptions.purchase.form.expiry') }}
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      v-model="form.expiry"
                      @input="formatExpiry"
                      required
                      maxlength="5"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      :placeholder="$t('subscriptions.purchase.form.expiryPlaceholder')"
                    />
                  </div>
                  <div>
                    <label
                      for="cvv"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {{ $t('subscriptions.purchase.form.cvv') }}
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      v-model="form.cvv"
                      @input="formatCVV"
                      required
                      maxlength="4"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      :placeholder="$t('subscriptions.purchase.form.cvvPlaceholder')"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {{ $t('subscriptions.purchase.form.submit') }}
            </button>
          </form>

          <!-- Security Info -->
          <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>{{ $t('subscriptions.purchase.securePayment') }}</span>
          </div>
        </div>

        <!-- Back Link -->
        <div class="text-center mt-8">
          <router-link
            to="/subscriptions"
            class="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            ← {{ $t('subscriptions.purchase.backToPlans') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToastComponent from '../components/ToastComponent.vue';

export default {
  name: 'PurchaseComponent',
  components: {
    ToastComponent
  },
  data() {
    return {
      planKey: '',
      planPrice: '',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      }
    }
  },
  computed: {
    planName() {
      if (!this.planKey) return this.$t('subscriptions.purchase.notSpecified');
      
      // Normalize the plan key to lowercase for comparison
      const normalizedKey = this.planKey.toLowerCase().trim();
      
      // Map plan keys to translation keys
      const planMap = {
        'basic': 'subscriptions.plans.basic.name',
        'básico': 'subscriptions.plans.basic.name',
        'advanced': 'subscriptions.plans.advanced.name',
        'avanzado': 'subscriptions.plans.advanced.name',
        'professional': 'subscriptions.plans.professional.name',
        'profesional': 'subscriptions.plans.professional.name'
      };
      
      const translationKey = planMap[normalizedKey];
      
      if (translationKey) {
        return this.$t(translationKey);
      }
      
      // If no match found, return the original key
      return this.planKey;
    }
  },
  mounted() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.planKey = urlParams.get('plan') || '';
    this.planPrice = urlParams.get('price') || '$0';
    
    // Debug: log what we received
    console.log('Plan key received:', this.planKey);
    console.log('Plan price received:', this.planPrice);
    
    // Update page title
    document.title = `${this.$t('subscriptions.purchase.title')} - NeuroZen`;
  },
  methods: {
    formatCardNumber() {
      let value = this.form.cardNumber.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      this.form.cardNumber = formattedValue;
    },
    formatExpiry() {
      let value = this.form.expiry.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      this.form.expiry = value;
    },
    formatCVV() {
      this.form.cvv = this.form.cvv.replace(/\D/g, '');
    },
    handleSubmit() {
      // Show toast
      this.$refs.toast.show(2000);
      
      // Redirect to dashboard after toast
      setTimeout(() => {
        this.$router.push('/dashboard');
      }, 2300);
    }
  }
}
</script>

<style scoped>
.purchase-container {
  min-height: 100vh;
}
</style>
