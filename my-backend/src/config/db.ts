import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not defined in .env')

  try {
    await mongoose.connect(uri, { dbName: 'nepali_restaurant' })
    console.log('MongoDB connected to Restro cluster')
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
}
