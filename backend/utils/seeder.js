const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")

// Load env vars
dotenv.config({ path: "./.env" })

// Load models
const User = require("../models/User")
const Installation = require("../models/Installation")
const MaintenanceRequest = require("../models/MaintenanceRequest")
const ServiceTicket = require("../models/ServiceTicket")
const Equipment = require("../models/Equipment")
const Schedule = require("../models/Schedule")

// Connect to DB
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log("✅ MongoDB Connected for seeding...")
}

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@sunserve.com",
    password: "admin123",
    role: "admin",
    phone: "4161234567",
    address: {
      street: "100 Main Street",
      city: "Toronto",
      state: "ON",
      zipCode: "M5H2N2",
    },
  },
  {
    name: "Manager Smith",
    email: "manager@sunserve.com",
    password: "manager123",
    role: "manager",
    phone: "4162345678",
    address: {
      street: "200 Manager Ave",
      city: "Toronto",
      state: "ON",
      zipCode: "M6H3K5",
    },
  },
  {
    name: "Tech Mike",
    email: "tech1@sunserve.com",
    password: "tech123",
    role: "technician",
    phone: "4163456789",
    address: {
      street: "300 Tech Road",
      city: "Mississauga",
      state: "ON",
      zipCode: "L5B1M3",
    },
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "customer123",
    role: "customer",
    phone: "4164567890",
    address: {
      street: "456 Customer Lane",
      city: "Toronto",
      state: "ON",
      zipCode: "M4E3W2",
    },
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "customer123",
    role: "customer",
    phone: "4165678901",
    address: {
      street: "789 Client Street",
      city: "Scarborough",
      state: "ON",
      zipCode: "M1P4Y7",
    },
  },
]

const equipment = [
  {
    name: "Canadian Solar HiKu7 Module",
    category: "solar_panel",
    manufacturer: "Canadian Solar",
    model: "CS7N-665MS",
    specifications: {
      power: 665,
      voltage: 49.6,
      dimensions: "2384mm x 1303mm x 35mm",
      weight: 34.6,
      warranty: 25,
      efficiency: 21.4,
    },
    quantity: 150,
    minimumStock: 30,
    unitPrice: 350,
    supplier: {
      name: "Canadian Solar Inc.",
      contact: "416-555-0100",
      email: "sales@canadiansolar.com",
    },
  },
  {
    name: "SolarEdge HD-Wave Inverter",
    category: "inverter",
    manufacturer: "SolarEdge",
    model: "SE7600H-US",
    specifications: {
      power: 7600,
      voltage: 240,
      efficiency: 99,
      warranty: 12,
    },
    quantity: 50,
    minimumStock: 10,
    unitPrice: 1200,
    supplier: {
      name: "SolarEdge Technologies",
      contact: "416-555-0200",
      email: "sales@solaredge.com",
    },
  },
  {
    name: "Tesla Powerwall 2",
    category: "battery",
    manufacturer: "Tesla",
    model: "Powerwall 2",
    specifications: {
      power: 13500,
      voltage: 350,
      warranty: 10,
    },
    quantity: 20,
    minimumStock: 5,
    unitPrice: 8500,
    supplier: {
      name: "Tesla Energy",
      contact: "416-555-0300",
      email: "energy@tesla.com",
    },
  },
]

