"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Lightbulb, Palette, ArrowRight, Mail, Phone, MapPin, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Environment, Sphere } from "@react-three/drei"
import * as THREE from "three"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Boids simulation component
function BoidsSimulation({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null)
  const [boids] = useState(() => {
    const boidCount = 7
    const boids = []
    for (let i = 0; i < boidCount; i++) {
      boids.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
        ),
      })
    }
    return boids
  })

  useFrame((state) => {
    if (!pointsRef.current) return

    const { viewport } = state
    const target = new THREE.Vector3((mousePosition.x * viewport.width) / 2, (mousePosition.y * viewport.height) / 2, 0)

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    boids.forEach((boid, i) => {
      // Simple flocking behavior
      const separation = new THREE.Vector3()
      const alignment = new THREE.Vector3()
      const cohesion = new THREE.Vector3()
      let neighbors = 0

      boids.forEach((other, j) => {
        if (i !== j) {
          const distance = boid.position.distanceTo(other.position)
          if (distance < 3) {
            // Separation
            const diff = new THREE.Vector3().subVectors(boid.position, other.position)
            diff.normalize()
            diff.divideScalar(distance)
            separation.add(diff)

            // Alignment and Cohesion
            alignment.add(other.velocity)
            cohesion.add(other.position)
            neighbors++
          }
        }
      })

      if (neighbors > 0) {
        alignment.divideScalar(neighbors)
        cohesion.divideScalar(neighbors)
        cohesion.sub(boid.position)

        separation.multiplyScalar(0.1)
        alignment.multiplyScalar(0.05)
        cohesion.multiplyScalar(0.005)

        boid.velocity.add(separation)
        boid.velocity.add(alignment)
        boid.velocity.add(cohesion)
      }

      // Attraction to mouse
      const attraction = new THREE.Vector3().subVectors(target, boid.position)
      attraction.multiplyScalar(0.001)
      boid.velocity.add(attraction)

      // Limit speed
      if (boid.velocity.length() > 0.2) {
        boid.velocity.normalize().multiplyScalar(0.2)
      }

      // Update position
      boid.position.add(boid.velocity)

      // Wrap around edges
      if (boid.position.x > 10) boid.position.x = -10
      if (boid.position.x < -10) boid.position.x = 10
      if (boid.position.y > 5) boid.position.y = -5
      if (boid.position.y < -5) boid.position.y = 5
      if (boid.position.z > 5) boid.position.z = -5
      if (boid.position.z < -5) boid.position.z = 5

      // Update positions array
      positions[i * 3] = boid.position.x
      positions[i * 3 + 1] = boid.position.y
      positions[i * 3 + 2] = boid.position.z
    })

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const positions = new Float32Array(boids.length * 3)
  boids.forEach((boid, i) => {
    positions[i * 3] = boid.position.x
    positions[i * 3 + 1] = boid.position.y
    positions[i * 3 + 2] = boid.position.z
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#c084fc"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Floating particles background
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
  }

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#D91BFFFF" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  )
}

export default function LucidSolutionDesigners() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <Dialog>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Background Canvas */}
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <FloatingParticles />
          </Canvas>
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-white font-light font-heading glow-text">LUCID</span>
              <br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-heading">
                SOLUTION DESIGNERS
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#work" className="text-gray-300 transition-all duration-300">
                Our Work
              </Link>
              <Link href="#philosophy" className="text-gray-300 transition-all duration-300">
                Philosophy
              </Link>
              <Link href="/founders" className="text-gray-300 transition-all duration-300">
                Founders
              </Link>
              <Link href="#join" className="text-gray-300 transition-all duration-300">
                Join Us
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section with 3D Background */}
        <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
              <BoidsSimulation mousePosition={mousePosition} />
              <Environment preset="city" />
            </Canvas>
          </div>

          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <div className="flex flex-col items-center justify-center">
              <h1 className="mb-10 font-heading">
                <span className="block text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg animate-fade-in">
                  We don't predict the future.
                </span>
                <span className="block text-5xl md:text-8xl lg:text-9xl font-black tracking-tight text-white glow-text mt-4 animate-fade-in-slow">
                  We design it
                </span>
                <span className="block text-2xl md:text-4xl lg:text-5xl text-purple-300 glow-text-subtle italic mt-6 animate-fade-in-delay">
                  from First Principles.
                </span>
              </h1>


            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              A creative technology and venture studio that transforms fundamental insights about intelligence, systems,
              and human potential into world-class companies, transformative technologies, and thought-provoking art.
            </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-purple-600 text-white px-8 py-4 text-lg glow-button-purple border-0 shadow-2xl shadow-purple-500/25"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Become a Co-Founder
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 px-8 py-4 text-lg bg-transparent glow-button-outline"
              >
                Explore Our Work
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black relative z-10">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 glow-text font-heading">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed glow-text-subtle">
              To design and build the future by transforming fundamental insights about intelligence, systems, and human
              potential into world-class companies, transformative technologies, and thought-provoking art.
            </p>
          </div>
        </section>

        {/* Our Work - Three Pillars */}
        <section id="work" className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 glow-text font-heading">Our Work</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Three pillars that bridge the gap between complex ideas and human understanding
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pillar 1: The Inverted Incubator */}
              <Card className="bg-purple-900/20 border-gray-700 transition-all duration-500 backdrop-blur-sm glow-card">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 glow-icon">
                    <Brain className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl mb-2 glow-text text-white font-heading">The Inverted Incubator</CardTitle>
                  <CardDescription className="text-lg text-purple-400">Venture Studio</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    We don't wait for ideas; we curate and pre-verify 100 startup concepts and build their MVPs. We solve
                    problems from first principles.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    We partner with ambitious student talent, empowering them to become co-founders and drive these
                    ventures forward with our technical foundation and strategic guidance.
                  </p>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    Applied Philosophy
                  </Badge>
                </CardContent>
              </Card>

              {/* Pillar 2: Client Solutions */}
              <Card className="bg-purple-900/20 border-gray-700 transition-all duration-500 backdrop-blur-sm glow-card">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 glow-icon">
                    <Lightbulb className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl mb-2 glow-text text-white font-heading">Client Solutions</CardTitle>
                  <CardDescription className="text-lg text-purple-400">Strategic Consulting</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    We partner with select companies to bring our unique approach to their challenges. We are not typical
                    consultants; we are deep, creative problem-solvers.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    We improve processes, boost efficiency, and architect out-of-the-box solutions by applying
                    cutting-edge technology and systems thinking.
                  </p>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    Emergent Systems
                  </Badge>
                </CardContent>
              </Card>

              {/* Pillar 3: Art & Exploration */}
              <Card className="bg-purple-900/20 border-gray-700 transition-all duration-500 backdrop-blur-sm glow-card">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 glow-icon">
                    <Palette className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl mb-2 glow-text text-white font-heading">Art & Exploration</CardTitle>
                  <CardDescription className="text-lg text-purple-400">Creative Works</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    We pursue art projects that push boundaries, both for public engagement and for aligned companies as
                    innovative marketing.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Interactive installations, generative art, immersive VR/AR experiences that explore consciousness and
                    the beauty of complex systems.
                  </p>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    Pure R&D
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="py-20 bg-gradient-to-b from-black to-gray-900/50 relative z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 glow-text font-heading">Our Philosophy</h2>
              <p className="text-xl text-gray-400">The fundamental principles that drive our approach to innovation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card-subtle">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white glow-text font-heading">Life as Problem-Solving Matter</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We believe that life itself is a computational process—an emergent phenomenon of matter organizing
                    itself to solve problems. This insight guides our approach to building intelligent systems and
                    understanding complex behaviors.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card-subtle">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white glow-text font-heading">Long-Term Laziness</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We invest effort now to build elegant, leveraged systems that create compounding value. By designing
                    robust foundations, we enable exponential returns on our intellectual investment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card-subtle">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white glow-text font-heading">Emergent Systems</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Complex behaviors arise from simple rules. We study and harness emergence—from flocking algorithms to
                    neural networks—to create solutions that are greater than the sum of their parts.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-gray-700 backdrop-blur-sm glow-card-subtle">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white glow-text font-heading">First Principles Thinking</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We break down complex problems to their fundamental components, questioning assumptions and building
                    solutions from the ground up. This approach reveals opportunities others miss.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section id="join" className="py-20 bg-gradient-to-r from-purple-900/30 to-black relative z-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 glow-text font-heading">Solve a Problem Worth Solving</h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed">
              Join us as a co-founder and help build the next generation of intelligent systems, transformative ventures,
              and boundary-pushing art.
            </p>

            <DialogTrigger asChild>
              <Button size="lg" className="bg-purple-600 text-white px-8 py-4 text-lg glow-button-purple">
                <Zap className="mr-2 h-5 w-5" />
                Apply to Become a Co-Founder
              </Button>
            </DialogTrigger>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900/50 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 glow-text font-heading">Bring a New Paradigm to Your Business</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Ready to transform your organization with cutting-edge technology and systems thinking?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Dialog>
                <div className="flex flex-col items-center justify-center">
                  <Card className="bg-purple-900/50 border-gray-700 backdrop-blur-sm glow-card w-full">
                    <CardHeader>
                      <CardTitle className="text-3xl glow-text text-white font-heading">Schedule a Consultation</CardTitle>
                      <CardDescription className="text-gray-400">
                        Let's discuss how we can help solve your most complex challenges
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-600 glow-button-purple">
                          Request Consultation
                        </Button>
                      </DialogTrigger>
                    </CardContent>
                  </Card>
                </div>

                <DialogContent className="bg-black/80 backdrop-blur-xl border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl glow-text text-white font-heading">Schedule a Consultation</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Let's discuss how we can help solve your most complex challenges
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-6">
                    <Input
                      placeholder="Company Name"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
                    />
                    <Input
                      placeholder="Your Name"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
                    />
                    <Textarea
                      placeholder="Describe your challenge"
                      rows={4}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
                    />
                    <Button className="w-full bg-purple-600 glow-button-purple">
                      Submit Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="space-y-8">
            {/*     <Card className="bg-purple-900/50 border-gray-700 backdrop-blur-sm glow-card-subtle">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 glow-text font-heading">Get in Touch</h3>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center glow-icon">
                          <Mail className="h-6 w-6 text-purple-400" />
                        </div>
                        <span className="text-gray-300">hello@lucidsolutiondesigners.com</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center glow-icon">
                          <Phone className="h-6 w-6 text-purple-400" />
                        </div>
                        <span className="text-gray-300">+420 XXX XXX XXX</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center glow-icon">
                          <MapPin className="h-6 w-6 text-purple-400" />
                        </div>
                        <span className="text-gray-300">Prague, Czech Republic</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
 */}
                <Card className="bg-purple-900/50 border-gray-700 backdrop-blur-sm glow-card-subtle">
                  <CardContent className="p-8">
                    <h4 className="font-semibold mb-4 text-white glow-text font-heading">What We Offer</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full glow-dot"></div>
                        <span>Process optimization and efficiency improvements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full glow-dot"></div>
                        <span>Cutting-edge AI and machine learning solutions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full glow-dot"></div>
                        <span>Immersive VR/AR experiences</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full glow-dot"></div>
                        <span>Strategic technology consulting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full glow-dot"></div>
                        <span>Custom software development</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="text-3xl font-bold mb-6 font-heading">
                  <span className="glow-text">LUCID</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    SOLUTION DESIGNERS
                  </span>
                </div>
                <p className="text-gray-400 max-w-md leading-relaxed">
                  Transforming fundamental insights about intelligence, systems, and human potential into world-class
                  companies, transformative technologies, and thought-provoking art.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-6 text-purple-400 glow-text-purple font-heading">Our Work</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <Link href="#" className="transition-colors">
                      Venture Studio
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors">
                      Client Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors">
                      Art & Exploration
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-6 text-purple-400 glow-text-purple font-heading">Connect</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <Link href="#" className="transition-colors">
                      Join Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors">
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors">
                      Twitter
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Separator className="my-12 bg-gray-800" />
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500">
              <p>&copy; 2024 Lucid Solution Designers. All rights reserved.</p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <Link href="#" className="transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <DialogContent className="bg-black/80 backdrop-blur-xl border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl glow-text font-heading">Become a Co-Founder</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tell us about yourself and the problems you're passionate about solving
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6">
            <Input
              placeholder="Your Name"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
            />
            <Input
              type="email"
              placeholder="Your Email"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
            />
            <Input
              placeholder="Your Background/Expertise"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
            />
            <Textarea
              placeholder="What problem do you want to solve?"
              rows={4}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 glow-input"
            />
            <Button className="w-full bg-purple-600 text-white py-3 glow-button-purple">
              <Zap className="mr-2 h-4 w-4" />
              Submit Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  )
}
