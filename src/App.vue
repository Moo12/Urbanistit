<template>
  <div class="ridection">
    <Navbar/>
    <div class="content">
      <router-view/>
    </div>
  </div>
  <div>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer
  }
}

</script>


<style>
.content{
  margin: 0 0;
  max-width: auto;
  padding: 0;
}

body.rtl {
  direction: rtl;
  text-align: right;
}

</style>
