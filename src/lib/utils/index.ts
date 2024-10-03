// utils
import { NextResponse } from "next/server"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast"
import { ZodError } from "zod"
import { clsx } from "clsx"

// types
import type { ErrorResponseData, UniqueId } from "@/lib/types"
import type { NextRequest } from "next/server"
import type { ClassValue } from "clsx"
import type DOMPurify from "dompurify"
import type { z } from "zod"

// Unique Id generator
export function createUniqueId(
  length: number = 21,
  alphabet: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
): UniqueId {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return result
}

// Construct query string utility
export function buildQueryString(
  params?: Record<string, string | number | boolean>,
): string {
  if (!params) return ""
  return `?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&")}`
}

// client error handler
export function clientErrorHandler(error: unknown, isToast?: boolean): string {
  const { message }: ErrorResponseData = ErrorHandler.handleError(error)

  if (isToast) {
    toast.error(message)
  }

  return message
}

// placeholder image
export const placeholderImage = (str: string) => {
  return `https://placehold.co/400x600/EEE/31343C?font=montserrat&text=${encodeURI(
    str,
  )}`
}

// parse json data
export function requestBodyHandler<T>(request: NextRequest): Promise<T> {
  return request.json() as Promise<T>
}

// check required fields
export function checkRequiredFields<T>(
  body: T,
  requiredFields: (keyof T)[],
): NextResponse | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${String(field)} is missing` },
        { status: 400 },
      )
    }
  }
  return null
}

// response stringify parser
export const dataSerializer = <T>(data: T): T => {
  const convertDateToISOString = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj
    }

    if (obj instanceof Date) {
      return obj.toISOString()
    }

    if (Array.isArray(obj)) {
      return obj.map(convertDateToISOString)
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertDateToISOString(value),
      ]),
    )
  }

  const convertedData = convertDateToISOString(data)
  const serializedData = JSON.stringify(convertedData)
  return JSON.parse(serializedData) as T
}

// data sanitizer
export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodEffects<z.ZodObject<any>> | z.ZodObject<any>,
  purify: DOMPurify.DOMPurifyI,
): T => {
  // Sanitize each field of the object
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj

    switch (typeof obj) {
      case "string":
        return purify.sanitize(obj)
      case "object":
        if (Array.isArray(obj)) {
          return obj.map((item) => sanitizeObject(item))
        }
        return Object.keys(obj as object).reduce(
          (acc, key) => {
            acc[key] = sanitizeObject((obj as Record<string, unknown>)[key])
            return acc
          },
          {} as Record<string, unknown>,
        )
      default:
        return obj // leave non-string fields unchanged
    }
  }

  // Sanitize the data
  const sanitizedData = sanitizeObject(data)

  // Validate and parse the object
  const parsedData = schema.safeParse(sanitizedData)

  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.error.errors))
  }

  return parsedData.data as T
}

// class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// bytes formatter
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`
}

// http error
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "HttpError"
  }
}

// error class handler
export class ErrorHandler {
  public static handleError(error: unknown): ErrorResponseData {
    if (error instanceof HttpError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
      }
    }

    if (ErrorHandler.isZodError(error)) {
      return ErrorHandler.handleZodError(error)
    }

    if (error instanceof Error) {
      return ErrorHandler.handleGenericError(error)
    }

    return ErrorHandler.handleUnknownError(error)
  }

  private static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError
  }

  private static handleZodError(error: ZodError): ErrorResponseData {
    const message = error.errors.map((e) => e.message).join(", ")
    return {
      message: `Validation error: ${message}`,
      statusCode: 400,
    }
  }

  private static handleGenericError(error: Error): ErrorResponseData {
    return {
      message: error.message || "An unexpected error occurred.",
      statusCode: 500,
    }
  }

  private static handleUnknownError(error: unknown): ErrorResponseData {
    return {
      message: typeof error === "string" ? error : "An unknown error occurred.",
      statusCode: 500,
    }
  }
}
