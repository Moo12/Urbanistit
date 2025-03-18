import { ref, watchEffect } from 'vue'
import getCollection from "./getCollection";

const isLoaded = ref(false);

const { documents: blogData, error, subscribeToCollection } = getCollection("blog")



const useBlogDataSorting = () => {
    const sortedBlogData = ref(null)
    const category = ref([])
    const tags = ref([])

    if (!isLoaded.value) {
        isLoaded.value = true
        if (!blogData?.value?.length || blogData?.value.length === 0) {  // Ensuring it subscribes only if data is missing
            console.log('blog subscribing')
            isLoaded.value = true
            subscribeToCollection();
        }
    }

    const setTags = (_tags) => {
        tags.value = Array.isArray(_tags) ? _tags :_tags ? [_tags] : [];
    };

    const setCategory = (_category) => {
        category.value = Array.isArray(_category) ? _category : _category ? [_category] : [];
    };

    watchEffect(() => {
        if (!blogData.value) return;

        let filteredData = blogData.value;

        // Filter by categories (if any selected)
        if (category.value.length) {
            filteredData = filteredData.filter(item => category.value.includes(item.default.category));
        }

        // Filter by tags (if any selected)
        if (tags.value.length) {
            filteredData = filteredData.filter(item =>
                item.default.tags && tags.value.some(tag => item.default.tags.includes(tag))
            );
        }

        sortedBlogData.value = filteredData;
    });

    return { sortedBlogData, error, setCategory, setTags };
};

export default useBlogDataSorting;