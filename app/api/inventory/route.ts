import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('Inventory')
    const data = await collection.find({}).toArray()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return new NextResponse('Failed to fetch inventory', { status: 500 })
  }
}