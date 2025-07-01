<template>
  <div class="content flex flex-col" dir="rtl">
    <Navbar class="min-h-8vh md:min-h-10vh" :class="navbarClass"/>
      <!-- <div class="content-admin"> -->
    <div :class="contentClass" class="max-w-100vw overflow-x-hidden">
      <router-view/>
      <div class="margin-half-section-top">
        <Footer/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';
import { useDeviceStore } from '@/stores/deviceStore';

import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import useGeneralContentMetadata from './composables/fetchGeneralContent';

export default {
  components: {
    Navbar,
    Footer
  },
  setup(){
    useGeneralContentMetadata({ blog: "categories"})

    const deviceStore = useDeviceStore();
    const navbarHeight = ref(null)

    const route = useRoute()

    // Get navbar layout from route meta
    const navbarLayout = computed(() => {
      return route.meta?.navbarLayout || 'fixed'; // Default to fixed if not specified
    });
  
    // Compute navbar class based on layout mode
    const navbarClass = computed(() => {
      if (navbarLayout.value === 'stacked') {
        return 'navbar-stacked'; // 20vh height, relative positioning
      } else {
        return 'navbar-fixed'; // Fixed positioning
      }
    });

    // Compute the class for dynamic positioning
    const contentClass = computed(() => {
      if (navbarLayout.value === 'stacked') {
        return 'content-stacked'; // Router-view starts below the 20vh navbar
      } else {
        return 'content-fixed'; // Router-view starts at y-0 with fixed navbar overlay
      }
    });

    onMounted(() => {
      // Initialize device store when app mounts
      deviceStore.initializeDevice()
    })

    onUnmounted(() => {
      // Cleanup device store when app unmounts
      deviceStore.cleanupDevice()
    })

    return { 
      contentClass, 
      navbarClass,
      navbarLayout 
    };
  }
}

</script>


<style>

.navbar-fixed {
  position: fixed;

  margin: 0 0;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  z-index: 100;
}

.navbar-stacked {
  position: relative;
  width: 100%;
  align-items: center;
  z-index: 100;
}

.content {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  max-width: 100%;
}

.content-stacked {
  position: relative;
  top: 0; /* Router-view starts below the 20vh navbar */
}

.content-fixed {
  position: relative;
  top: 0; /* Router-view starts at y-0 with fixed navbar overlay */
}

/* Legacy classes for backward compatibility */
.content-default {
  position: relative;
  top: var(--navbar-height, 60px);
}

.content-top {
  position: relative;
  top: 0;
}

</style>
