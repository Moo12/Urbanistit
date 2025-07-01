<template>
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-1 md:gap-6 padding-section">
        <div v-for="client in insertSquareMain" :key="client.id" class="col-span-1">
            <div v-if="!client.isMain">
                <router-link :to="{ name: 'Client', params: { id: client.id }}">
                    <Client :project="client" :hoveEffect="hoverEffect"></Client>
                </router-link>
            </div>
            <div v-else>
                <router-link :to="{ name: 'ClientsPage' }">
                    <Client :project="client"></Client>
                </router-link>
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

            clients_db.value.sort((a, b) =>{
                const aIndex = a.metadata?.index;
                const bIndex = b.metadata?.index;

                const aHasIndex = typeof aIndex === 'number';
                const bHasIndex = typeof bIndex === 'number';

                if (aHasIndex && bHasIndex) return aIndex - bIndex;
                if (aHasIndex) return -1;
                if (bHasIndex) return 1;
                return 0;
            })




            const newClients = [...clients_db.value];
            newClients.splice(0, 0, squareMain);

            return newClients;
        });

        const hoverEffect = computed(() => {
            if (screenWidth.value < 768){
                return false;
            }

            return true;
        })

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


        return { insertSquareMain, clients_db, screenWidth, hoverEffect }
    }
}
</script>

<style>

</style>