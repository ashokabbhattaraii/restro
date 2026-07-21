import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { connectDB } from '../config/db'
import { Admin } from '../models/Admin'

async function seedAdmin() {
  await connectDB()

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD missing in .env')
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log('Admin already exists — skipping seed.')
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.create({ email, passwordHash, name: 'Restaurant Admin' })

  console.log(`Admin seeded: ${email}`)
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
