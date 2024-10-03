// utils
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { handleErrorResponse } from "@/lib/helpers"
import { generateIdFromEntropySize } from "lucia"
import { NextResponse } from "next/server"
import { hash } from "@node-rs/argon2"
import crypto from "node:crypto"

// configs
import { env } from "@/lib/config/env.mjs"
import prisma from "@/lib/config/prisma"

// types
import type { RegisterValues } from "@/lib/validation"
import type { NextRequest } from "next/server"

// register controller
export async function registerController(request: NextRequest) {
  try {
    // get the request body
    const registerBody = await requestBodyHandler<RegisterValues>(request)

    // parse the request body
    const { username, email, password, cpassword, userType, avatarUrl } =
      registerBody

    // throw error if any required fields are missing
    const requiredFields: (keyof typeof registerBody)[] = [
      "username",
      "email",
      "password",
      "cpassword",
      "userType",
    ]

    // check if the required fields are there on the request
    const errorResponse = checkRequiredFields(registerBody, requiredFields)

    if (errorResponse)
      // return the error response if there is any
      return errorResponse

    if (password !== cpassword) {
      // Check if password matches confirm password
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      )
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex")
    // Get the pepper from the environment
    const pepper = env.PEPPER
    // Combine password with salt and pepper
    const pepperPassword = password + pepper
    const saltedPepperPassword = pepperPassword + salt

    // hash the password with salt and pepper
    const passwordHash = await hash(saltedPepperPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    // generate a user id
    const userId = generateIdFromEntropySize(10)

    // find existing name of user
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    if (existingUsername) {
      // throw error if user name already exists
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      )
    }

    // find existing email of user
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail) {
      // throw error if user email already exists
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 400 },
      )
    }

    // create user
    await prisma.user.create({
      data: {
        id: userId,
        username,
        email,
        passwordHash,
        salt,
        userType,
        avatarUrl,
      },
    })

    return NextResponse.json({ userId }, { status: 200 })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
