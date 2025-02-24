<template>
    <div class="w-1/4 bg-gray-800 text-white p-4">
      <h2 class="text-lg font-bold mb-4">Sections</h2>
      <ul class="space-y-2">
        <li v-for="section in sections" :key="section.id">
          <button 
            @click="toggleChild(section._id)" 
            class="w-full text-left p-2 hover:bg-gray-600 font-semibold">
            {{ section.name }}
          </button>
          <!-- Child Items -->
          <ul v-if="isChildVisible(section._id)" class="pl-4 space-y-1">
            <li v-for="child in section.children" :key="child._id">
              <router-link 
                :to="{ name: child.path, params: { id: child._id }, query: { name: child.name, type: child.type }, key: route.params[route.meta.watchParam] }"
                class="block w-full text-left p-2 hover:bg-gray-500">
                {{ child.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup(){
      const route = useRoute();

        const sections = [
            {
                name: "עמוד ראשי", _id: "main_page", children: [
                { name: "About Me", _id: "about_me", type: "single", path: "edit-section" },
                { name: "צור קשר", _id: "contact_me", type: "single", path: "edit-section" },
                { name: "footer", _id: "footer", type: "single", path: "edit-section" },
                { name: "navbar", _id: "navbar", type: "single", path: "edit-section" },
                { name: "blog", _id: "blog", type: "single", path: "edit-section" },
                ]
            },
            {
                name: "עמודים", _id: "pages", children: [
                { name: "Blog", _id: "blog", type: "list", path: 'edit-page' },
                { name: "Projects", _id: "projects", type: "list", path: 'edit-page' },
                { name: "Tags", _id: "tags", type: "list", path: 'edit-page' }

                ]
            }
        ];


        // State to track which section has visible children
        const visibleSections = ref({});

        const toggleChild = (id) => {
            visibleSections.value[id] = !visibleSections.value[id];
        };

        const isChildVisible = (id) => {
            return visibleSections.value[id];
        };

        return { isChildVisible, toggleChild, visibleSections, sections, route } 
    }
}
</script>

<style>

</style>