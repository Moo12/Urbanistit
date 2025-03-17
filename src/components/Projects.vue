<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 padding-section">
        <div v-for="client in insertSquareMain" :key="client.id">
            <div v-if="!client.isMain">
                <router-link :to="{ name: 'Client', params: { id: client.id }}">
                    <Project :project="client"></Project>
                </router-link>
            </div>
            <div v-else>
                <Project :project="client"></Project>
            </div>
        </div>
    </div>
</template>

<script>

import { computed, ref, onMounted, onUnmounted } from "vue";
import Project from "./Project.vue"

import getCollection from "@/composables/getCollection";

export default {
    components: {
        Project,
    },
    setup(){

        const screenWidth = ref(window.innerWidth);

        const squareMain = {
            source: "",
            name: "פרויקטים",
            text: "",
            isMain: true
        };

        // Fetch פprojects using getCollection
        const { error: errorGetCollection, documents: projects_db, subscribeToCollection } = getCollection("clients");

        subscribeToCollection()

        const insertSquareMain = computed(() => {
            let index;

            if ( !projects_db || !projects_db.value){
                return [];
            }

            if (screenWidth.value < 768) {
                // Smaller than md
                index = 0;
            } else if (screenWidth.value < 1280) {
                // Between md and lg
                index = 1;
            } else {
                // Greater than lg
                index = 2;
            }



            const newProjects = [...projects_db.value];
            newProjects.splice(index, 0, squareMain);

            return newProjects;
        });

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(() => {
            window.addEventListener("resize", updateScreenWidth);

            // projects_db.value = projects_db.value.map((project) => ({
            //     ...project,
            //     isMain: false,
            // }));
        });

        onUnmounted(() => {
            window.removeEventListener("resize", updateScreenWidth);
        });


        return { insertSquareMain, projects_db, screenWidth }
    }
}
</script>

<style>

</style>