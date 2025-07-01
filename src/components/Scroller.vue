<template>
  <div class="flex flex-col relative overflow-hidden w-full w-min-full justify-center">
    <!-- Loading state while validating images -->
    <div v-if="!isImageValidationComplete" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-2 text-gray-600">Validating images...</span>
    </div>
    
    <!-- Scroll container - only show when validation is complete -->
    <div v-else-if="validItems?.length > 0">
      <div
        class="flex flex-nowrap overflow-x-auto scroll-smooth w-full md:w-[95%] whitespace-nowrap scroll-wrapper"
        :class="[`w-[${scrollContainerWidthPercantage}%]`]"
        :style="{ gap: `${gapSize}px`, paddingRight: `${gapSize}px`}"
        ref="scrollWrapper"
        @scroll="onScroll"
      >
        <div
        v-for="(item, index) in validItems" 
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
      <div v-if="deviceStore.isMobile && validItems?.length > 1" class="flex justify-center items-center mt-4 gap-1">
        <span
          v-for="(item, idx) in validItems"
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

    // Check if an image URL returns a valid response
    const validateImageUrl = async (imageUrl) => {
      // If already validated, return cached result
      if (validImageUrls.value.has(imageUrl)) {
        return true;
      }

      try {
        // For relative paths, assume they're valid (they're local to the app)
        if (imageUrl.startsWith('/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
          validImageUrls.value.add(imageUrl);
          return true;
        }

        // For absolute URLs, check if they return a valid response
        const response = await fetch(imageUrl, { 
          method: 'HEAD', // Only fetch headers, not the full image
          mode: 'no-cors' // Handle CORS issues
        });
        
        // If we get here, the image is accessible
        validImageUrls.value.add(imageUrl);
        return true;
      } catch (error) {
        console.warn(`Invalid image URL: ${imageUrl}`, error);
        return false;
      }
    };

    // Validate all images in parallel
    const validateAllImages = async () => {
      console.log("validating all images")
      isImageValidationComplete.value = false;
      
      // Add null check for props.items
      if (!props.items || !Array.isArray(props.items)) {
        isImageValidationComplete.value = true;
        console.log("No items to validate");
        return;
      }
      
      const validationPromises = props.items
        .filter(item => item && item.image && typeof item.image === 'string' && item.image.trim() !== '')
        .map(async (item) => {
          const isValid = await validateImageUrl(item.image);
          return { item, isValid };
        });

      await Promise.all(validationPromises);
      isImageValidationComplete.value = true;
      console.log("valid items length", validItems.value?.length);
    };

    // Filter valid images that can be displayed
    const validItems = computed(() => {
      // Add null check for props.items
      if (!props.items || !Array.isArray(props.items)) {
        return [];
      }
      
      return props.items.filter(item => {
        // Check if item exists and has required properties
        if (!item) return false;
        
        // Check if item has an image property
        if (!item.image) return false;
        
        // Check if image is a valid string (not empty, null, or undefined)
        if (typeof item.image !== 'string' || item.image.trim() === '') return false;
        
        // Check if the image URL has been validated and is accessible
        return validImageUrls.value.has(item.image);
      });
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

    // Update current visible index based on scroll position
    const onScroll = () => {
      if (!scrollWrapper.value) return;
      
      const scrollLeft = scrollWrapper.value.scrollLeft;
      const step = scrollStep.value;
      
      // Calculate which item is most visible
      const index = Math.round(scrollLeft / step);
      currentVisibleIndex.value = Math.max(0, Math.min(index, validItems.value.length - 1));
    };

    // Watch for changes in items and re-validate
    watch(() => props.items, () => {
      if (validImageUrls.value) {
        validImageUrls.value.clear();
      }
      validateAllImages();
    }, { immediate: true });

    // Initialize device store
    onMounted(() => {
      deviceStore.initializeDevice();
    });

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
      validItems,
      isImageValidationComplete
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
