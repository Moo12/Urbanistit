<template>
    <!-- Layout 1: Symmetric Arc and Rectangle -->
    <div v-if="isLandscape" class="overflow-hidden object-contain flex items-end h-full w-full max-w-full" id="image-curve-container">
      <svg class="h-full w-full"  :viewBox="landscapeViewBox" xmlns="http://www.w3.org/2000/svg">
        <!-- Define the clipPath to create the shape -->
        <defs>
          <clipPath id="landscapeClip">
            <!-- Symmetric Arc Shape -->
            <path :d="landscapePath" />
          </clipPath>
        </defs>
        <!-- Image inside the defined clipPath -->
        <image
          :href="imageSrc"
          width="100%"
          :y="landscapeImageY"
          clip-path="url(#landscapeClip)"
          
          :style="deviceStore.isMobile ? 'transform: scale(1.4); transform-origin: center;' : ''"
        />
      </svg>
    </div>

    <!-- Layout 2: Rectangle Left with Curve -->
    <div v-else class="relative h-full  flex justify-end overflow-hidden w-auto object-contain" id="image-curve-container">

      <svg class="h-full overflow-hidden" :viewBox="landscapeViewBox" xmlns="http://www.w3.org/2000/svg" overflow="hidden">

        <!-- Define the clipPath to create the shape -->
        <defs>
          <clipPath id="portraitClip">
            <!-- Curved shape -->
            <path :d="landscapePath"
                stroke="black"
                fill="transparent"
            />  

          </clipPath>
        </defs>
        <!-- Image inside the defined clipPath -->
        <image
        class="w-auto"
          :href="imageSrc"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clip-path="url(#portraitClip)"
        />
      </svg>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import { useDeviceStore } from '@/stores/deviceStore';

const deviceStore = useDeviceStore();

  // Prop for dynamic image URL
  const props = defineProps({
    imageSrc: {
        type: String,
        required: true
    },
    isLandscape: {
        type: Boolean,
        required: true
    },
    aspectRatio:{
      type: Number,
      required: true
    }
});

const landscapePath = ref(null)
const landscapeViewBox = ref(null)

const landscapeImageHeight = ref('100%') // To control image height in landscape
const landscapeImageY = ref(0) // To control image Y position in landscape

const updatePaths = () => {
  
  const relWidth = 100;
  let relHeight = 100 / props.aspectRatio;
  
  landscapeViewBox.value = `0 0 100 ${relHeight}`;
  
  console.log(`rel height ${relHeight} rel width ${relWidth}`)
  if (props.isLandscape) {
    // For landscape, you're using the actual container height for relHeight for the path calculation
    // So the viewBox height should reflect that for consistent positioning.
    const container = document.getElementById('image-curve-container');
    let actualContainerHeightInSVGUnits = 100; // Default to 100 if container not found or calculation fails
    
    if (container) {
      const containerHeightPx = container.offsetHeight;
      const containerWidthPx = container.offsetWidth;
      // Calculate relative height in SVG units (where viewBox width is 100)
      actualContainerHeightInSVGUnits = (containerHeightPx / containerWidthPx) * 100;
    }
    
    let relHeighStartCurve = actualContainerHeightInSVGUnits * 0.35
    landscapeViewBox.value = `0 0 100 ${actualContainerHeightInSVGUnits}`;

    console.log("actualContainerHeightInSVGUnits", actualContainerHeightInSVGUnits)

    // Ensure the image fills the width and adjust its height based on the original aspect ratio
    // If you want the image to fill the *entire* container and then be clipped,
    // its height should match the viewBox height.
    landscapeImageHeight.value = actualContainerHeightInSVGUnits; 
    landscapeImageY.value = actualContainerHeightInSVGUnits > relHeight ? actualContainerHeightInSVGUnits - relHeight : 0; // Position at the top, and the clipping will handle the rest.

    // Adjust for landscape orientation
    landscapePath.value = `M 0 ${actualContainerHeightInSVGUnits} L 0 ${relHeighStartCurve} C 0 ${relHeighStartCurve}, 50 0, 100 ${relHeighStartCurve} L 100 ${actualContainerHeightInSVGUnits} L 0 ${actualContainerHeightInSVGUnits}`;
    console.log("landscape path:", landscapePath.value)
  } else {
    let relXStartCurve = deviceStore.isMobile === false ? 100 * 0.4 : 0
    let relXMiddleCurve = 100 * 0.95
    let relYMiddleCurve = relHeight * 0.8


    // Adjust for portrait orientation
    landscapePath.value = `M 0 0 L 0 ${relHeight} L ${relXStartCurve} ${relHeight} C ${relXStartCurve} ${relHeight}, ${relXMiddleCurve} ${relYMiddleCurve}, 100 0 L 0 0`;

    console.log("portrait path:", landscapePath.value)

  }
};

onMounted( () => {
  updatePaths()
  
  // Add resize listener to update paths when container dimensions change
  const resizeObserver = new ResizeObserver(() => {
    updatePaths()
  })
  
  const container = document.getElementById('image-curve-container')
  if (container) {
    resizeObserver.observe(container)
  }
  
  // Cleanup on unmount
  return () => {
    resizeObserver.disconnect()
  }
})

</script>
  
<style scoped>
  /* No need to add specific styles since Tailwind is doing most of the styling */
</style>
  