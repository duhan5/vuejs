<template>
    <div class="login-page">
      <transition name="fade">
      <div v-if="!registerActive" class="wallpaper wallpaper-login"></div>
    </transition>
    <transition name="fade">
      <div v-if="registerActive" class="wallpaper wallpaper-register"></div>
    </transition>
  
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
            <!-- LOGIN FORM -->
            <div v-if="!registerActive" class="card login" :class="{ error: emptyFields }">
              <h1>Sign In</h1>
              <form @submit.prevent="doLogin">
                
                <input v-model="loginField" type="text" class="form-control" placeholder="Email or Username" required />
                <input v-model="passwordLogin" type="password" class="form-control" placeholder="Password" required />
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
              <p class="link-text">
              <a href="#" @click.prevent="forgotPassword">Forgot your password?</a>
            </p>

              <p class="link-text"><a  href="#" @click.prevent="toggleRegister">Sign up here</a></p>
            </div>
  
            <!-- REGISTER FORM -->

                 <!-- REGISTER FORM -->
            <div v-else class="card register" :class="{ error: emptyFields }">
              <h1>Sign Up</h1>
              <form @submit.prevent="doRegister">
                <!-- Başarı veya hata mesajı -->

                <p v-if="registerMessage" style="color: green;">{{ registerMessage }}</p>
                <p v-if="registerError" style="color: red;">{{ registerError }}</p>
                <input v-model="usernameReg" type="text" class="form-control" placeholder="Username" required />
                <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required />
                <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required />
                <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required />
                <button type="submit" class="btn btn-primary">Register</button>
              </form>
              <p>Already have an account? <a href="#" @click.prevent="toggleRegister">Sign in here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import axios from '../axios'

  
  export default {
    name: "LoginRegister",
    setup() {
      const router = useRouter()
      const loginField = ref("")
      const registerActive = ref(false)
      const emailLogin = ref("")
      const passwordLogin = ref("")
      const usernameReg = ref("")
      const emailReg = ref("")
      const passwordReg = ref("")
      const confirmReg = ref("")
      const emptyFields = ref(false)
      const registerMessage = ref("")
      const registerError = ref("")

      
      
  
      const toggleRegister = () => {
        registerActive.value = !registerActive.value
        emptyFields.value = false
      }
  
      const doLogin = async () => {
              if (!loginField.value || !passwordLogin.value) {
        emptyFields.value = true
        return
      }

      try {
        const res = await axios.post('/login', {
        login: loginField.value,
        password: passwordLogin.value,
      })


        console.log('Login successful:', res.data)
        alert('Welcome!')

        localStorage.setItem('username', loginField.value)
        localStorage.setItem('user_id', res.data.user.id)

        router.push('/chat')
      } catch (err) {
        console.error('Login failed:', err)
        emptyFields.value = true
      }

      }
  
      const doRegister = async () => {
      registerMessage.value = ""
      registerError.value = ""

      if (!emailReg.value || !passwordReg.value || !confirmReg.value || !usernameReg.value) {
        emptyFields.value = true
        registerError.value = "Tüm alanları doldurun."
        return
      }

      if (passwordReg.value !== confirmReg.value) {
        registerError.value = "Şifreler uyuşmuyor."
        return
      }

      try {
        const res = await axios.post('/register', {
          username: usernameReg.value,
          email: emailReg.value,
          password: passwordReg.value,
        })

        registerMessage.value = "Kayıt başarılı! Şimdi giriş yapabilirsiniz."
        toggleRegister()
      } catch (error) {
        if (error.response?.status === 500 && error.response?.data?.error?.includes("tekil")) {
          registerError.value = "Bu e-posta adresi zaten kayıtlı."
        } else {
          registerError.value = "Kayıt sırasında bir hata oluştu."
        }

        console.error('Register failed:', error)
        emptyFields.value = true
      }
    }

      
      const forgotPassword = () => {
  alert("Şifre sıfırlama bağlantısı e-postanıza gönderilecek (demo).");
  // Gerçek uygulamada burada bir modal açabilir veya route yönlendirebilirsin.
}

      return {
        registerActive,
        loginField,
        emailLogin,
        passwordLogin,
        usernameReg,
        emailReg,
        passwordReg,
        confirmReg,
        emptyFields,
        toggleRegister,
        doLogin,
        doRegister,
        forgotPassword,
        registerMessage,
        registerError,
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
.login-page {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .wallpaper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
  }

  .wallpaper-login {
    background-image: url('https://images.pexels.com/photos/32237/pexels-photo.jpg');
  }

  .wallpaper-register {
    background-image: url('https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg');
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
.link-text {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

  .container {
    position: relative;
    z-index: 1;
    max-width: 400px;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  }

  h1 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input {
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
    }

    button {
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }

    a {
      color: #007bff;
      text-decoration: none;
      font-size: 0.9rem;
      text-align: center;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .error {
    animation: errorShake 0.3s;
  }

  @keyframes errorShake {
    0% { transform: translateX(-10px); }
    25% { transform: translateX(10px); }
    50% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }


  </style>
  