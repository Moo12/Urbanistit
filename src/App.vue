<template>
  <div class="content flex flex-col">
    <Navbar @navbarHeightUpdate="updateNavbarHeight" class="navbar-fixed"/>
      <!-- <div class="content-admin"> -->
      <div :class="contentClass">
        <router-view/>
        <div class="margin-half-section-top">
          <Footer/>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

import { useRoute } from 'vue-router';

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

    const routeHeightMap = {
      "/store": "12px",
      "/blog": "0px"
    };

    const navbarHeight = ref(null)

    const route = useRoute()

    const updateNavbarHeight = (height) => {
      navbarHeight.value = height;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    };

    // Compute the class for dynamic positioning
    const contentClass = computed(() => {
      const topValue = !routeHeightMap[route.path] ? `${navbarHeight.value}px` : "0px" 

      console.log("topValue class", topValue)
      return {
        'content-default': topValue !== "0px", // Normal positioning below navbar
        'content-top': topValue === "0px" // Fully at the top
      };
    });

    return { updateNavbarHeight, contentClass };
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

.content {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  max-width: 100%;
}

.content-default {
  position: relative;
  top: var(--navbar-height, 60px);
}

.content-top {
  position: relative;
  top: 0;
}


</style>
