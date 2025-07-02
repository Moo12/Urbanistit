<template>
  <div class="flex flex-col relative overflow-hidden w-full w-min-full justify-center">
    <!-- Scroll container - only show when validation is complete -->
    <div v-if="items?.length > 0">
      <div
        class="flex flex-nowrap overflow-x-auto scroll-smooth w-full md:w-[95%] whitespace-nowrap scroll-wrapper"
        :class="[`w-[${scrollContainerWidthPercantage}%]`]"
        :style="{ gap: `${gapSize}px`, paddingRight: `${gapSize}px`}"
        ref="scrollWrapper"
        @scroll="onScroll"
      >
        <div
        v-for="(item, index) in items" 
          :key="index" 
          class="shrink-0 bg-cover bg-center flex items-center justify-center relative rounded-md overflow-hidden cursor-pointer" ref=""
          :style="{backgroundImage: `url(${item.image})`, width:  scrollItemWidth}"
          :class="[`aspect-[${aspect}]`]"
          @click="$emit('click', item)"
        >
           <!-- Default slot for custom content -->
           <slot :item="item"></slot>
          
        </div>
      </div>
      <button v-if="!deviceStore.isMobile"
        class="btn rounded-full aspect-square mr-[1.25%] w-[2.5%] z-[1000] absolute top-1/2 right-0 bg-white flex items-center justify-center"
        @click="scrollRight">
        <ArrowRight :stroke-width="4" class="w-[90%] text-black-light" />
      </button>
      
      <!-- Pagination Dots for Mobile Only -->
      <div v-if="deviceStore.isMobile && items?.length > 1" class="flex justify-center items-center mt-4 gap-1">
        <span
          v-for="(item, idx) in items"
          :key="idx"
          class="inline-block w-3 h-3 rounded-full transition-colors duration-200"
          :class="{
            'bg-gray-400': currentVisibleIndex !== idx,
            'bg-black': currentVisibleIndex === idx
          }"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { useDeviceStore } from '@/stores/deviceStore'

export default {
  components: { ArrowRight },
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
    },
    aspect: {
      type: Number,
      required: false,
      default: 0.8
    }
  },
  emits: ['click'],
  setup(props) {
    const scrollWrapper = ref(null);
    const currentVisibleIndex = ref(0);
    const deviceStore = useDeviceStore();
    const validImageUrls = ref(new Set()); // Cache for validated image URLs
    const isImageValidationComplete = ref(false);

    console.log("items length", props.items?.length)
    
    const scrollItemWidth = ref(`${props.itemWidth}%`);// Width of each scroll item

    const scrollContainerWidthPercantage = 95

    const radiusPercent = `${(100 - scrollContainerWidthPercantage) / 2}%`;
    const offsetRight = radiusPercent; // same as radius

    console.log(`item percentage ${scrollItemWidth.value} gap percentage ${props.itemGap}`)

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

    const gapSize = computed(() =>{
      if (!scrollWrapper.value) return 0;
      const containerWidth = scrollWrapper.value.getBoundingClientRect().width;
      return containerWidth * parsePercentage(props.itemGap);
    })

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

    // Update current visible index based on scroll position
    const onScroll = () => {
      if (!scrollWrapper.value) return;

      const containerWidth = scrollWrapper.value.getBoundingClientRect().width;
      const itemWidth = containerWidth * parsePercentage(props.itemWidth);
      const itemsPerScreen = Math.floor(containerWidth / (itemWidth + itemWidth));
      const step = itemWidth + gapSize.value;
  
      
      // Calculate which item is most visible
      console.log("step", step)
      const index = Math.round(scrollWrapper.value.scrollLeft / step) * -1;
      console.log("index", index)
      currentVisibleIndex.value = index;

      console.log("currentVisibleIndex", currentVisibleIndex.value)
    };
    

    return { 
      scrollWrapper, 
      scrollLeft, 
      scrollRight, 
      scrollItemWidth, 
      gapSize, 
      scrollContainerWidthPercantage, 
      radiusPercent, 
      offsetRight,
      currentVisibleIndex,
      deviceStore,
      onScroll,
    };
  }
};
</script>

<style scoped>

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.scroll-btn {
  transition: background 0.2s ease;
}

</style>
