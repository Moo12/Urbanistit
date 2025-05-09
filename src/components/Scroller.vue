<template>
  <div class="scroll-container">
    <div
      class="flex flex-nowrap overflow-x-auto scroll-smooth whitespace-nowrap w-full scroll-wrapper"
      :style="{ gap: gapSize, minWidth: '100%' }"
      ref="scrollWrapper"
    >
      <div
      v-for="(item, index) in items" 
        :key="index" 
        class="shrink-0 aspect-[0.8] bg-cover bg-center flex items-center justify-center relative rounded-md overflow-hidden cursor-pointer" ref=""
        :style="{ backgroundImage: `url(${item.image})`, width:  scrollItemWidth}"
      >
         <!-- Default slot for custom content -->
         <slot :item="item"></slot>
        </div>
    </div>

    <button class="scroll-btn right z-[1000] absolute top-1/2 right-2 -translate-y-1/2" @click="scrollRight">
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
      default: 25
    },
    itemGap: {
      type: Number,
      required: false,
      default: 2
    }
  },
  setup(props) {
    const scrollWrapper = ref(null);
    const scrollItemWidth = ref(`${props.itemWidth}%`);// Width of each scroll item
    const gapSize = ref(`${props.itemGap}%`); // Gap between scroll items in px


    console.log(`item percentage ${scrollItemWidth.value} gap percentage ${gapSize.value}`)

  // Compute scroll step (item width + gap)
  const parsePercentage = (percentStr) => parseFloat(percentStr) / 100;

  const scrollStep = computed(() => {
    if (!scrollWrapper.value) return 0;
    const containerWidth = scrollWrapper.value.getBoundingClientRect().width;
    const itemW = containerWidth * parsePercentage(props.itemWidth);
    const gap = containerWidth * parsePercentage(props.itemGap);

    console.log(`itemW ${itemW} gap ${gap}`)
    return itemW + gap;
  });

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

.scroll-wrapper::-webkit-scrollbar {
  display: none;
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
