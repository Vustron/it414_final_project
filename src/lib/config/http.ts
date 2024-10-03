// configs
import { env } from "@/lib/config/env.mjs"

// utils
import { HttpError, buildQueryString, dataSerializer } from "@/lib/utils"

// types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface RequestConfig<RequestType = unknown, ResponseType = unknown> {
  url?: string
  isCustomUrl?: boolean
  method: HttpMethod
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  body?: RequestType
  transformResponse?: (data: unknown) => ResponseType
  customURL?: string
  timeout?: number
  retries?: number
}

async function makeHttpRequest<RequestType = unknown, ResponseType = unknown>(
  config: RequestConfig<RequestType, ResponseType>,
): Promise<ResponseType> {
  const {
    url,
    method,
    params,
    headers = {},
    body,
    transformResponse,
    customURL,
    timeout = 24 * 60 * 60 * 1000,
    retries = 3,
  } = config

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
    throw new HttpError(408, "Request timed out")
  }, timeout)

  const makeRequest = async (attempt: number): Promise<ResponseType> => {
    try {
      if (!url && !customURL) {
        throw new HttpError(400, "No URL provided for the API request")
      }

      const fullUrl = url
        ? `${env.NEXT_PUBLIC_APP_URL}/api/v1/${url}${buildQueryString(params)}`
        : ""
      const requestUrl = customURL || fullUrl

      // Validate URL
      try {
        new URL(requestUrl)
      } catch {
        throw new HttpError(400, "Invalid URL provided for the API request")
      }

      const requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        cache: "no-store",
        signal: controller.signal,
      }

      if (method === "GET" && body) {
        throw new HttpError(400, "GET request should not have a body")
      }

      if (body) {
        const serializedBody = dataSerializer(body)
        requestOptions.body = JSON.stringify(serializedBody)
      }

      const response = await fetch(requestUrl, requestOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new HttpError(
          response.status,
          errorData.error || "A network error occurred.",
        )
      }

      const textResponse = await response.text()
      let data: unknown

      try {
        data = JSON.parse(textResponse)
      } catch (error) {
        console.error("Error parsing response:", error)
        throw new HttpError(500, "Error parsing response")
      }

      const serializedData = dataSerializer(data)
      const transformedData: ResponseType = transformResponse
        ? transformResponse(serializedData)
        : (serializedData as ResponseType)

      return dataSerializer(transformedData)
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error
      }

      if (attempt < retries - 1) {
        console.warn(`Request failed, retrying (${attempt + 1}/${retries})`)
        return makeRequest(attempt + 1)
      }

      console.error(`Request failed after ${retries} attempts`)
      throw new HttpError(500, "The request failed after multiple attempts")
    }
  }

  try {
    const result = await makeRequest(0)
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    controller.abort()
    throw error
  }
}

export function httpRequest<RequestType = unknown, ResponseType = unknown>(
  urlOrCustomURL: string,
  method: HttpMethod,
  options: Partial<
    Omit<
      RequestConfig<RequestType, ResponseType>,
      "url" | "method" | "customURL"
    >
  > = {},
): Promise<ResponseType> {
  const isCustomURL =
    urlOrCustomURL.startsWith("http://") ||
    urlOrCustomURL.startsWith("https://")

  return makeHttpRequest<RequestType, ResponseType>({
    ...(isCustomURL ? { customURL: urlOrCustomURL } : { url: urlOrCustomURL }),
    method,
    ...options,
  })
}
