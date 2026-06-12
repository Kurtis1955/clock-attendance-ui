"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FiUser, FiLock, FiShield } from "react-icons/fi"
import { MdFingerprint } from "react-icons/md"
import { HiOutlineChartBar } from "react-icons/hi"

export default function LoginPage() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 p-6">
      <div className="h-full w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid h-full lg:grid-cols-2">
          {/* Left Panel */}
          <div className="relative h-full overflow-hidden bg-[#0f172a] px-10 py-14 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e293b,transparent_45%)]" />

            <div className="relative z-10">
              <div className="mb-4">
                <h1 className="text-xl leading-tight font-bold">
                  Biometric Hub
                  <span className="mt-2 block text-4xl text-[#eab308]">
                    Management Platform
                  </span>
                </h1>
              </div>

              <div className="max-w-xl">
                <p className="mt-1 text-lg text-slate-300">
                  Centralized User, Device & Attendance Management
                </p>
              </div>

              <div className="mt-4 h-80 w-full rounded-lg bg-slate-700/10">
                <img
                  src="/assests/zkteco-devices.png"
                  alt="ZKTeco biometric devices"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div className="mt-12">
                <h3 className="mb-6 text-xl font-semibold">Powerful Features</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <FeatureCard
                    icon={<FiShield />}
                    title="User & Role Management"
                    description="Manage users, roles and permissions."
                  />
                  <FeatureCard
                    icon={<MdFingerprint />}
                    title="Biometric Enrollment"
                    description="Enroll and synchronize biometrics."
                  />
                  <FeatureCard
                    icon={<HiOutlineChartBar />}
                    title="Real-Time Attendance"
                    description="Monitor attendance instantly."
                  />
                </div>
              </div>

              {/* <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
                © 2026 Supertech Solutions
              </div> */}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex items-center justify-center bg-white p-8 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-[#eab308]">
                  <FiShield />
                  <span className="font-medium">Secure Login</span>
                </div>
                <h2 className="text-5xl font-bold text-[#0f172a]">
                  Welcome Back
                </h2>
                <p className="mt-4 text-slate-500">
                  Sign in to continue managing biometric devices, users and
                  attendance records.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium"
                  >
                    Username or Email
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="username"
                      placeholder="Enter username or email"
                      className="h-14 pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      className="h-14 pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm">
                      Remember Me
                    </label>
                  </div>
                  <Link
                    href="#"
                    className="text-sm font-medium text-[#0f172a]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="h-14 w-full bg-[#eab308] text-black hover:bg-yellow-500"
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-10 border-t pt-6 text-center text-sm text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <FiShield />
                  Your connection is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-slate-700 bg-white/5 backdrop-blur">
      <CardContent className="p-2">
        <div className="mb-3 text-2xl text-[#eab308]">{icon}</div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      </CardContent>
    </Card>
  )
}
