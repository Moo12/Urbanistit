<template>
<div class="flex h-screen">
    <!-- Sidebar (Always Visible) -->
    <Sidebar class="w-1/4 bg-gray-800 text-white" />

    <!-- Main Content (Changes Based on Route) -->
    <div class="flex-1 p-4 content-editor">
        <router-view />
    </div>
</div>
</template>

<script>
import Sidebar from '@/components/admin/Sidebar.vue';

export default {
    components: {
        Sidebar,
    },
    setup(){

    }

}
</script>

<style>
.content-editor {
  max-width: 600px;
  margin: auto;
  max-height: 80vh; /* Limits height to 80% of viewport */
  overflow-y: auto; /* Enables vertical scrolling */
  border: 1px solid #ddd;
  padding: 10px;
}


</style>