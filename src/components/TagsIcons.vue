<template>
    <div class="flex flex-wrap gap-2 md:gap-x-4 md:gap-y-5">
      <div
        v-for="(tag, index) in tagsDocuments"
        :key="index"
        class="rounded-3xl tag-item flex items-center justify-center p-3 cursor-pointer bg-yellow-site text-background-site"
        :class="{
          'opacity-70 border-2': toggledTags[tag.id],  // Add selected class based on toggled status
          'opacity-100': !toggledTags[tag.id]   // Default background for untoggled tags
        }"
        @click="handleTagClick(tag.id)"
      >
        <p class="text-center section-title-main">{{ tag.translations.en.title }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref } from 'vue';
  
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
  
  // Handle a tag click event
  const handleTagClick = (id) => {
    // Toggle the tag's state (either true or false)
    toggledTags.value[id] = !toggledTags.value[id];
  
    // Emit the array of all toggled tag IDs
    emitTagClick("tagToggled", Object.keys(toggledTags.value).filter(tagId => toggledTags.value[tagId]));
  };
  </script>

<style scoped>
.tag-item {
  flex-grow: 1; /* Allow the tags to grow equally */
  flex-shrink: 0; /* Prevent shrinking */
  min-width: 40px; /* Set a minimum width for the tags */
  max-width: 100%; /* Ensure tags don't grow beyond the container */
}
</style>
  