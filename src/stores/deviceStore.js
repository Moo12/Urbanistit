import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  // State
  state: () => ({
    deviceType: 'desktop', // 'mobile', 'tablet', 'desktop'
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isInitialized: false
  }),

  // Getters
  getters: {
    isMobile: (state) => state.deviceType === 'mobile',
    isTablet: (state) => state.deviceType === 'tablet',
    isDesktop: (state) => state.deviceType === 'desktop'
  },

  // Actions
  actions: {
    updateDeviceType() {
      if (typeof window === 'undefined') return
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      this.screenWidth = width
      this.screenHeight = height

      if (width < 768) {
        this.deviceType = 'mobile'
      } else if (width >= 768 && width < 1024) {
        this.deviceType = 'tablet'
      } else {
        this.deviceType = 'desktop'
      }
    },

    initializeDevice() {
      if (this.isInitialized || typeof window === 'undefined') return
      
      this.updateDeviceType()
      window.addEventListener('resize', this.updateDeviceType)
      this.isInitialized = true
    },

    cleanupDevice() {
      if (!this.isInitialized || typeof window === 'undefined') return
      
      window.removeEventListener('resize', this.updateDeviceType)
      this.isInitialized = false
    }
  }
}) 