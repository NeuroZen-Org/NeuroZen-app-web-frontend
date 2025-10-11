<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="visible"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
      >
        <div
          :class="[
            'text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px]',
            bgColorClass
          ]"
        >
          <!-- Success Icon -->
          <svg
            v-if="type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <!-- Error Icon -->
          <svg
            v-else-if="type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <!-- Info Icon -->
          <svg
            v-else-if="type === 'info'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div>
            <p class="font-semibold">{{ message }}</p>
            <p v-if="subtitle" :class="['text-sm', textColorClass]">{{ subtitle }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ToastComponent',
  props: {
    message: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    bgColorClass() {
      return {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
      }[this.type];
    },
    textColorClass() {
      return {
        success: 'text-green-100',
        error: 'text-red-100',
        info: 'text-blue-100'
      }[this.type];
    }
  },
  methods: {
    show(duration = 2000) {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, duration);
    }
  }
}
</script>
