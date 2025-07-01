<template>
    <div
      class="fixed inset-0 bg-gray-background z-[1000] h-[100vh] w-[100vw] flex items-center justify-center">
      <!-- Close Button -->
      <button
      @click="$emit('close')"
      class="z-[1000] absolute top-4 left-4 font-black text-black rounded-full w-10 h-10 flex items-center justify-center transition"
      >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="6"
      d="M6 18L18 6M6 6l12 12"/>
    </svg>
  </button>
  
  <div class="w-full max-w-screen-xl grid grid-cols-12  gap-2 items-center mx-[5px] md:mx-[45px] h-[90vh] my-auto">
    <!-- Left Arrow -->
    <div v-if="!deviceStore.isMobile" class="flex justify-center items-center">
      <button
      @click="prevImage"
      class="bg-white rounded-full w-12 h-12 flex items-center justify-center text-black-light btn transition"
      >
      <ArrowRight/>
     </button>
    </div>
    <!-- Image -->
    <div class="md:col-span-10 col-span-12 relative rounded-lg flex justify-center items-center overflow-hidden h-full ">
      <img
        :src="images[currentIndex].image"
        @wheel="throttledOnScroll"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        alt="Image"
        class="rounded-lg block md:h-full w-full h-auto md:w-auto object-cover transition duration-300 touch-none"
        style="touch-action: none;"
        />
        <div v-if="deviceStore.isMobile" class="flex absolute bottom-0 justify-center items-center  gap-1 col-span-12">
          <span
            v-for="(img, idx) in images"
            :key="idx"
            class="inline-block w-3 h-3 rounded-full transition"
            :class="{
              'bg-gray-400': currentIndex !== idx,
              'bg-black': currentIndex === idx
            }"
          ></span>
        </div>
    </div>
    
    <!-- Right Arrow -->
      <div v-if="!deviceStore.isMobile" class="flex justify-center items-center ">
        <button
          @click="nextImage"
          class="bg-white rounded-full  w-12 h-12 flex items-center justify-center text-black-light btn transition"
        >
        <ArrowLeft/>
        </button>
      </div>
      <!-- Pagination Dots -->
    </div>

</div>
</template>
  
  <script setup>
  import { ref } from 'vue'
  import { ArrowRight, ArrowLeft } from "lucide-vue-next";
  import { useDeviceStore } from '@/stores/deviceStore'

  
  const props = defineProps({
    images: {
      type: Array,
      required: true
    },
    index: {
        type: Array,
        required: false
    }
  })
  
  const emit = defineEmits(['close'])
  
  const deviceStore = useDeviceStore()

  const currentIndex = ref(props.index || 0)
  
  const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }
  
  const prevImage = () => {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  }

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
const onScroll = (event) => {
  console.log( "onScroll", event.deltaX)
  // Check if the primary scroll direction is horizontal
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    // If scrolling right (positive deltaX), go to the next image
    if (event.deltaX > 0) {
      nextImage();
    } 
    // If scrolling left (negative deltaX), go to the previous image
    else if (event.deltaX < 0) {
      prevImage();
    }
    // Prevent default horizontal scrolling behavior of the page/component
    //event.preventDefault();
  }
  // If vertical scroll (deltaY) is dominant or equal, the event is ignored,
  // allowing the browser's default vertical scroll behavior to proceed on the underlying page
  // (if the gallery is not full height or if an overflow exists).
  // For a full-screen overlay, this effectively means vertical scrolls do nothing.
}

// Apply throttling to the onScroll function to limit its execution rate.
// This helps prevent rapid, unintended image changes during continuous scrolling.
const throttledOnScroll = throttle(onScroll, 400); // 200ms debounce time, adjust as needed for responsiveness

// Variables to track touch start position for swipe detection
let touchStartX = 0

/**
 * Records the starting X coordinate of a touch event for swipe detection.
 * @param {TouchEvent} e - The touch event object.
 */
const onTouchStart = (e) => {
  console.log("onTouchStart", e)
  // Prevent default behavior to avoid conflicts
  e.preventDefault()
  if (e.changedTouches && e.changedTouches.length > 0) {
    touchStartX = e.changedTouches[0].screenX
  }
}

/**
 * Detects swipe direction based on touch end position and triggers image navigation.
 * @param {TouchEvent} e - The touch event object.
 */
const onTouchEnd = (e) => {
  console.log("onTouchEnd", e)
  // Prevent default behavior to avoid conflicts
  e.preventDefault()
  
  if (!e.changedTouches || e.changedTouches.length === 0) {
    return
  }
  
  const endX = e.changedTouches[0].screenX
  const swipeThreshold = 50; // Minimum horizontal pixel distance for a swipe to be recognized

  console.log("touchStartX", touchStartX)
  console.log("endX", endX)

  // If swiped left (endX is significantly less than touchStartX)
  if (endX < touchStartX - swipeThreshold) {
    nextImage();
  } 
  // If swiped right (endX is significantly greater than touchStartX)
  else if (endX > touchStartX + swipeThreshold) {
    prevImage();
  }
} 

</script>

<style scoped>
/* Prevent default touch behaviors that might interfere with custom touch handling */
img {
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Ensure the modal container also has proper touch handling */
.fixed {
  touch-action: none;
}
</style>
  