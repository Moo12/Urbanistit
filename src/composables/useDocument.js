import { ref } from 'vue'
import { projectFireStore } from '@/firebase/config'
import { doc, updateDoc, deleteDoc } from "firebase/firestore";


const useDocument = (collectionName, id) => {

  const error = ref(null)
  const isPending = ref(false)

  let docRef = doc(projectFireStore, collectionName, id)

  const _deleteDoc = async () => {
    isPending.value = true
    error.value = null
    try{
      const res = await deleteDoc(docRef)
      isPending.value = false
    }
    catch(err){
      console.log(err)
      isPending.value = false
      error.value = "could not delete the document"
    }
  }

  const _updateDoc = async(updates) => {
    isPending.value = true
    error.value = null
    try{
      const res = await updateDoc(docRef, updates)
      isPending.value = false
    }
    catch(err){
      console.log(err)
      isPending.value = false
      error.value = "could not update the document"
    }

  }

  return { error, _deleteDoc, isPending, _updateDoc }

}

export default useDocument