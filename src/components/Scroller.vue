<template>
  <div class="scroll-container">
    <div class="scroll-wrapper relative" ref="scrollWrapper"
    > 
      <div
      v-for="(item, index) in items" 
        :key="index" 
        class="scroll-item"
        :style="{ 
          backgroundImage: `url(${item.image})`,
          minWidth: scrollItemWidth + 'px',
          maxWidth: scrollItemWidth + 'px',
        }"
      >
         <!-- Default slot for custom content -->
         <slot :item="item"></slot>
        </div>
    </div>

    <button class="scroll-btn right" @click="scrollRight">
      <ChevronRight />
    </button>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

export default {
  components: { ChevronLeft, ChevronRight },
  props: {
    items: {
      type: Array,
      required: true
    },
    itemWidth: {
      type: Number,
      required: false,
      default: 350
    },
    itemGap: {
      type: Number,
      required: false,
      default: 40
    }
  },
  setup(props) {
    const scrollWrapper = ref(null);
    const scrollItemWidth = ref(props.itemWidth); // Width of each scroll item
    const gapSize = ref(props.itemGap); // Gap between scroll items in px

    // Compute scroll step (item width + gap)
    const scrollStep = computed(() => scrollItemWidth.value + gapSize.value);

    const scrollLeft = () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.scrollBy({ left: -scrollStep.value, behavior: "smooth" });
      }
    };

    const scrollRight = () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.scrollBy({ left: scrollStep.value, behavior: "smooth" });
      }
    };

    return { scrollWrapper, scrollLeft, scrollRight, scrollItemWidth, gapSize };
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
  width: 100%;
  max-width: 100%; /* Adjust as needed */
  margin: auto;
}

.scroll-wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: v-bind(gapSize + 'px'); /* Use the dynamic gap */
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 0;
  max-width: 100% ;
  white-space: nowrap;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.scroll-item {
  aspect-ratio: 0.8;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
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
