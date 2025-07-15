import type { Metadata } from "next"
import { Outfit, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" })

export const metadata: Metadata = {
  title: "Lucid Solution Designers",
  description:
    "A creative technology and venture studio that transforms fundamental insights about intelligence, systems, and human potential into world-class companies, transformative technologies, and thought-provoking art.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${outfit.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
