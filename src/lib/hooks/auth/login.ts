// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { login } from "@/lib/actions/auth/login"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { loginSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { LoginValues } from "@/lib/validation"

const purify = DOMPurify

export const useLoginAccount = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["login-account"],
    mutationFn: async (values: LoginValues) => {
      const sanitizedData = sanitizer<LoginValues>(values, loginSchema, purify)
      return await login(sanitizedData)
    },
    onSuccess: () => {
      router.push("/")
      router.refresh()
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
