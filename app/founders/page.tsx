import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        {/* You might want to add a background canvas here like on the main page */}
      </div>

      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-white glow-text">LUCID</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              SOLUTION DESIGNERS
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#work" className="text-gray-300 transition-all duration-300">
              Our Work
            </Link>
            <Link href="/#philosophy" className="text-gray-300 transition-all duration-300">
              Philosophy
            </Link>
            <Link href="/founders" className="text-gray-300 transition-all duration-300">
              Founders
            </Link>
            <Link href="/#join" className="text-gray-300 transition-all duration-300">
              Join Us
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <section id="founders">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 glow-text font-heading">The Founders</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A synergistic partnership between visionary technology and strategic execution
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Eliáš Bauer */}
              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card">
                <CardHeader className="text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-900/50 to-gray-800 rounded-full mx-auto mb-6 glow-avatar flex items-center justify-center">
                    <Image
                      src="/elias.jpeg"
                      alt="Eliáš Bauer"
                      width={160}
                      height={160}
                      className="rounded-full opacity-80"
                    />
                  </div>
                  <CardTitle className="text-3xl glow-text text-white font-heading">Eliáš Bauer</CardTitle>
                  <CardDescription className="text-lg text-purple-400 font-semibold">
                    Chief Inventor & Player-Coach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    A polymath and creative technologist with a background in AI, VR/AR, and philosophy. The visionary
                    driving the deep R&D, asking "Why?" and "What if?".
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Driven by the Grand Ambition—from understanding simple flocking behaviors (Boids) to mapping the
                    complexities of consciousness and intelligence.
                  </p>
                  <p className="font-semibold text-purple-400 glow-text-purple">He builds the engine.</p>
                </CardContent>
              </Card>

              {/* Petr Václavek */}
              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card">
                <CardHeader className="text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-900/50 to-gray-800 rounded-full mx-auto mb-6 glow-avatar flex items-center justify-center">
                    <Image
                      src="/petr.jpeg"
                      alt="Petr Václavek"
                      width={160}
                      height={160}
                      className="rounded-full opacity-80"
                    />
                  </div>
                  <CardTitle className="text-3xl glow-text text-white font-heading">Petr Václavek</CardTitle>
                  <CardDescription className="text-lg text-purple-400 font-semibold">
                    Ethical Venture Builder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    An expert in innovation, strategy, and business development. The pragmatic force translating complex
                    ideas into successful, human-centric ventures.
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Specializes in bridging understanding gaps, making the complex accessible, and ensuring that
                    breakthrough technologies create positive impact.
                  </p>
                  <p className="font-semibold text-purple-400 glow-text-purple">He charts the course and builds the ship.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
} 