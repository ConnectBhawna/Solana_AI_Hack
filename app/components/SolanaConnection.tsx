'use client'

import { useState, useEffect } from 'react'
import { Connection } from '@solana/web3.js'
import GlassCard from './GlassCard'

export default function SolanaConnection() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const connection = new Connection('https://api.devnet.solana.com')
    connection.getVersion()
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
  }, [])

  return (
    <GlassCard className="fixed bottom-4 right-4 text-sm">
      Solana: {connected ? 'Connected' : 'Disconnected'}
    </GlassCard>
  )
}

