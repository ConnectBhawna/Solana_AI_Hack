"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GlassCard from './components/GlassCard'
import Head from 'next/head'
import Script from 'next/script'

// Extend the Window interface to include VANTA
declare global {
  interface Window {
    VANTA: {
      NET: (options: object) => { destroy: () => void }
    }
  }
}

export default function Home() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<{ destroy: () => void } | null>(null)

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.NET({
          el: vantaRef.current!,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x55c594,
          backgroundColor: 0x0,
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <Head>
        <title>Web3 Automated Store</title>
        <meta name="description" content="Welcome to Web3 Automated Store" />
      </Head>

      {/* Load Three.js and Vanta.js */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js" strategy="beforeInteractive" />
      {/* Vanta Background */}
      <div
        ref={vantaRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      ></div>

      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <GlassCard className="text-center mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 text-glow">
            Welcome to Web3 Automated Store
          </h1>
          <p className="mb-6">
            Experience the future of shopping with our blockchain-powered automated store.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link
              href="/products"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded transition-colors"
            >
              View Products
            </Link>
            <Link
              href="/inventory"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold py-2 px-4 rounded transition-colors"
            >
              Manage Inventory
            </Link>
          </div>
        </GlassCard>
      </div>
    </>
  )
}