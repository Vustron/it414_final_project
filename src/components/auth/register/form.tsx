"use client"

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { registerFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validation"
import { clientErrorHandler } from "@/lib/utils"
import { IKUpload } from "imagekitio-next"
import toast from "react-hot-toast"

// hooks
import { usePreviewImage } from "@/lib/hooks/utils/use-preview-image"
import { useRegisterAccount } from "@/lib/hooks/auth/register"
import { useForm } from "react-hook-form"
import { useRef } from "react"

// types
import type { RegisterValues } from "@/lib/validation"
import { User } from "lucide-react"

const SignupForm = () => {
  const { loadImage, setImage } = usePreviewImage()
  const registerMutation = useRegisterAccount()
  const uploadRef = useRef<HTMLInputElement>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
      userType: "USER",
      avatarUrl: "",
    },
  })

  const submitHandler = async (values: RegisterValues) => {
    await toast.promise(registerMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Registering user...</span>,
      success: "User registered.",
      error: (error: unknown) => clientErrorHandler(error),
    })
    form.reset()
    setImage(null)
  }

  const onError = (err: any) => {
    clientErrorHandler(err, true)
  }

  const onSuccess = (res: any) => {
    const maxFileSizeInBytes = 2 * 1024 * 1024
    const imageFile = res.url

    if (res.size > maxFileSizeInBytes) {
      setImage(null)
      toast.error("File size must be less than 2MB.")
      return
    }

    setImage(imageFile)
    form.setValue("avatarUrl", imageFile, {
      shouldValidate: true,
    })
    toast.success("Avatar Uploaded")
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-2 py-2">
        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          ref={uploadRef}
          className="hidden"
        />
        <Avatar
          className="cursor-pointer hover:scale-110"
          onClick={() => uploadRef.current?.click()}
        >
          <AvatarImage src={loadImage || form.watch("avatarUrl")} />
          <AvatarFallback>
            <User className="size-6" />
          </AvatarFallback>
        </Avatar>
      </div>
      <DynamicForm<RegisterValues>
        form={form}
        onSubmit={submitHandler}
        fields={registerFields}
        submitButtonTitle="Register"
        mutation={registerMutation}
        isRegister
      />
    </>
  )
}

export default SignupForm
