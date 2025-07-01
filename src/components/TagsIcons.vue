<template>
    <div v-if="tagsDocuments.length > 0" class="flex flex-wrap gap-2 md:gap-x-4 md:gap-y-5">
      
      <div
        v-for="(tag, index) in tagsDocuments"
        :key="index"
        class="btn rounded-3xl min-w-[20px] md:min-w-[40px] max-w-full text-[12px] md:text-[20px]  tag-item flex items-center justify-center p-1 md:p-3 cursor-pointer bg-yellow-site text-background-site"
        :style="{
          opacity: toggledTags[tag.id] === true ? '0.7' : '1',
          border: toggledTags[tag.id] === true ? '2px solid #6b7280' : 'none'
        }"
        @click="handleTagClick(tag.id)"
        >
        <p class="text-center section-content">{{ tag.translations.en.title }}</p>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, onMounted } from 'vue';
  
  // Define the props to accept the tagsDocuments array
  const props = defineProps({
    tagsDocuments: {
      type: Array,
      required: true,
    },
  });
  
  // Emit the clicked tag IDs
  const emitTagClick = defineEmits();
  
  // Reactive object to store toggle status of each tag (id as key)
  const toggledTags = ref({});

  onMounted(() => {
    console.log("on mounted")
    props.tagsDocuments?.forEach(tag => {
      toggledTags.value[tag.id] = false;
    })

    console.log("end on mounted")
  })
  
  // Handle a tag click event
  const handleTagClick = async (id) => {
    // Toggle the tag's state (either true or false)
    if (toggledTags.value[id]) {
      // If it's true, set it to false
      toggledTags.value[id] = false;
    } else {
      // If it's false/undefined, set it to true
      toggledTags.value[id] = true;
    }
  
    // Force reactivity by creating a new object reference
    toggledTags.value = { ...toggledTags.value };

    console.log("toggledTags", toggledTags.value)
  
    // Emit the array of all toggled tag IDs
    emitTagClick("tagToggled", Object.keys(toggledTags.value).filter(tagId => toggledTags.value[tagId]));
  };
  </script>

<style scoped>
.tag-item {
  flex-grow: 1; /* Allow the tags to grow equally */
  flex-shrink: 0; /* Prevent shrinking */
}
</style>
  