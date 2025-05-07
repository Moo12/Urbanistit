<template>
<div class="flex h-full mt-[4%]">
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
  margin: auto;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto; /* Enables vertical scrolling */
  padding: 10px;
  height: 100%;
}


</style>