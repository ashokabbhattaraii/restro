import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { connectDB } from '../config/db'
import { Admin } from '../models/Admin'
import { MenuItem } from '../models/MenuItem'
import { Event } from '../models/Event'
import { GalleryImage } from '../models/GalleryImage'
import { Staff } from '../models/Staff'
import { Reservation } from '../models/Reservation'
import { Message } from '../models/Message'
import { Offer } from '../models/Offer'
import { AuditLog } from '../models/AuditLog'

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB — seeding...')

  // ── 1. Admin ──
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nepalirestaurant.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const existingAdmin = await Admin.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await Admin.create({ email: adminEmail, passwordHash, name: 'Restaurant Admin' })
    console.log(`✓ Admin seeded: ${adminEmail}`)
  } else {
    console.log('→ Admin exists, skipping')
  }

  // ── 2. Menu Items ──
  const menuData = [
    { name: 'Dal Bhat Set', category: 'Nepali', description: 'Steamed rice, lentil soup, seasonal tarkari, achar, and crisp papad.', price: 'IQD 8,500', dietary: ['VEG', 'HALAL'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Momo Steamed', category: 'Nepali', description: 'Hand-folded Nepali dumplings with sesame tomato achar.', price: 'IQD 6,000', dietary: ['SPICY', 'HALAL'], image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Gundruk Soup', category: 'Nepali', description: 'Fermented greens, tomato, garlic, and mountain herbs.', price: 'IQD 5,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Sel Roti', category: 'Nepali', description: 'Crisp rice ring with cardamom and house chutney.', price: 'IQD 4,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Chicken Choila', category: 'Nepali', description: 'Spiced grilled chicken with ginger, garlic, and fresh herbs.', price: 'IQD 7,500', dietary: ['SPICY', 'HALAL'], image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Butter Chicken', category: 'Indian', description: 'Tandoor chicken simmered in a velvet tomato and fenugreek sauce.', price: 'IQD 9,000', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Biryani', category: 'Indian', description: 'Layered basmati rice, saffron, herbs, and raita.', price: 'IQD 10,000', dietary: ['SPICY', 'HALAL'], image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Palak Paneer', category: 'Indian', description: 'Spinach puree, paneer, garlic, and cumin.', price: 'IQD 8,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Naan', category: 'Indian', description: 'Fresh tandoor bread brushed with butter.', price: 'IQD 2,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1626078299034-2fdc62db6cdc?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Chicken Tikka Masala', category: 'Indian', description: 'Marinated chicken in a spiced creamy curry sauce.', price: 'IQD 9,500', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Kung Pao Chicken', category: 'Chinese', description: 'Wok-fired chicken, roasted peanuts, dried chili, and spring onion.', price: 'IQD 9,500', dietary: ['SPICY', 'HALAL'], image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Fried Rice', category: 'Chinese', description: 'Jasmine rice, egg, vegetables, and soy.', price: 'IQD 7,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Spring Rolls', category: 'Chinese', description: 'Golden rolls with sweet chili dip.', price: 'IQD 5,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1606525437679-037aca6a5e73?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Hot & Sour Soup', category: 'Chinese', description: 'Peppery broth with mushroom, egg, and tofu.', price: 'IQD 4,500', dietary: ['SPICY'], image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Nepali Noodles', category: 'Chinese', description: 'Stir-fried noodles with vegetables and house soy.', price: 'IQD 6,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Himalayan Mixed Grill', category: 'BBQ & Grill', description: 'Charcoal-grilled kebab, tikka, fish, and spiced vegetables.', price: 'IQD 15,000', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Seekh Kebab', category: 'BBQ & Grill', description: 'Minced lamb, cumin, coriander, and chili.', price: 'IQD 8,500', dietary: ['SPICY', 'HALAL'], image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Grilled Fish', category: 'BBQ & Grill', description: 'Whole fish with lemon, garlic, and mountain herbs.', price: 'IQD 11,000', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Tandoori Chicken', category: 'BBQ & Grill', description: 'Chicken marinated in yogurt and spice, cooked in tandoor.', price: 'IQD 10,000', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Lamb Chops', category: 'BBQ & Grill', description: 'Grilled lamb chops with rosemary and mint chutney.', price: 'IQD 14,000', dietary: ['HALAL'], image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Himalayan Mango Lassi', category: 'Drinks & Bar', description: 'Fresh mango, chilled yogurt, cardamom, and a saffron finish.', price: 'IQD 3,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=1000&q=85', featured: true },
    { name: 'Nepali Chai', category: 'Drinks & Bar', description: 'Black tea, milk, ginger, and warm spices.', price: 'IQD 2,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Cocktail of the Day', category: 'Drinks & Bar', description: 'Bartender\'s seasonal gold-rimmed pour.', price: 'IQD 7,000', dietary: [], image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Imported Beer', category: 'Drinks & Bar', description: 'A rotating selection served cold.', price: 'IQD 5,000', dietary: [], image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Masala Soda', category: 'Drinks & Bar', description: 'Sparkling water with black salt and aromatic spices.', price: 'IQD 2,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Kheer', category: 'Desserts', description: 'Rice pudding with cardamom, nuts, and rose.', price: 'IQD 3,500', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1605197161470-5d2a9af1cdb0?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Gulab Jamun', category: 'Desserts', description: 'Warm milk dumplings in saffron syrup.', price: 'IQD 3,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Chocolate Lava Cake', category: 'Desserts', description: 'Dark chocolate center with vanilla cream.', price: 'IQD 5,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?auto=format&fit=crop&w=1000&q=85' },
    { name: 'Jalebi', category: 'Desserts', description: 'Crispy coiled fritters soaked in sugar syrup.', price: 'IQD 3,000', dietary: ['VEG'], image: 'https://images.unsplash.com/photo-1602351447937-745cb7206121?auto=format&fit=crop&w=1000&q=85' },
  ]

  const menuCount = await MenuItem.countDocuments()
  if (menuCount === 0) {
    await MenuItem.insertMany(menuData.map((item) => ({ ...item, visible: true })))
    console.log(`✓ ${menuData.length} menu items seeded`)
  } else {
    console.log(`→ ${menuCount} menu items exist, skipping`)
  }

  // ── 3. Events ──
  const eventCount = await Event.countDocuments()
  if (eventCount === 0) {
    await Event.insertMany([
      { title: 'Live Nepali Folk Music Night', description: 'Acoustic Himalayan melodies, shared plates, and candlelit tables.', date: 'Jun 14', time: '8:00 PM', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85', type: 'Live Music', active: true },
      { title: 'Friday Happy Hour', description: 'Signature cocktails, premium bar bites, and a late-evening dining mood.', date: 'Every Fri', time: '5:00 PM', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=85', type: 'Happy Hour', active: true },
      { title: 'Nepali New Year Celebration', description: 'A festive menu inspired by home kitchens, family tables, and new beginnings.', date: 'Apr 14', time: '7:30 PM', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=85', type: 'Festival', active: true },
      { title: 'Sunday Family Brunch', description: 'A relaxed all-day brunch featuring Himalayan classics and bottomless chai.', date: 'Every Sun', time: '10:00 AM', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85', type: 'Brunch', active: true },
      { title: 'Wine & Dine Evening', description: 'Curated wine pairings with a five-course Himalayan tasting menu.', date: 'Jul 20', time: '7:00 PM', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85', type: 'Fine Dining', active: true },
    ])
    console.log('✓ 5 events seeded')
  } else {
    console.log(`→ ${eventCount} events exist, skipping`)
  }

  // ── 4. Staff ──
  const staffCount = await Staff.countDocuments()
  if (staffCount === 0) {
    await Staff.insertMany([
      { name: 'Aarav Gurung', role: 'Head Chef', department: 'Kitchen', bio: 'Leads the kitchen with Himalayan technique and quiet precision.', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=85', visible: true },
      { name: 'Meera Thapa', role: 'Sous Chef', department: 'Kitchen', bio: 'Shapes the momo, curries, and daily specials with care.', image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=700&q=85', visible: true },
      { name: 'Rohit Singh', role: 'Bar Manager', department: 'Bar', bio: 'Builds elegant cocktails around spice, citrus, and gold-rimmed details.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85', visible: true },
      { name: 'Nadia Karim', role: 'Front of House Manager', department: 'Service', bio: 'Keeps every table moving with warmth and polished timing.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85', visible: true },
      { name: 'Binod Sharma', role: 'Tandoor Chef', department: 'Kitchen', bio: 'Masters the charcoal grill and tandoor with over a decade of experience.', image: 'https://images.unsplash.com/photo-1566554273541-37e7db2d1e1c?auto=format&fit=crop&w=700&q=85', visible: true },
      { name: 'Sita Rai', role: 'Pastry Chef', department: 'Kitchen', bio: 'Creates desserts that blend Nepali tradition with modern pastry art.', image: 'https://images.unsplash.com/photo-1556911220-bffb3bed73b0?auto=format&fit=crop&w=700&q=85', visible: true },
    ])
    console.log('✓ 6 staff members seeded')
  } else {
    console.log(`→ ${staffCount} staff exist, skipping`)
  }

  // ── 5. Gallery ──
  const galleryCount = await GalleryImage.countDocuments()
  if (galleryCount === 0) {
    await GalleryImage.insertMany([
      { title: 'Dal Bhat Table Setting', category: 'Food', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=85', shape: 'tall', order: 1 },
      { title: 'Momo Basket', category: 'Food', image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=1000&q=85', order: 2 },
      { title: 'Moonlit Dining Room', category: 'Dining Area', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85', shape: 'wide', order: 3 },
      { title: 'Premium Bar Counter', category: 'Bar', image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1400&q=85', order: 4 },
      { title: 'Live Music Evening', category: 'Events', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85', shape: 'tall', order: 5 },
      { title: 'Restaurant Frontage', category: 'Exterior', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85', order: 6 },
      { title: 'Butter Chicken Bowl', category: 'Food', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85', order: 7 },
      { title: 'Kung Pao Wok Plate', category: 'Food', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85', shape: 'wide', order: 8 },
      { title: 'Private Table Corner', category: 'Dining Area', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85', shape: 'tall', order: 9 },
      { title: 'Cocktail Service', category: 'Bar', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=85', order: 10 },
      { title: 'Celebration Table', category: 'Events', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=85', order: 11 },
      { title: 'Mixed Grill Platter', category: 'Food', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85', shape: 'tall', order: 12 },
    ])
    console.log('✓ 12 gallery images seeded')
  } else {
    console.log(`→ ${galleryCount} gallery images exist, skipping`)
  }

  // ── 6. Reservations ──
  const reservationCount = await Reservation.countDocuments()
  if (reservationCount === 0) {
    await Reservation.insertMany([
      { name: 'Sara Hadi', phone: '07700000001', email: 'sara@example.com', date: '2026-07-20', time: '7:30 PM', guests: 4, occasion: 'Birthday', requests: 'Vegan options please', status: 'Confirmed' },
      { name: 'Omar Karim', phone: '07700000002', email: 'omar@example.com', date: '2026-07-20', time: '8:00 PM', guests: 2, occasion: 'Date Night', status: 'Confirmed' },
      { name: 'Priya N.', phone: '07700000003', email: 'priya@example.com', date: '2026-07-21', time: '6:30 PM', guests: 6, occasion: 'Family Dinner', status: 'Pending' },
      { name: 'Dara S.', phone: '07700000004', date: '2026-07-22', time: '9:00 PM', guests: 3, occasion: 'Business', status: 'Cancelled' },
      { name: 'Mina A.', phone: '07700000005', email: 'mina@example.com', date: '2026-07-23', time: '7:00 PM', guests: 5, occasion: 'Anniversary', status: 'Confirmed' },
      { name: 'Haval M.', phone: '07700000006', date: '2026-07-24', time: '8:30 PM', guests: 8, occasion: 'Birthday', status: 'Pending' },
      { name: 'Layla A.', phone: '07700000007', email: 'layla@example.com', date: '2026-07-25', time: '7:00 PM', guests: 2, occasion: 'Date Night', status: 'Pending' },
      { name: 'Bikash R.', phone: '07700000008', date: '2026-07-26', time: '6:00 PM', guests: 4, status: 'Confirmed' },
    ])
    console.log('✓ 8 reservations seeded')
  } else {
    console.log(`→ ${reservationCount} reservations exist, skipping`)
  }

  // ── 7. Messages ──
  await Message.deleteMany({})
  console.log('→ Cleared existing messages')
  
  const enquiryMessages = [
      // General inquiries / enquiries
      { name: 'Layla', phone: '07500000001', email: 'layla@example.com', subject: 'Private Event', message: 'Can we book the dining room for 20 guests for a corporate dinner on August 5th?', read: false, replied: false },
      { name: 'Sara', phone: '07500000003', subject: 'Reservation Inquiry', message: 'Do you have outdoor seating available? We would like to reserve for next Friday.', read: false, replied: false },
      { name: 'Omar', email: 'omar@example.com', subject: 'Catering', message: 'Do you offer catering for off-site events? We have a family gathering of about 50 people.', read: false, replied: false },
      { name: 'Priya', phone: '07500000004', email: 'priya@example.com', subject: 'Menu Question', message: 'Are there vegan options available? My partner and I are visiting next week.', read: false, replied: false },
      { name: 'James', phone: '07500000005', subject: 'Hours', message: 'What are your hours on public holidays? We plan to visit on Eid.', read: false, replied: false },
      
    ].map((m) => ({ ...m, contactType: 'enquiry' as const, verified: false }))

  const feedbackMessages = [
      // Verified feedback with ratings (shown on the landing page)
      { name: 'Sarah Johnson', phone: '07701234567', email: 'sarah.j@example.com', subject: 'Amazing dining experience!', message: 'The dal bhat was absolutely incredible and the live music night was unforgettable. The staff treated us like family. Will definitely be back!', read: true, replied: false },
      { name: 'Ahmed Ali', phone: '07509876543', email: 'ahmed.a@example.com', subject: 'Best Nepali food in town', message: 'Had dinner last night and everything was perfect. The butter chicken was the best I\'ve had in years. The cocktail menu is also creative and delicious. Highly recommend!', read: true, replied: true },
      { name: 'Priya Sharma', phone: '07701112233', email: 'priya.s@example.com', subject: 'Outstanding service and food', message: 'We celebrated our anniversary here and it was magical. The momo were perfectly steamed, the mixed grill was flavorful, and the service was attentive without being intrusive.', read: true, replied: false },
      { name: 'James Wilson', phone: '07504445566', email: 'james.w@example.com', subject: 'Excellent service and food', message: 'Had dinner last night and everything was perfect. The butter chicken was the best I\'ve had in years. The cocktail menu is also creative and delicious. Highly recommend!', read: true, replied: true },
      { name: 'Maria Santos', phone: '07707778899', email: 'maria.s@example.com', subject: 'Wonderful atmosphere', message: 'The ambiance is beautiful - warm lighting, comfortable seating, and the live music adds such a nice touch. Food was excellent too, especially the mixed grill platter.', read: true, replied: false },
      { name: 'Rajesh Kumar', phone: '07702223344', email: 'rajesh.k@example.com', subject: 'Authentic flavors', message: 'Easily the best Nepali food I\'ve had outside Kathmandu. The dal bhat takes me straight home. The momo chutney is perfectly spiced. Thank you for keeping it authentic!', read: true, replied: false },
      { name: 'Emily Chen', phone: '07503334455', email: 'emily.c@example.com', subject: 'Great family dinner', message: 'Took my family of 6 for my mom\'s birthday. The staff went above and beyond with a special dessert. The kids loved the butter chicken and naan. We\'ll be regulars!', read: true, replied: true },
      { name: 'Omar Hassan', phone: '07705556677', email: 'omar.h@example.com', subject: 'Live music night was amazing', message: 'We booked the live music night and it was unforgettable — gold-lit, generous, and full of warmth. The food kept coming and the drinks were perfectly crafted.', read: true, replied: false },
      { name: 'Fatima Al-Zahra', phone: '07506667788', email: 'fatima.a@example.com', subject: 'Perfect date night spot', message: 'My husband and I had the most romantic evening. The candlelit table, the butter chicken, the cocktails - everything was perfect. The staff made us feel special without hovering.', read: true, replied: false },
      { name: 'David Park', phone: '07708889900', email: 'david.p@example.com', subject: 'Best mixed grill in the city', message: 'The mixed grill platter is incredible - perfectly cooked meats, great variety, and the sides are excellent. Service was prompt and friendly. Definitely coming back for this.', read: true, replied: false },
      { name: 'Aisha Khan', phone: '07509990011', email: 'aisha.k@example.com', subject: 'Momo perfection', message: 'The momo here are the best I\'ve ever had. Perfectly steamed, juicy filling, and that chutney! I dream about them. The atmosphere is cozy and the staff is so welcoming.', read: true, replied: false },
      { name: 'Mohammed Ali', phone: '07701112244', email: 'mohammed.a@example.com', subject: 'Excellent value for money', message: 'Portions are generous, prices are fair, and quality is top-notch. Had the family set meal and it fed 4 of us with leftovers. The staff treated us like family.', read: true, replied: false },
      { name: 'Lina Abbas', phone: '07504445577', email: 'lina.a@example.com', subject: 'Great for celebrations', message: 'We hosted my brother\'s engagement dinner here and it was flawless. The private area was beautiful, the custom menu was delicious, and the staff handled everything seamlessly.', read: true, replied: true },
      { name: 'Karim Nasser', phone: '07703334466', email: 'karim.n@example.com', subject: 'Authentic and refined', message: 'Love how they balance authentic Nepali flavors with refined presentation. The tasting menu is a journey. Cocktails are creative with local ingredients. A true gem.', read: true, replied: false },
      { name: 'Nadia Ibrahim', phone: '07506667799', email: 'nadia.i@example.com', subject: 'Staff makes the difference', message: 'Food is excellent but the service is what makes this place special. Every visit feels personal - they remember your preferences, ask about your day. Rare to find this level of care.', read: true, replied: false },
      { name: 'Hassan Mahmoud', phone: '07705556688', email: 'hassan.m@example.com', subject: 'Best cocktails in Sulaymaniyah', message: 'The bar program is outstanding. Creative cocktails using local spices and fruits. The bartender recommended a cardamom old fashioned that changed my life. Food is equally impressive.', read: true, replied: false },
      { name: 'Yusuf Abdullah', phone: '07508889900', email: 'yusuf.a@example.com', subject: 'Consistently excellent', message: 'Been coming here monthly for a year and never had a bad experience. Quality is consistent, staff is wonderful, and they keep the menu fresh with seasonal specials. My go-to place.', read: true, replied: false },
      { name: 'Amina Yusuf', phone: '07702223355', email: 'amina.y@example.com', subject: 'Vegetarian friendly', message: 'As a vegetarian, I appreciate how many options they have. The dal bhat, vegetable momo, paneer dishes - all flavorful and satisfying. Staff is knowledgeable about dietary needs.', read: true, replied: false },
      { name: 'Omar Farouk', phone: '07501112233', email: 'omar.f@example.com', subject: 'Birthday celebration done right', message: 'They made my daughter\'s birthday so special - customized cake, decorated table, and the staff sang for her. The food was delicious and the memories will last forever. Thank you!', read: true, replied: true },
      { name: 'Layla Hassan', phone: '07704445566', email: 'layla.h@example.com', subject: 'Cozy and elegant', message: 'The interior design strikes the perfect balance - elegant but not stuffy, cozy but spacious. The gold accents and warm lighting create such a welcoming atmosphere. Food matches the vibe perfectly.', read: true, replied: false },
      { name: 'Ahmed Khalid', phone: '07507778899', email: 'ahmed.k@example.com', subject: 'Worth every dinar', message: 'Pricey compared to some places but you get what you pay for. Premium ingredients, expert preparation, attentive service, beautiful space. This is fine dining done right.', read: true, replied: false },
      { name: 'Safiya Noor', phone: '07709990022', email: 'safiya.n@example.com', subject: 'Hidden gem', message: 'Found this place by accident and so glad I did. The lamb kebabs are tender and flavorful, the naan is fresh from the tandoor, and the chai at the end is perfect. Will bring friends next time.', read: true, replied: false },
      { name: 'Hassan Ali', phone: '07703334477', email: 'hassan.a@example.com', subject: 'Great for business dinners', message: 'Hosted a client dinner here and it impressed everyone. Private booth, excellent wine list, knowledgeable staff. The tasting menu showcases the kitchen\'s range beautifully.', read: true, replied: false },
      { name: 'Noura Salem', phone: '07502223344', email: 'noura.s@example.com', subject: 'Best chai in town', message: 'Don\'t sleep on the chai! It\'s the perfect end to a meal - strong, spiced, not too sweet. The desserts are also excellent, especially the kheer and gulab jamun. Friendly service too.', read: true, replied: false },
    ].map((m, i) => ({
      ...m,
      contactType: 'feedback' as const,
      verified: true,
      // Mostly 5s with a few 4s so the aggregate average isn't a flat 5.0
      rating: [5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5][i] ?? 5,
    }))

    await Message.insertMany([...enquiryMessages, ...feedbackMessages])
    console.log(`✓ ${enquiryMessages.length} enquiries + ${feedbackMessages.length} verified feedback seeded`)

  console.log('\n✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
