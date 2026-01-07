<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithPopup } from 'firebase/auth' // Importamos signInWithPopup
import usersService, { type LoginBody, type LoginResponse } from '@/services/users.service'
import { useUserStore } from '@/stores/user'
import { auth, provider } from '@/firebase' // Importamos nuestra configuración

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// State
const email = ref(String(route.query.email || ''))
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const loadingGoogle = ref(false) // Nuevo estado para Google
const error = ref('')
const info = ref(String(route.query.msg || ''))

function goToCheckout() {
  router.push('/checkout')
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

// Lógica de Login con Google
async function loginWithGoogle() {
  loadingGoogle.value = true
  error.value = ''

  try {
    // 1. Abrir Popup de Google
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // 2. Obtener Token (Este token se enviará al Backend luego)
    const token = await user.getIdToken()

    console.log('🚀 Google User:', user)
    console.log('🔐 Firebase ID Token:', token)

    // 3. Enviar token al Backend para validar y crear sesión
    const { data } = await usersService.googleLogin<LoginResponse>(token)

    // 4. Guardar sesión y redirigir (Igual que en login normal)
    localStorage.setItem('access_token', data.token)

    try {
      // Manejo flexible de IDs según vengan del backend (_id, id, user_id)
      const uid = (data.user as any)?.id || (data.user as any)?._id || (data.user as any)?.user_id

      if (uid) {
        localStorage.setItem('user_id', String(uid))

        // 5. RE-FETCH: Obtener perfil completo y fresco para asegurar accountType (Founder, etc.)
        try {
          const { data: userData } = await usersService.getById(uid)
          const freshUser = userData.user

          localStorage.setItem('user', JSON.stringify(freshUser))
          userStore.setUser({
            id: freshUser._id || (freshUser as any).id,
            name: freshUser.name,
            email: freshUser.email,
            accountType: freshUser.accountType || (freshUser as any).account_type,
            role: freshUser.role
          })

          if (freshUser.role === 'admin') {
            router.push('/admin')
            return
          }
        } catch (fetchErr) {
          console.warn('Error refrescando perfil post-login:', fetchErr)
          // Fallback al usuario que vino en login
          userStore.setUser({
            id: uid,
            name: (data.user as any)?.name,
            email: (data.user as any)?.email
          })
        }
      }
    } catch (err) {
      console.warn('Error parseando usuario:', err)
    }

    router.push('/')

  } catch (e: any) {
    console.error('Error Google Login:', e)
    if (e.code === 'auth/popup-closed-by-user') {
      // El usuario cerró el popup, no mostramos error rojo
      return
    }
    // Si el error viene del backend (axios)
    if (e.message && !e.code) {
      error.value = e.message
    } else {
      error.value = 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.'
    }
  } finally {
    loadingGoogle.value = false
  }
}

async function submit() {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = ''

  try {
    const body: LoginBody = { email: email.value.trim().toLowerCase(), password: password.value.trim() }
    const { data } = await usersService.login<LoginResponse>(body)

    localStorage.setItem('access_token', data.token)
    try {
      const uid = (data.user as any)?.id || (data.user as any)?._id || (data.user as any)?.user_id

      if (uid) {
        localStorage.setItem('user_id', String(uid))

        // RE-FETCH: Asegurar perfil fresco
        try {
          const { data: userData } = await usersService.getById(uid)
          const freshUser = userData.user

          localStorage.setItem('user', JSON.stringify(freshUser))
          userStore.setUser({
            id: freshUser._id || (freshUser as any).id,
            name: freshUser.name,
            email: freshUser.email,
            accountType: freshUser.accountType || (freshUser as any).account_type,
            role: freshUser.role
          })

          if (freshUser.role === 'admin') {
            router.push('/admin')
            return
          }
        } catch (fetchErr) {
          console.warn('Error refrescando perfil submit:', fetchErr)
          userStore.setUser({
            id: uid,
            name: (data.user as any)?.name,
            email: (data.user as any)?.email
          })
        }
      }
    } catch { }

    router.push('/')
  } catch (e: any) {
    error.value = e?.message || 'Credenciales incorrectas. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    
    <div class="brand-header">
      <img src="/src/assets/logos/logo-prefectura.png" alt="Prefectura" class="logo" />
    </div>

    <div class="card">
      <div class="card-body">
        <h2 class="title">Bienvenido de nuevo</h2>
        <p class="subtitle">Ingresa a tu panel de control</p>

        <div v-if="info" class="alert info">
          <i class="fa-solid fa-circle-info" /> {{ info }}
        </div>
        
        <div v-if="error" class="alert error">
          <i class="fa-solid fa-circle-exclamation" /> {{ error }}
        </div>

        <form class="form" @submit.prevent="submit">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <i class="fa-regular fa-envelope icon" />
              <input 
                id="email" 
                type="email" 
                v-model.trim="email" 
                placeholder="ejemplo@correo.com" 
                autocomplete="email" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password">Contraseña</label>
              <router-link to="/request-password-recovery" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
            </div>
            <div class="input-wrapper">
              <i class="fa-solid fa-lock icon" />
              <input 
                id="password" 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="••••••••" 
                autocomplete="current-password" 
                required
              />
              <button type="button" class="eye-btn" @click="togglePassword">
                <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" />
              </button>
            </div>
          </div>

          <button class="submit-btn" type="submit" :disabled="loading || loadingGoogle">
            <span v-if="!loading">Iniciar Sesión <i class="fa-solid fa-arrow-right-to-bracket" /></span>
            <span v-else><i class="fa-solid fa-spinner fa-spin" /> Verificando...</span>
          </button>
        </form>

        <div class="divider">
          <span>O continúa con</span>
        </div>

        <button type="button" class="google-btn" @click="loginWithGoogle" :disabled="loading || loadingGoogle">
          <i v-if="loadingGoogle" class="fa-solid fa-spinner fa-spin" />
          <i v-else class="fa-brands fa-google icon" />
          <span>Google</span>
        </button>
      </div>

      <div class="card-footer">
        <span class="hint">¿Aún no eres miembro Founder?</span>
        <button class="buy-btn" type="button" @click="goToCheckout">
          Obtener Acceso de por Vida
        </button>
      </div>
    </div>
    
    <p class="copyright">© Prefectura Sambo. Sistema seguro.</p>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  padding: 40px 16px;
  background-color: var(--bg-main);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.brand-header {
  text-align: center;

  .logo {
    height: 48px;
    width: auto;
  }
}

.card {
  width: 100%;
  max-width: 480px;
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 1px solid var(--border);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-body {
  padding: 32px;
}

.title {
  color: var(--text-main);
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  text-align: center;
}

.subtitle {
  color: var(--text-sec);
  font-size: 15px;
  margin: 8px 0 24px 0;
  text-align: center;
}

.alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  &.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  &.info {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
}

.form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
  }
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    background: var(--bg-card);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.15);
  }

  .icon {
    color: var(--text-sec);
    font-size: 18px;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 16px;
    color: var(--text-main);

    &::placeholder {
      color: var(--text-sec);
      opacity: 0.5;
    }
  }

  .eye-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-sec);
    transition: color 0.2s;

    &:hover {
      color: var(--accent);
    }
  }
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
  background: var(--accent);
  color: #111613;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(134, 239, 172, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  span {
    padding: 0 10px;
    color: var(--text-sec);
    font-size: 13px;
    font-weight: 500;
  }
}

.google-btn {
  width: 100%;
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .icon {
    font-size: 18px;
  }
}

.card-footer {
  background: rgba(0, 0, 0, 0.03);
  padding: 20px 32px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;

  .hint {
    font-size: 14px;
    color: var(--text-sec);
  }

  .buy-btn {
    background: transparent;
    border: 2px solid var(--accent);
    color: var(--accent);
    font-weight: 700;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;

    &:hover {
      background: var(--accent);
      color: #111613;
    }
  }
}

.copyright {
  font-size: 12px;
  color: var(--text-sec);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>