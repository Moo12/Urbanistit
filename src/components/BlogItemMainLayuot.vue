<template>
    <!-- Layout 1: Symmetric Arc and Rectangle -->
    <div v-if="isLandscape" class="relative  w-full h-full">
      <svg class="w-full" :style="`aspect-ratio: ${aspectRatio}`"  :viewBox="landscapeViewBox" xmlns="http://www.w3.org/2000/svg">
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
          height="100%"
          clip-path="url(#landscapeClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>

    <!-- Layout 2: Rectangle Left with Curve -->
    <div v-else class="relative w-full h-full">
      <svg class="w-full h-full" :viewBox="landscapeViewBox" xmlns="http://www.w3.org/2000/svg">
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
          :href="imageSrc"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clip-path="url(#portraitClip)"
        />
      </svg>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
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

const updatePaths = () => {
  let relHeight = 100 / props.aspectRatio
  landscapeViewBox.value = `0 0 100 ${relHeight}`;

  console.log("relHeight", relHeight)

  if (props.isLandscape) {
    let relHeighStartCurve = relHeight * 0.35
    // Adjust for landscape orientation
    landscapePath.value = `M 0 ${relHeight} L 0 ${relHeighStartCurve} C 0 ${relHeighStartCurve}, 50 0, 100 ${relHeighStartCurve} L 100 ${relHeight} L 0 ${relHeight}`;
    console.log("landscape path:", landscapePath.value)
  } else {
    let relXStartCurve = 100 * 0.7
    let relXMiddleCurve = 100 * 0.95
    let relYMiddleCurve = relHeight * 0.8

    // Adjust for portrait orientation
    landscapePath.value = `M 0 0 L 0 ${relHeight} L ${relXStartCurve} ${relHeight} C ${relXStartCurve} ${relHeight}, ${relXMiddleCurve} ${relYMiddleCurve}, 100 0 L 0 0`;

    console.log("portrait path:", landscapePath.value)

  }
};

onMounted( () => {
  updatePaths()
})

</script>
  
<style scoped>
  /* No need to add specific styles since Tailwind is doing most of the styling */
</style>
  