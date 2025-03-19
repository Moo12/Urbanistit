<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 padding-section">
        <div v-for="client in insertSquareMain" :key="client.id">
            <div v-if="!client.isMain">
                <router-link :to="{ name: 'Client', params: { id: client.id }}">
                    <Client :project="client"></Client>
                </router-link>
            </div>
            <div v-else>
                <Client :project="client"></Client>
            </div>
        </div>
    </div>
</template>

<script>

import { computed, ref, onMounted, onUnmounted } from "vue";
import Client from "./Client.vue"

import getCollection from "@/composables/getCollection";

export default {
    components: {
        Client,
    },
    setup(){

        const screenWidth = ref(window.innerWidth);

        const squareMain = {
            source: "",
            name: "פרויקטים",
            text: "",
            isMain: true
        };

        // Fetch פclients using getCollection
        const { error: errorGetCollection, documents: clients_db, subscribeToCollection } = getCollection("clients");

        subscribeToCollection()

        const insertSquareMain = computed(() => {
            let index;

            if ( !clients_db || !clients_db.value){
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



            const newClients = [...clients_db.value];
            newClients.splice(index, 0, squareMain);

            return newClients;
        });

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(() => {
            window.addEventListener("resize", updateScreenWidth);

            // clients_db.value = clients_db.value.map((project) => ({
            //     ...project,
            //     isMain: false,
            // }));
        });

        onUnmounted(() => {
            window.removeEventListener("resize", updateScreenWidth);
        });


        return { insertSquareMain, clients_db, screenWidth }
    }
}
</script>

<style>

</style>