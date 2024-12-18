import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import SolanaConnection from './components/SolanaConnection'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Web3 Automated Store',
  description: 'An automated store powered by Solana blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-radial`}>
        <header className="glass fixed top-0 left-0 right-0 z-10">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-glow">Web3 Automated Store</Link>
            <div className="space-x-4">
              <Link href="/products" className="text-glow hover:text-white transition-colors">Products</Link>
              <Link href="/inventory" className="text-glow hover:text-white transition-colors">Inventory</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4 pt-24">
          {children}
        </main>
        <SolanaConnection />
      </body>
    </html>
  )
}
