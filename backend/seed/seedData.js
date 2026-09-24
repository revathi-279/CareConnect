const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

const servicesData = [
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    category: 'Cleaning',
    description: 'Comprehensive deep cleaning service covering living rooms, bedrooms, and common areas. Our trained professionals use premium sanitizing agents and HEPA-filtered vacuuming equipment to leave your home pristine.',
    shortDescription: 'Deep cleaning, dusting, and floor sanitation for the entire home.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    startingPrice: 49,
    duration: '120 - 180 mins',
    included: [
      'Dusting and wiping all accessible furniture',
      'Floor vacuuming, sweeping, and wet mopping',
      'Trash removal and liner replacement',
      'Mirror and interior glass polishing'
    ],
    notIncluded: [
      'Balcony high-pressure power washing',
      'Exterior high-reach window cleaning',
      'Heavy mold or construction debris cleanup'
    ]
  },
  {
    name: 'Bathroom Cleaning',
    slug: 'bathroom-cleaning',
    category: 'Cleaning',
    description: 'Specialized deep cleaning and descaling for bathrooms. Removes tough water stains, grout grime, and sanitizes sanitary ware for a fresh and hygienic space.',
    shortDescription: 'Tile scrub, descaling, and sanitary fitting disinfection.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    startingPrice: 29,
    duration: '45 - 60 mins',
    included: [
      'Toilet bowl, washbasin, and vanity disinfection',
      'Tile scrubbing and lime scale removal',
      'Mirror, chrome tap, and showerhead descaling',
      'Floor stain treatment and sanitization'
    ],
    notIncluded: [
      'Ceiling mold repainting',
      'Plumbing leak repairs or pipe replacement',
      'Exhaust motor overhaul'
    ]
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    category: 'Plumbing',
    description: 'Fast, dependable plumbing diagnostic and repair services by certified technicians. From pipe blockages and leaking faucets to fixture installation, we keep your water lines flowing smoothly.',
    shortDescription: 'Pipe leak repairs, fixture fittings, and drainage clearing.',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    startingPrice: 35,
    duration: '30 - 60 mins',
    included: [
      'Complete diagnostic of leaks and clogs',
      'Tap, faucet, and shower cartridge servicing',
      'Drain trap clearing and pipe sealing',
      'Pressure testing after repair'
    ],
    notIncluded: [
      'Underground pipeline excavation',
      'Cost of new replacement fixtures or valves',
      'Water heater internal tank replacement'
    ]
  },
  {
    name: 'Electrical Repair',
    slug: 'electrical-repair',
    category: 'Electrical',
    description: 'Safe, certified electrical diagnostics and repair for residential switches, fuse boxes, wiring faults, and circuit breaker tripping issues.',
    shortDescription: 'Troubleshooting short circuits, switchboards, and breaker trips.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 39,
    duration: '45 - 90 mins',
    included: [
      'Short circuit and voltage stability inspection',
      'Switch, socket, and MCB testing or replacement',
      'Wire tightening and loose connection securing',
      'Post-service circuit load testing'
    ],
    notIncluded: [
      'Whole-house rewiring behind drywall',
      'Main street line utility meter work',
      'Cost of premium smart switches or components'
    ]
  },
  {
    name: 'AC Service',
    slug: 'ac-service',
    category: 'Appliance Repair',
    description: 'Complete air conditioning checkup, deep jet cleaning, filter wash, and refrigerant pressure evaluation to ensure maximum cooling efficiency and clean indoor air.',
    shortDescription: 'Cooling coil jet wash, filter cleaning, and gas check.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    startingPrice: 45,
    duration: '60 - 90 mins',
    included: [
      'Indoor coil and blower jet cleaning',
      'Air filter wash and antimicrobial disinfection',
      'Outdoor unit condenser cleaning',
      'Drain pipe flush and refrigerant check'
    ],
    notIncluded: [
      'Freon gas top-up or full refill (charged separately)',
      'Compressor motor replacement',
      'Copper piping extension'
    ]
  },
  {
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    category: 'Appliance Repair',
    description: 'Expert diagnostic and repair services for major home appliances including washing machines, refrigerators, microwaves, and dishwashers.',
    shortDescription: 'Diagnostics and part repairs for domestic home appliances.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    startingPrice: 40,
    duration: '60 - 120 mins',
    included: [
      'Full electrical and mechanical fault diagnosis',
      'Internal component cleaning and testing',
      'Drum, belt, or thermostat adjustments',
      'Operational safety checks'
    ],
    notIncluded: [
      'Cost of original replacement circuit boards or motors',
      'Commercial kitchen appliance servicing',
      'Cosmetic panel repainting'
    ]
  },
  {
    name: 'Fan Installation',
    slug: 'fan-installation',
    category: 'Electrical',
    description: 'Professional assembly and safe ceiling mount installation for ceiling fans, exhaust units, and decorative light-fans with balanced rotation testing.',
    shortDescription: 'Ceiling and exhaust fan installation, balancing, and wiring.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    startingPrice: 25,
    duration: '30 - 45 mins',
    included: [
      'Safe downrod assembly and ceiling hook hanging',
      'Blade alignment and vibration balancing',
      'Electrical connection to existing switchboard',
      'Speed regulator compatibility check'
    ],
    notIncluded: [
      'Drilling into structural false ceiling metal framing without anchors',
      'Supplying fan units or downrod extension rods',
      'Running new electrical conduit across rooms'
    ]
  },
  {
    name: 'Home Maintenance',
    slug: 'home-maintenance',
    category: 'Maintenance',
    description: 'Multi-purpose handyman service for minor home fixes: door hinge adjustments, curtain rod mounting, lock repairs, cabinet adjustments, and silicon caulking.',
    shortDescription: 'General repairs, fixture mounting, locks, and door adjustments.',
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=800&q=80',
    startingPrice: 35,
    duration: '60 - 120 mins',
    included: [
      'Mounting mirrors, wall art, and curtain rods',
      'Cabinet hinge tightening and door latch repairs',
      'Window latch and silicone caulking touch-ups',
      'Basic furniture screw and bolt assembly'
    ],
    notIncluded: [
      'Custom carpentry construction or floor sanding',
      'Roof structural tiling repairs',
      'Masonry brickwork or wall demolition'
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Service.deleteMany();
    await Provider.deleteMany();
    await Booking.deleteMany();
    console.log('Cleaned old records.');

    // Seed Services
    const createdServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${createdServices.length} services successfully.`);

    // Prepare Seed Providers
    const rawPassword = 'password123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const provider1User = await User.create({
      name: 'Ramesh Sharma',
      email: 'provider1@careconnect.com',
      phone: '+91 98765 43210',
      password: hashedPassword,
      role: 'provider'
    });

    const provider2User = await User.create({
      name: 'Anita Verma',
      email: 'provider2@careconnect.com',
      phone: '+91 98765 43211',
      password: hashedPassword,
      role: 'provider'
    });

    const provider3User = await User.create({
      name: 'Vikram Singh',
      email: 'provider3@careconnect.com',
      phone: '+91 98765 43212',
      password: hashedPassword,
      role: 'provider'
    });

    // Seed Provider Profiles linked to categories
    await Provider.create([
      {
        user: provider1User._id,
        name: provider1User.name,
        phone: provider1User.phone,
        skills: ['Deep Cleaning', 'Sanitization', 'Tile Descaling'],
        serviceCategories: ['Cleaning'],
        experience: 5,
        rating: 4.9
      },
      {
        user: provider2User._id,
        name: provider2User.name,
        phone: provider2User.phone,
        skills: ['Circuit Diagnostics', 'Ceiling Fan Installation', 'Appliance Servicing', 'AC Jet Clean'],
        serviceCategories: ['Electrical', 'Appliance Repair'],
        experience: 6,
        rating: 4.8
      },
      {
        user: provider3User._id,
        name: provider3User.name,
        phone: provider3User.phone,
        skills: ['Pipe Leak Repair', 'Drain Trap Clearing', 'Handyman Mounts', 'Hinge Adjustments'],
        serviceCategories: ['Plumbing', 'Maintenance'],
        experience: 7,
        rating: 4.7
      }
    ]);

    // Create a demo customer account for immediate testing
    await User.create({
      name: 'Demo Customer',
      email: 'customer@careconnect.com',
      phone: '+91 99999 88888',
      password: hashedPassword,
      role: 'customer'
    });

    console.log('Seeded 3 Providers and 1 Demo Customer successfully.');
    console.log('Seed summary:');
    console.log(' - Customer: customer@careconnect.com / password123');
    console.log(' - Provider 1 (Cleaning): provider1@careconnect.com / password123');
    console.log(' - Provider 2 (Electrical/Appliance): provider2@careconnect.com / password123');
    console.log(' - Provider 3 (Plumbing/Maintenance): provider3@careconnect.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();