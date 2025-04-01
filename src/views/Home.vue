<template>
  <div class="mt-16">
    <div id="introduction">
      <AboutMe/>
    </div>
    <!-- Projects --> 
    <div id="projects_section" class="mt-16">
      <Clients/>
    </div>

    <!-- blog posts contact me sections -->
    <div id="blog_section" class="w-full py-20 bg-black mt-16">
      <Blog/>
    </div>
    <div id="contactme_section" class="mt-16">
      <ContactMeWrapper/>
    </div>
  </div>
  <!-- preview section -->
</template>

<script>

import {onMounted, watch, nextTick} from 'vue';
import { useRoute } from 'vue-router';

import Clients from '@/components/Clients.vue';
import Blog from '@/components/Blog.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'
import AboutMe from '@/components/AboutMe.vue';

export default {
  name: 'Home',
  components: {
    Clients,
    Blog,
    ContactMeWrapper,
    AboutMe,
  },
  setup(){
      const route = useRoute()

      const scrollToHash = () => {
      nextTick(() => {
        const hash = window.location.hash;
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    };

    onMounted(() => {
      scrollToHash();
    });

    watch(route, () => {
      scrollToHash();
    });
  }


}
</script>
