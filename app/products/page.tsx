'use client'

import { useState, useEffect, useRef } from 'react'
import { Connection } from '@solana/web3.js'
import GlassCard from '../components/GlassCard'
import Head from 'next/head'
import Script from 'next/script'

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

declare global {
  interface Window {
    VANTA: {
      NET: (options: object) => { destroy: () => void }
    }
  }
}

export default function Products() {
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

  const [products, setProducts] = useState<Product[]>([])
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    const conn = new Connection('https://api.devnet.solana.com')
    setConnection(conn)

    setProducts([
      { id: '1', name: 'Coke Can', price: 1, stock: 10 },
      { id: '2', name: 'Lays Chips', price: 2, stock: 5 },
      { id: '3', name: 'Doritos', price: 3, stock: 15 },
    ])
  }, [])

  return (
    <>
      <Head>
        <title>Available Products</title>
        <meta name="description" content="Available Products" />
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
        <h2 className="text-3xl font-bold mb-6 text-center text-glow">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <GlassCard key={product.id} className="glass-hover">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="mb-1">Price: {product.price} SOL</p>
              <p>In Stock: {product.stock}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  )
}