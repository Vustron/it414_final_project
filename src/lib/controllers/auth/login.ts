// utils
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { handleErrorResponse } from "@/lib/helpers"
import { NextResponse } from "next/server"
import { verify } from "@node-rs/argon2"

// configs
import { env } from "@/lib/config/env.mjs"
import prisma from "@/lib/config/prisma"

// types
import type { LoginValues } from "@/lib/validation"
import type { NextRequest } from "next/server"

// login controller
export async function loginController(request: NextRequest) {
  try {
    // get the request body
    const loginBody = await requestBodyHandler<LoginValues>(request)

    // parse the request body
    const { username, password } = loginBody

    // throw error if any required fields are missing
    const requiredFields: (keyof typeof loginBody)[] = ["username", "password"]

    // check if the required fields are there on the request
    const errorResponse = checkRequiredFields(loginBody, requiredFields)

    if (errorResponse)
      // return the error response if there is any
      return errorResponse

    // get the user from the database
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        passwordHash: true,
        salt: true,
      },
    })

    if (!existingUser || !existingUser.passwordHash || !existingUser.salt) {
      // check if the user exists and has both password hash and salt
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      )
    }

    // Get the pepper from the environment
    const pepper = env.PEPPER

    // Combine the password with pepper and salt
    const pepperPassword = password + pepper
    const saltedPepperPassword = pepperPassword + existingUser.salt

    // verify the password with salt and pepper
    const validPassword = await verify(
      existingUser.passwordHash,
      saltedPepperPassword,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      },
    )

    if (!validPassword) {
      // check if the password is valid
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      )
    }

    return NextResponse.json({ userId: existingUser.id }, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
