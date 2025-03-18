<template>
    <div class="scroll-container">
      <button class="scroll-btn left" @click="scrollLeft">
        <ChevronLeft />
      </button>
  
      <div class="scroll-wrapper" ref="scrollWrapper">
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          class="scroll-item"
          :style="{ backgroundImage: `url(${item.image})` }"
        >
          <router-link :to="{ name: 'Single-Blog', params: { id: item.id }}">
            <div class="title-overlay">{{ item.title }}</div>
          </router-link>
        </div>
      </div>
  
      <button class="scroll-btn right" @click="scrollRight">
        <ChevronRight />
      </button>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { ChevronLeft, ChevronRight } from "lucide-vue-next";
  
  export default {
    components: { ChevronLeft, ChevronRight },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    setup() {
      const scrollWrapper = ref(null);
  
      const scrollLeft = () => {
        if (scrollWrapper.value) {
          scrollWrapper.value.scrollBy({ left: -200, behavior: "smooth" });
        }
      };
  
      const scrollRight = () => {
        if (scrollWrapper.value) {
          scrollWrapper.value.scrollBy({ left: 200, behavior: "smooth" });
        }
      };
  
      return { scrollWrapper, scrollLeft, scrollRight };
    }
  };
  </script>
  
  <style scoped>
  .scroll-container {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
    position: relative;
  }
  
  .scroll-wrapper {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Hide scrollbar */
    -ms-overflow-style: none;
    padding: 10px 0;
    width: 100%;
  }
  
  .scroll-wrapper::-webkit-scrollbar {
    display: none;
  }
  
  .scroll-item {
    height: 400px;
    width: 500px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .title-overlay {
    background: rgba(255, 255, 255, 1);
    padding: 8px 12px;
    border-radius: 5px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    width: 100%;
  }
  
  .scroll-btn {
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    padding: 8px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s ease;
  }
  
  .scroll-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  .left {
    margin-left: 5px;
  }
  
  .right {
    margin-right: 5px;
  }
  </style>
  