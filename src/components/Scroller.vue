<template>
  <div class="flex relative overflow-hidden w-full w-min-full  justify-center">
    <div
      class="flex flex-nowrap overflow-x-auto scroll-smooth w-[95%]  whitespace-nowrap scroll-wrapper"
      :class="[`w-[${scrollContainerWidthPercantage}%]`]"
      :style="{ gap: `${gapSize}px`, paddingRight: `${gapSize}px`}"
      ref="scrollWrapper"
    >
      <div
      v-for="(item, index) in items" 
        :key="index" 
        class="shrink-0 aspect-[0.8] bg-cover bg-center flex items-center justify-center relative rounded-md overflow-hidden cursor-pointer" ref=""
        :style="{backgroundImage: `url(${item.image})`, width:  scrollItemWidth}"
        @click="$emit('click', item)"
      >
         <!-- Default slot for custom content -->
         <slot :item="item"></slot>
        
      </div>
    </div>
    <button
      class="btn rounded-full aspect-square mr-[1.25%] w-[2.5%] z-[1000] absolute top-1/2 right-0 bg-white flex items-center justify-center"
      @click="scrollRight">
      <ArrowRight :stroke-width="4" class="w-[90%] text-black-light" />
    </button>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { ArrowRight } from "lucide-vue-next";

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
    }
  },
  emits: ['click'],
  setup(props, { emits } ) {
    const scrollWrapper = ref(null);
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

  const onItemClick = (item) => {
      emit('click', item)
    }

    return { scrollWrapper, scrollLeft, scrollRight, scrollItemWidth, gapSize, scrollContainerWidthPercantage, radiusPercent, offsetRight, onItemClick };
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
