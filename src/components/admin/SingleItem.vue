<script setup>
import { defineProps } from 'vue';
import useSingleItem from "@/composables/useSingleItem.js"

const props = defineProps({
  item: Object,
  metadata: Object,
  lang: String,
  databaseFieldOptions: Object,
  action: { type: String, default: "readonly" }
});
const { itemRef, metadataRef, getFieldValue, getSelectedOptionsValue } = useSingleItem(props);

</script>

<template>
  <div v-if="itemRef">
    ID {{ itemRef.id }}
    <div v-for="([dataEntry, fields_name]) in Object.entries(metadataRef.display_config?.short_view)" :key="dataEntry">
      <div v-for="field_name in fields_name" :key="field_name">
        <p class="text-green-500">
          {{ metadataRef?.[dataEntry]?.[field_name]?.label || "no label" }}
        </p>
        <div v-if="metadataRef?.[dataEntry]?.[field_name].type === null" class="ml-6">
          <div v-if="metadataRef?.[dataEntry]?.[field_name].type_item === 'text' ||
              metadataRef?.[dataEntry]?.[field_name].type_item === 'textarea' ">
              <p class="text-blue-500">
                {{ getFieldValue(dataEntry, field_name) }}
              </p>
          </div>
        </div>
        <div v-else-if="metadataRef?.[dataEntry]?.[field_name].type === 'select'  ||
                        metadataRef?.[dataEntry]?.[field_name].type === 'multi_select'">
          <div v-if="getSelectedOptionsValue(dataEntry, field_name).value.length">
            <div v-for="selected in getSelectedOptionsValue(dataEntry, field_name).value" :key="selected.id" class="ml-6">
              <p class="text-blue-500">
                {{ selected.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
