import { ref, computed, onMounted } from "vue";

const useSingleItem = (props) => {
  const itemRef = ref(null);
  const metadataRef = ref(null);
  const databaseFieldOptionsRef = ref(null);
  const defaultInputLanguage = "he"

  onMounted(() => {
    metadataRef.value = props.metadata;
    databaseFieldOptionsRef.value = props.databaseFieldOptions;

    // Default action to "readonly" if not provided
    const action = props.action || "readonly";

    // Assign itemRef based on action
    if (action === "create") {
      createNewDForm()
    } else if (action === "edit") {
      itemRef.value = JSON.parse(JSON.stringify(props.item || {})); // Clone existing item for edit
    } else if (action === "readonly") {
      itemRef.value = props.item; // Direct reference for readonly mode
    }
    else {
      console.error("action is no properly assigned. value: ", action)
    }
  });

  // Initialize commonFormData (non-language fields)
  const createNewDForm = () => {
    itemRef.value = {}; // Initialize a new empty object for creation
    itemRef.value.default = {}
    itemRef.value.metadata = {}
    
    if (metadataRef?.value.common_data) {
        for (const [fieldId, field] of Object.entries(metadataRef.value.common_data)) {
          itemRef.value.default[fieldId] = field.type === "multi_select" || field.type === "array" ? [] : "";
        }
    }
    if (metadataRef?.value.metadata) {
      for (const [fieldId, field] of Object.entries(metadataRef.value.metadata)) {
        itemRef.value.metadata[fieldId] = field.type === "multi_select" || field.type === "array" ? [] : "";
      }
  }


    
    // Initialize translations as an object with language keys directly
    itemRef.value.translations = metadataRef.value.languages.reduce((acc, lang) => {
      acc[lang] = {};  // Each language has its own object
      return acc;
    }, {});

    // Initialize language-specific fields
    if (metadataRef.value.data) {
        for (const [fieldId, field] of Object.entries(metadataRef.value.data)) {
            for (const lang of metadataRef.value.languages) {
              itemRef.value.translations[lang][fieldId] = field.type === "multi_select" || field.type === "array" ? [] : "";
            }
        }
    }
  }

  const getFieldValue = (dataEntry, fieldPath, lang = props.lang) => {
    if (!itemRef.value) return "";

    let baseObj;
    if (dataEntry === "data") {
      baseObj = itemRef.value?.translations?.[lang];
    } else if (dataEntry === "common_data") {
      baseObj = itemRef.value?.default;
    }
    else if (dataEntry === "metadata") {
      baseObj = itemRef.value?.metadata;
    } 
    else {
      return "";
    }

    let fieldVal = fieldPath.split('.').reduce((acc, key) => acc?.[key], baseObj)

    // if field value is empty check default language content
    if (!fieldVal && dataEntry === "data"){
      baseObj = itemRef.value?.translations?.[defaultInputLanguage];
    }

    return fieldPath.split('.').reduce((acc, key) => acc?.[key], baseObj) || "";
  };

  const getOptions = (dataEntry, field_name, lang = props.lang) => {
    return computed(() => {
      if (!metadataRef.value || !databaseFieldOptionsRef.value) return [];
  
      // Helper function to access nested properties
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
      };
  
      const fieldMt = getNestedValue(metadataRef.value, `${dataEntry}.${field_name}`);
      if (!fieldMt) return [];
  
      if (fieldMt.type === "multi_select" || fieldMt.type === "select") {
        if (fieldMt.options_source === "database") {
          const dbOptions = getNestedValue(databaseFieldOptionsRef.value, field_name);
          return {
            all_items: dbOptions?.all_items?.map((option) => {
              const title = getNestedValue(option.data?.translations, `${lang}.${dbOptions?.display_field}`)
              const title_display = title !== "" ? title : 
                              getNestedValue(option.data?.translations, `en.${dbOptions?.display_field}`)
              return {
                id: option.id,
                title: title_display,
              };
            })
          };
        } else if (fieldMt.options_source === "static") {
          return {
            all_items: fieldMt.options.map((option) => ({
              id: option,
              title: option,
            })),
          };
        }
      }
  
      return { all_items: [] }; // Ensure consistent return type
    });
  };
  
  function getSelectedOptionsValue(dataEntry, option_id) {
    return computed(() => {

      if (!databaseFieldOptionsRef.value) return [];
  
      let options = getOptions(dataEntry, option_id).value;
      let selectedIds = getFieldValue(dataEntry, option_id);

      if (!options.all_items) return [];
  
      // Ensure selectedIds is always an array, keeping the original reference intact
      const selectedIdsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
  
      let selectedOptions = options.all_items.filter((item) => selectedIdsArray.includes(item.id));
  
      return selectedOptions;
    });
  }

  return {
    itemRef,
    metadataRef,
    databaseFieldOptionsRef,
    getFieldValue,
    getOptions,
    getSelectedOptionsValue,
  };
};

export default useSingleItem;
