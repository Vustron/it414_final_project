// components
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import PasswordStrengthMeter from "@/components/ui/password-strength"
import SubmitButton from "@/components/shared/submit-button"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"

const DynamicForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitButtonTitle,
  mutation,
  className,
  disabled,
  isRegister,
  submitButtonClassname,
  submitButtonTitleClassname,
}: DynamicFormProps<TFieldValues>) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-5", className)}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormControl>
                  {field.type === "select" ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                      disabled={mutation?.isPending || disabled}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors[field.name]
                            ? "border-red-600 focus:ring-0"
                            : "",
                          field.className,
                        )}
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      <FloatingLabelInput
                        {...formField}
                        id={field.name}
                        type={field.type}
                        label={field.label}
                        placeholder={field.placeholder}
                        disabled={mutation?.isPending || disabled}
                        hasErrors={!!form.formState.errors[field.name]}
                        className={cn(
                          form.formState.errors[field.name]
                            ? "border-red-600 focus:ring-0"
                            : "",
                          field.className,
                        )}
                        isPassword={field.type === "password"}
                      />
                      {isRegister &&
                        field.type === "password" &&
                        field.name !== "cpassword" && (
                          <PasswordStrengthMeter
                            password={
                              formField.value
                                ? String(formField.value)
                                : undefined
                            }
                          />
                        )}
                    </>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <SubmitButton
          type="submit"
          title={submitButtonTitle}
          disabled={mutation?.isPending || disabled}
          buttonClassName={cn(
            "w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600",
            submitButtonClassname,
          )}
          titleClassName={submitButtonTitleClassname}
        />
      </form>
    </Form>
  )
}

export default DynamicForm
