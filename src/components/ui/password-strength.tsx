"use client"

// hooks
import { useState, useEffect } from "react"

// utils
import { motion } from "framer-motion"

interface PasswordStrengthMeterProps {
  password: string | undefined | null
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const calculateStrength = (pwd: string) => {
      let score = 0
      if (pwd.length >= 12) score++
      if (/[a-z]/.test(pwd)) score++
      if (/[A-Z]/.test(pwd)) score++
      if (/\d/.test(pwd)) score++
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++
      return score
    }

    if (!password) {
      setStrength(0)
      setMessage("")
      return
    }

    const newStrength = calculateStrength(password)
    setStrength(newStrength)

    switch (newStrength) {
      case 0:
      case 1:
        setMessage("Very weak")
        break
      case 2:
        setMessage("Weak")
        break
      case 3:
        setMessage("Moderate")
        break
      case 4:
        setMessage("Strong")
        break
      case 5:
        setMessage("Very strong")
        break
      default:
        setMessage("")
    }
  }, [password])

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-orange-500"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-blue-500"
      case 5:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  if (!password) {
    return null
  }

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className={`text-sm mt-1 ${getColor().replace("bg-", "text-")}`}>
        {message}
      </p>
    </div>
  )
}

export default PasswordStrengthMeter