// Import data
const importData = async () => {
  try {
    await connectDB()

    // Clear existing data
    console.log("🗑️  Clearing existing data...")
    await User.deleteMany()
    await Installation.deleteMany()
    await MaintenanceRequest.deleteMany()
    await ServiceTicket.deleteMany()
    await Equipment.deleteMany()
    await Schedule.deleteMany()

    // Hash passwords and create users
    console.log("👤 Creating users...")
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        return user
      }),
    )
    const createdUsers = await User.insertMany(hashedUsers)
    console.log(`✅ Created ${createdUsers.length} users`)

    // Get user IDs
    const admin = createdUsers.find((u) => u.role === "admin")
    const manager = createdUsers.find((u) => u.role === "manager")
    const technician = createdUsers.find((u) => u.role === "technician")
    const customer1 = createdUsers.find((u) => u.email === "sarah@example.com")
    const customer2 = createdUsers.find((u) => u.email === "john@example.com")

    // Create equipment
    console.log("📦 Creating equipment...")
    const createdEquipment = await Equipment.insertMany(equipment)
    console.log(`✅ Created ${createdEquipment.length} equipment items`)

    // Create installations
    console.log("🏗️  Creating installations...")
    const installations = [
      {
        customer: customer1._id,
        address: customer1.address,
        systemSize: 5.5,
        panelType: "monocrystalline",
        numberOfPanels: 20,
        estimatedCost: 15000,
        status: "approved",
        assignedTechnician: technician._id,
        approvedBy: manager._id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        notes: "South-facing roof, optimal conditions",
      },
      {
        customer: customer2._id,
        address: customer2.address,
        systemSize: 8.0,
        panelType: "polycrystalline",
        numberOfPanels: 30,
        estimatedCost: 22000,
        status: "requested",
        notes: "Large roof, east-west orientation",
      },
    ]
    const createdInstallations = await Installation.insertMany(installations)
    console.log(`✅ Created ${createdInstallations.length} installations`)

    // Create maintenance requests
    console.log("🔧 Creating maintenance requests...")
    const maintenanceRequests = [
      {
        customer: customer1._id,
        installation: createdInstallations[0]._id,
        requestType: "routine",
        description: "Annual system inspection and cleaning",
        priority: "medium",
        status: "scheduled",
        assignedTechnician: technician._id,
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        estimatedDuration: 2,
        cost: 200,
      },
    ]
    const createdMaintenance =
      await MaintenanceRequest.insertMany(maintenanceRequests)
    console.log(`✅ Created ${createdMaintenance.length} maintenance requests`)

    // Create service tickets
    console.log("🎫 Creating service tickets...")
    const tickets = [
      {
        title: "Panel producing less power than expected",
        description:
          "Customer reports 30% reduction in power output over last month",
        category: "technical",
        priority: "high",
        status: "assigned",
        createdBy: customer1._id,
        assignedTo: technician._id,
        relatedInstallation: createdInstallations[0]._id,
      },
      {
        title: "Question about warranty coverage",
        description: "Customer inquiring about what is covered under warranty",
        category: "general",
        priority: "low",
        status: "open",
        createdBy: customer2._id,
      },
    ]
    const createdTickets = await ServiceTicket.insertMany(tickets)
    console.log(`✅ Created ${createdTickets.length} service tickets`)

    // Create schedules
    console.log("📅 Creating schedules...")
    const schedules = [
      {
        technician: technician._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        timeSlot: "08:00-12:00",
        jobType: "installation",
        relatedInstallation: createdInstallations[0]._id,
        status: "scheduled",
        location: customer1.address,
        estimatedDuration: 4,
      },
    ]
    const createdSchedules = await Schedule.insertMany(schedules)
    console.log(`✅ Created ${createdSchedules.length} schedules`)

    console.log("\n🎉 Data seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Users: ${createdUsers.length}`)
    console.log(`   Equipment: ${createdEquipment.length}`)
    console.log(`   Installations: ${createdInstallations.length}`)
    console.log(`   Maintenance Requests: ${createdMaintenance.length}`)
    console.log(`   Service Tickets: ${createdTickets.length}`)
    console.log(`   Schedules: ${createdSchedules.length}`)
    console.log("\n🔐 Test Credentials:")
    console.log("   Admin: admin@sunserve.com / admin123")
    console.log("   Manager: manager@sunserve.com / manager123")
    console.log("   Technician: tech1@sunserve.com / tech123")
    console.log("   Customer 1: sarah@example.com / customer123")
    console.log("   Customer 2: john@example.com / customer123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await connectDB()

    console.log("🗑️  Deleting all data...")
    await User.deleteMany()
    await Installation.deleteMany()
    await MaintenanceRequest.deleteMany()
    await ServiceTicket.deleteMany()
    await Equipment.deleteMany()
    await Schedule.deleteMany()

    console.log("✅ All data deleted successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error deleting data:", error)
    process.exit(1)
  }
}

// Run based on command line argument
if (process.argv[2] === "-i" || process.argv[2] === "--import") {
  importData()
} else if (process.argv[2] === "-d" || process.argv[2] === "--delete") {
  deleteData()
} else {
  console.log("Usage:")
  console.log("  node backend/utils/seeder.js -i    (import data)")
  console.log("  node backend/utils/seeder.js -d    (delete data)")
  process.exit(0)
}
