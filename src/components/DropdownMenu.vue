<template>
    <div v-if="isOpen" class="fixed top-0 right-0 w-[50vw] h-screen  shadow-lg z-[10001]">

        <!-- Right Rectangular Section (Green) -->
        <div class="h-full w-full flex space-4 flex-col items-end bg-yellow-site content-end" :style="ellipseStyle">
            <div class="m-3">

                <button class="btn self-end text-5xl font-bold" @click="$emit('close')"> 
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <!-- Menu Items (Overlay on Top of Background) -->

            <ul class="space-y-4 m-1/10">
                <li v-for="(item, index) in menuItems" :key="index" class="btn">
                    <a :href="item.href" class="text-right text-[20px] block px-4 py-2 text-content font-bold  text-background-site">{{ item.label }}</a>
                </li>
            </ul>
        </div>

    </div>

</template>

<script>

import { computed } from 'vue';

export default {
    props: {
        menuItems: {
            type: Array,
            required: true
        },
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close'],
    setup(){
        const ellipseStyle = computed(() => {
        return {
            width: "100%",   // 70% of the menu width
            height: "100%",  // 50% of the menu height
            borderTopLeftRadius: "50% 100%",  // Top-left curved
            borderBottomLeftRadius: "50% 100%", // Bottom-left curved
            borderTopRightRadius: "0", // Keep right side straight
            borderBottomRightRadius: "0", // Keep right side straight
        };
        });

        return { ellipseStyle }
    }

}
</script>

<style>

</style>