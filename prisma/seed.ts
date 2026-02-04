import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  const products = [
    {
      name: 'Picsart',
      slug: 'picsart',
      price: 500,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Picsart_%28software_company%29_logo.svg',
      category: 'Design',
      description: 'Professional photo editing with AI-powered tools',
      features: ['AI Photo Editor', 'Remove Background', 'Templates', 'Filters & Effects'],
      stock: 50,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'ChatGPT Plus',
      slug: 'chatgpt-plus',
      price: 1250,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
      category: 'AI',
      description: 'Advanced AI assistant with GPT-4 access',
      features: ['GPT-4 Access', 'Faster Response', 'Priority Access', 'Advanced Features'],
      stock: 100,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
    {
      name: 'Netflix',
      slug: 'netflix',
      price: 1500,
      duration: 1,
      image: 'https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg',
      category: 'Entertainment',
      description: 'Unlimited movies and TV shows streaming',
      features: ['4K Ultra HD', 'Multiple Devices', 'Download Content', 'No Ads'],
      stock: 75,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
    {
      name: 'CapCut Pro',
      slug: 'capcut-pro',
      price: 750,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/CapCut_logo.svg/512px-CapCut_logo.svg.png',
      category: 'Video',
      description: 'Professional video editing made simple',
      features: ['Pro Templates', 'No Watermark', 'Advanced Effects', 'Cloud Storage'],
      stock: 60,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'Photoshop',
      slug: 'photoshop',
      price: 1299,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png',
      category: 'Design',
      description: 'Industry-standard photo editing software',
      features: ['Advanced Tools', 'AI Features', 'Cloud Storage', 'Mobile App'],
      stock: 40,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'Gemini Advanced',
      slug: 'gemini-advanced',
      description: 'Google\'s most capable AI assistant',
      price: 2000,
      duration: 1,
      image: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
      category: 'AI',
      features: ['Advanced AI', 'Multimodal', 'Priority Access', 'Extended Context'],
      stock: 30,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'Canva Pro',
      slug: 'canva-pro',
      description: 'Design anything with ease',
      price: 500,
      duration: 1,
      image: 'https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg',
      category: 'Design',
      features: ['Premium Templates', 'Brand Kit', 'Background Remover', 'Team Collaboration'],
      stock: 80,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
    {
      name: 'Pornhub Premium',
      slug: 'premium-adult',
      description: 'Pornhub Premium subscription access',
      price: 1999,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Pornhub-logo.svg',
      category: 'Adult',
      features: ['HD Streaming', 'No Ads', 'Exclusive Content', 'Multiple Devices'],
      stock: 25,
      isActive: true,
      isPopular: false,
      requiresAge: true,
    },
    {
      name: 'Windows 11 Pro',
      slug: 'windows-11-pro',
      description: 'Professional Windows operating system',
      price: 2500,
      duration: 12, // Lifetime
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/1200px-Windows_logo_-_2021.svg.png',
      category: 'Software',
      features: ['Lifetime License', 'Professional Features', 'BitLocker', 'Remote Desktop'],
      stock: 50,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'Microsoft 365',
      slug: 'microsoft-365',
      description: 'Complete productivity suite',
      price: 800,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
      category: 'Software',
      features: ['Word, Excel, PowerPoint', 'OneDrive Storage', 'Teams', 'Outlook'],
      stock: 100,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
    {
      name: 'Surfshark VPN Premium',
      slug: 'surfshark-vpn-premium',
      description: 'Secure and private internet access with unlimited devices',
      price: 1000,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Surshark_Logo_Pos.svg',
      category: 'VPN',
      features: ['Unlimited Devices', 'No Logs Policy', 'Kill Switch', 'Ad Blocker'],
      stock: 50,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'ExpressVPN Premium',
      slug: 'expressvpn-premium',
      description: 'Ultra-fast VPN service with top-tier security',
      price: 600,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/en/7/79/ExpressVPN-logo.svg',
      category: 'VPN',
      features: ['High-Speed Servers', 'Military-Grade Encryption', '24/7 Support', 'Split Tunneling'],
      stock: 50,
      isActive: true,
      isPopular: false,
      requiresAge: false,
    },
    {
      name: 'YouTube Premium',
      slug: 'youtube-premium',
      description: 'Ad-free YouTube with background play and downloads',
      price: 400,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Youtube_logo.png/1200px-Youtube_logo.png',
      category: 'Entertainment',
      features: ['Ad-free Videos', 'Background Play', 'Offline Downloads', 'YouTube Music Premium'],
      stock: 100,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
    {
      name: 'Spotify Premium',
      slug: 'spotify-premium',
      description: 'Ad-free music streaming with unlimited skips and offline downloads',
      price: 450,
      duration: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
      category: 'Entertainment',
      features: ['Ad-free Music', 'Unlimited Skips', 'Offline Downloads', 'High Quality Audio'],
      stock: 100,
      isActive: true,
      isPopular: true,
      requiresAge: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    console.log(`✅ Created/Updated product: ${product.name}`)
  }

  // Create admin user (optional)
  try {
    const adminEmail = 'admin@itechlk.store'
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { isAdmin: true },
      create: {
        email: adminEmail,
        name: 'Admin',
        isAdmin: true,
      },
    })
    console.log(`✅ Created/Updated admin user: ${admin.email}`)
  } catch (error) {
    console.log('ℹ️  Admin user already exists or skipped')
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
