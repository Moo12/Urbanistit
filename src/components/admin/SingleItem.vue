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
    <div v-for="([dataEntry, fields_name]) in Object.entries(metadataRef.display_config?.short_view)" :key="dataEntry">
      <div v-for="field_name in fields_name" :key="field_name">
        <p class="text-sm font-medium text-gray-500 my-3">
          {{ metadataRef?.[dataEntry]?.[field_name]?.label || "no label" }}
        </p>
        <div v-if="metadataRef?.[dataEntry]?.[field_name].type === null" class="ml-3">
          <div v-if="['text', 'textarea', 'boolean', 'int'].includes(metadataRef?.[dataEntry]?.[field_name].type_item)">
            <div class="text-sm text-gray-800 bg-gray-50 p-2">
              <div v-if="metadataRef?.[dataEntry]?.[field_name].type_item === 'boolean'">
                <span v-if="getFieldValue(dataEntry, field_name) == true">
                  ✅
                </span>
                <span v-else>
                  ❌
                </span>
              </div>
              <div v-else>
                {{ getFieldValue(dataEntry, field_name) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="metadataRef?.[dataEntry]?.[field_name].type === 'select'  ||
                        metadataRef?.[dataEntry]?.[field_name].type === 'multi_select'">
          <div v-if="getSelectedOptionsValue(dataEntry, field_name).value.length">
            <div v-for="selected in getSelectedOptionsValue(dataEntry, field_name).value" :key="selected.id" class="ml-6">
              <p class="text-sm text-gray-800 bg-gray-50 p-2 mt-2 rounded">
                {{ selected.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
