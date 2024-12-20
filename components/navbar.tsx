"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider"
import { CHAIN_NAMESPACES } from "@web3auth/base"
import { PublicKey, Connection, clusterApiUrl, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
  const [provider, setProvider] = useState<SolanaPrivateKeyProvider | null>(null)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!
        const googleVerifier = process.env.NEXT_PUBLIC_GOOGLE_VERIFIER!
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!

        if (!clientId || !googleVerifier || !googleClientId) {
          throw new Error("Missing required environment variables for Web3Auth configuration.")
        }
        
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Solana Devnet
          rpcTarget: clusterApiUrl("devnet"),
          displayName: "Solana Devnet",
          blockExplorer: "https://explorer.solana.com/?cluster=devnet",
          ticker: "SOL",
          tickerName: "Solana",
        }

        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig }
        })

        const web3authInstance = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          chainConfig,
          privateKeyProvider
        })

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          adapterSettings: {
            network: "sapphire_devnet",
            uxMode: "redirect", 
            loginConfig: {
              google: {
                name: "Custom Auth Google Login",
                verifier: googleVerifier ,
                typeOfLogin: "google",
                clientId: googleClientId
              },
            },
          },
        })

        web3authInstance.configureAdapter(openloginAdapter)
        await web3authInstance.init()
        setWeb3auth(web3authInstance)
        setProvider(privateKeyProvider)
        console.log("Web3Auth initialized successfully")

        // Check if user is already logged in
        if (web3authInstance.provider) {
          const accounts = await privateKeyProvider.request({ method: "getAccounts" })
          if (accounts && accounts.length > 0) {
            const publicKeyStr = accounts[0] as string
            const solanaPublicKey = new PublicKey(publicKeyStr)
            setPublicKey(solanaPublicKey)
            console.log("Wallet already connected, public key:", solanaPublicKey.toString())

            // Fetch user info
            const userInfo = await web3authInstance.getUserInfo()
            setUserName(userInfo.name)
            console.log("User info:", userInfo)
          }
        }
      } catch (error) {
        console.error("Web3Auth init error:", error)
      }
    }
    initWeb3Auth()
  }, [])

  async function connectWallet() {
    if (!web3auth || isConnecting || publicKey) {
      console.log("Web3Auth not initialized, already connecting, or already connected")
      return
    }
    try {
      setIsConnecting(true)
      console.log("Connecting to Web3Auth...")
      const web3authProvider = await web3auth.connectTo("openlogin", {
        loginProvider: "google",
        extraLoginOptions: {
          display: "popup",
          prompt: "select_account"
        }
      })
      if (web3authProvider) {
        console.log("Web3Auth connected successfully")
        const solanaWallet = new SolanaPrivateKeyProvider(web3authProvider)
        setProvider(solanaWallet)

        const accounts = await solanaWallet.request({ method: "getAccounts" })
        const publicKeyStr = accounts[0] as string
        const solanaPublicKey = new PublicKey(publicKeyStr)
        setPublicKey(solanaPublicKey)
        console.log("Wallet connected, public key:", solanaPublicKey.toString())

        // Fetch user info
        const userInfo = await web3auth.getUserInfo()
        setUserName(userInfo.name)
        console.log("User info:", userInfo)
      }
    } catch (error: any) {
      if (error.code === "already_connected") {
        console.log("Wallet is already connected.")
      } else {
        console.error("Connect wallet error:", error)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  async function logout() {
    if (!web3auth) return
    try {
      await web3auth.logout()
      setProvider(null)
      setPublicKey(null)
      setUserName(null)
      console.log("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }


  return (
    <nav className="border-b border-white/10 bg-black/60 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-400 ">
          Solana Web3 Store
        </h1>
        <div className="flex items-center space-x-4">
          {userName && <span className="text-white">{userName}</span>}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <SunIcon className={`h-5 w-5 transition-all ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
            <MoonIcon className={`h-5 w-5 absolute transition-all ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {!userName && (
            <Button 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Login "}
            </Button>
          )}
          {userName && (
            <Button 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={logout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}