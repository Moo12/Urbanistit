import { ref } from 'vue'
import { signInWithEmailAndPassword } from "firebase/auth";
import { projectAuth} from '../firebase/config'

const error = ref(null)
const isPending = ref(false)

const login = async (email, password) => {

    try{
        isPending.value = true
        error.value = null
        let res
        res = await signInWithEmailAndPassword(projectAuth, email, password)
        error.value = null
        isPending.value = false
        return res
    }
    catch(err){
        isPending.value = false
        console.log(err.message)
        error.value = "incorrect Login credentials"
    }
}

const useLogin = () => {
    return { error, isPending, login} 
}

export default useLogin