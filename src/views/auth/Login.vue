<template>
    <div class="my-3 content-editor">
        <form @submit.prevent="loginWithEmail">
            <div class="flex flex-col justify-center items-center gap-3">
                <input type="email" placeholder="Email" v-model:="email" class="form-input">
                <input type="password" placeholder="Password" v-model:="password" class="form-input">
                <div class="error" v-if="error">{{ error }}</div>
                <button v-if="!isPending">Log In</button>
                <button v-else disabled>Loading</button>
            </div>
        </form>
    </div>
</template>

<script>
import useLogin from '@/composables/useLogin';
import { ref } from 'vue';
import { useRouter } from 'vue-router'


export default {
    setup(){
        const email = ref('')
        const password = ref('')

        const { error, isPending, login } = useLogin()
        const router = useRouter()

        const LoginHandler = async (loginMethod) => {
            const res = await login(email.value, password.value, loginMethod)

            if (!error.value){
                console.log('user logged in')
                router.push( { name: "Admin" } )
            }
        }

        const loginWithEmail = async () => {
            LoginHandler('EmailPAssword')
        }


        const loginWithGoogle = async() => {
            LoginHandler('GoogleSignIn')
        }

        return { loginWithEmail, loginWithGoogle, password, email, error, isPending }
    }
}
</script>

<style>
.content-editor {
  margin: auto;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 50%;
}

</style>