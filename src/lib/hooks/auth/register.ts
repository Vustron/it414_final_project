// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { register } from "@/lib/actions/auth/register"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { registerSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { RegisterValues } from "@/lib/validation"

const purify = DOMPurify

export const useRegisterAccount = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["register-account"],
    mutationFn: async (values: RegisterValues) => {
      const sanitizedData = sanitizer<RegisterValues>(
        values,
        registerSchema,
        purify,
      )
      return await register(sanitizedData)
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
