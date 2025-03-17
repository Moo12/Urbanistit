<template>
  <div>
    <Navbar @navbarHeightUpdate="updateNavbarHeight" class="navbar-fixed"/>
      <div class="content-admin">
        <router-view/>
        <Footer />
      </div>
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
      console.log(`Updated navbar height: ${height}px`);
    };

    return { updateNavbarHeight };
  }
}

</script>


<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Hide default body scrollbar */
}

.navbar-fixed {
  position: fixed;
  margin: 0 0;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  z-index: 10000;
}

.content-admin {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  top: var(--navbar-height, 60px); /* Dynamic height from JS */
  height: calc(100vh - var(--navbar-height, 60px)); /* Takes full viewport minus navbar */
  overflow-y: auto; /* Enables vertical scrolling */
  max-width: 100%;
}


</style>
