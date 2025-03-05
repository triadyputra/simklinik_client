import type { H3Event } from 'h3'
import { ofetch } from 'ofetch'
import CryptoJS from 'crypto-js'

const SECRET_KEY = 'E542C8GS278CD5931069B533E695F4F2' // Harus 32 karakter

// 🔒 Enkripsi String
function encryptString(text: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)
  const iv = CryptoJS.lib.WordArray.random(16) // IV acak

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // Gabungkan IV + Data terenkripsi lalu encode ke Base64
  const combined = iv.concat(encrypted.ciphertext)
  return CryptoJS.enc.Base64.stringify(combined)
}

// 🔓 Dekripsi String
// function decryptString(cipherText: string): string {
//   const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)
//   const fullCipher = CryptoJS.enc.Base64.parse(cipherText)

//   // Ekstrak IV (16 byte pertama)
//   const iv = CryptoJS.lib.WordArray.create(fullCipher.words.slice(0, 4))
//   const encryptedData = CryptoJS.lib.WordArray.create(fullCipher.words.slice(4))

//   const decrypted = CryptoJS.AES.decrypt(
//     { ciphertext: encryptedData },
//     key,
//     { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
//   )

//   return decrypted.toString(CryptoJS.enc.Utf8)
// }

function encryptTimestamp(): string {
  const timestamp = Math.floor(Date.now() / 1000) * 1000
  const encrypted = encryptString(timestamp.toString())
  return encrypted.toString()
}

export function useApiFetch(event?: H3Event) {
  const token = useUserToken(event)
  const userSession = useUserSession()
  const router = useRouter()

  return ofetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5122/api/', // 'http://localhost:5122/api/',

    // We set an interceptor for each request to
    // include Bearer token to the request if user is logged in
    onRequest: ({ options }) => {
      if (token.value) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token.value}`,
          'X-Custom-Header': encryptTimestamp(), // Menambahkan header custom
          'apikey': 'e+88+vWJO4ytm84yTlDuQfuFrWW+4V1KF0W43hoCg+U=',
          'clientid': 'hhP9u9vPe4VTPYbTwcnf6fKQZ9Xpj1bqsAQW9fCfj9Y=',
          'klinikid': userSession.user?.klinikid,
        }
      }
    },

    onResponse: ({ response }) => {
      console.log(`✅ Response Status: ${response.status}`) // Log status sukses
    },

    onResponseError: ({ response, error }) => {
      console.error(`❌ Error Status: ${response?.status ?? 'Unknown'}`, error)
      console.log(response)
      console.log(error)
      // Jika token expired (401), logout user
      if (response?.status === 401) {
        userSession.logoutUser()
      }
      else if (response?.status === 403) {
        console.error(`❌ Error Status: ${response?.status ?? 'Unknown'}`, error)
        router.push('/error/page-1')
      }
      console.log(import.meta.env)
      console.log('import.meta.env')
      return Promise.reject(error) // Melempar error agar bisa ditangani di komponen
    },
  })
}
