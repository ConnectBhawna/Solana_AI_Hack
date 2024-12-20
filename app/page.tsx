'use client'

import { useState } from 'react'
import InventoryDashboard from '@/components/inventory-dashboard'
import AvailableProducts from '@/components/available-products'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Home() {
  const [userType, setUserType] = useState<'manager' | 'customer'>('customer')

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <Button
          variant={userType === 'manager' ? 'default' : 'outline'}
          onClick={() => setUserType('manager')}
        >
          View as Store Manager
        </Button>
        <Button
          variant={userType === 'customer' ? 'default' : 'outline'}
          onClick={() => setUserType('customer')}
        >
          View as Customer
        </Button>
      </div>

      <motion.div
        key={userType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {userType === 'manager' ? <InventoryDashboard /> : <AvailableProducts />}
      </motion.div>
    </div>
  )
}

