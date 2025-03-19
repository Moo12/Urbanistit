<template>
  <div class="mt-10">
    <div id="introduction">
      <AboutMe/>
    </div>
    <!-- Projects --> 
    <div id="projects_section" class="mt-10">
      <Clients/>
    </div>

    <!-- blog posts contact me sections -->
    <div class="bg-gray-background mt-10">
      <div id="blog_section" class="w-full py-20">
        <Blog/>
      </div>
      <div class="">

      </div>
      <div id="contactme_section">
        <ContactMeWrapper/>
      </div>
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
