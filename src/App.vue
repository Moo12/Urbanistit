<template>
  <div class="content">
    <Navbar @navbarHeightUpdate="updateNavbarHeight" class="navbar-fixed"/>
      <!-- <div class="content-admin"> -->
      <div>
        <router-view/>
      </div>
      <Footer />
  </div>
</template>

<script>
import { ref } from 'vue'

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

    const navbarHeight = ref(null)

    const updateNavbarHeight = (height) => {
      navbarHeight.value = height;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    };

    return { updateNavbarHeight };
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
  z-index: 10000;
}

.content {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  max-width: 100%;
  top: var(--navbar-height, 60px); /* Dynamic height from JS */
  height: calc(100vh - var(--navbar-height, 60px)); /* Takes full viewport minus navbar */
}


</style>
