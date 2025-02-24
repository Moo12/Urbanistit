<template>
  <div class="mt-10">
    <div id="introduction">
      <AboutMe/>
    </div>
    <!-- Projects --> 
    <div id="projects_section">
      <Projects/>
    </div>

    <!-- blog posts contact me sections -->
    <div class="bg-gray-background">
      <div id="blog_section" class="w-full mt-6">
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

import Projects from '@/components/Projects.vue';
import Blog from '@/components/Blog.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'
import AboutMe from '@/components/AboutMe.vue';

export default {
  name: 'Home',
  components: {
    Projects,
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
