import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Code, DollarSign } from "lucide-react"

export default function HomePage({ user }) {
  return (
    <div className="min-h-screen nexus-gradient">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="text-red-500">NEXUS</span>
              <span className="text-white">PROTOCOLS</span>
            </h1>
            <div className="h-1 w-32 bg-red-500 mx-auto"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for <span className="text-red-400 font-semibold">script sharing</span>,{" "}
            <span className="text-red-400 font-semibold">gateway monetization</span>, and{" "}
            <span className="text-red-400 font-semibold">community collaboration</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/scripts">
              <Button size="lg" className="nexus-button px-8 py-4 text-lg font-semibold">
                <Code className="mr-2 h-5 w-5" />
                Browse Scripts
              </Button>
            </Link>
            <Link href={user ? "/scripts" : "/auth/signup"}>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-105"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Create - Get Paid
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
