import { ref } from 'vue';
import { collection, query, where, getDocs } from "firebase/firestore";
import { projectFireStore } from '@/firebase/config';

const useImageMetadata = () => {
  const metadata = ref([]);
  const error = ref(null);
  const loading = ref(false);

  const fetchMetadata = async (section, custConditions = null) => {
    loading.value = true;
    error.value = null;

    console.log('fetchMetadata')

    try {
      const colRef = collection(projectFireStore, 'images_metadata');
      // Construct a query based on the section and other conditions
      
      
        let allConditions = [
            {
                field: 'section',
                operator: '==',
                value: section,
            }
          ]

        if (custConditions){
            allConditions.push(...custConditions)
        }

        const allQueries = allConditions.map((condition) =>
            where(condition.field, condition.operator, condition.value)
        );

      console.log('queries', allQueries)

      let queryRef = query(colRef, ...allQueries);

      const querySnapshot = await getDocs(queryRef);

      console.log('metadata section', section, ' length ', querySnapshot.docs.length )
      // Map your documents to an array
      metadata.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } 
    catch (err) {
      console.log(err.message)
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { metadata, error, loading, fetchMetadata };
};

export default useImageMetadata;
