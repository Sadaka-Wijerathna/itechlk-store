export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
  description: string
  longDescription: string
  features: string[]
  whatsIncluded: string[]
  compatibility: string[]
  stock: number
  isPopular: boolean
  rating: number
  reviews: number
  reviewCount?: number // Optional: from API when fetching from database
  requiresAge: boolean
  deliveryTime: string
  warranty: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Picsart',
    slug: 'picsart',
    price: 500,
    image: 'https://i.ibb.co/C5JCR57L/66b0a5ebaa33d8cd18e10c54.png',
    category: 'Design',
    description: 'Professional photo editing with AI-powered tools',
    longDescription: 'Picsart is a comprehensive photo editing and design platform that combines powerful AI tools with an intuitive interface. Perfect for content creators, social media managers, and anyone looking to create stunning visuals. With millions of templates, stickers, and effects, you can bring your creative vision to life effortlessly.',
    features: [
      'AI Photo Editor with smart enhancements',
      'One-click background remover',
      '1000+ premium templates',
      'Advanced filters and effects',
      'Collage maker and video editor',
      'Cloud storage for your projects',
      'Mobile and desktop apps',
      'Commercial use license'
    ],
    whatsIncluded: [
      'Full Picsart Gold subscription',
      'Access to all premium features',
      'Ad-free experience',
      'Priority customer support',
      'Regular feature updates'
    ],
    compatibility: [
      'iOS 13.0 or later',
      'Android 6.0 or later',
      'Windows 10 or later',
      'macOS 10.13 or later',
      'Web browser access'
    ],
    stock: 50,
    isPopular: false,
    rating: 4.5,
    reviews: 120,
    requiresAge: false,
    deliveryTime: '5-15 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '2',
    name: 'ChatGPT Plus',
    slug: 'chatgpt-plus',
    price: 1250,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    category: 'AI',
    description: 'Advanced AI assistant with GPT-4 access',
    longDescription: 'ChatGPT Plus gives you access to OpenAI\'s most advanced AI model, GPT-4. Experience faster response times, priority access during peak hours, and early access to new features. Perfect for professionals, students, and anyone who wants to leverage cutting-edge AI technology for writing, coding, research, and creative tasks.',
    features: [
      'GPT-4 access for advanced reasoning',
      'Faster response times',
      'Priority access during peak hours',
      'Access to GPT-4 with vision',
      'DALL-E 3 image generation',
      'Advanced data analysis',
      'Web browsing capability',
      'Plugin ecosystem access'
    ],
    whatsIncluded: [
      'ChatGPT Plus subscription',
      'Unlimited GPT-4 messages (within limits)',
      'Access to all ChatGPT features',
      'Early access to new features',
      'Priority support'
    ],
    compatibility: [
      'Web browser (Chrome, Firefox, Safari, Edge)',
      'iOS app (iOS 16.1 or later)',
      'Android app (Android 6.0 or later)',
      'API access available'
    ],
    stock: 100,
    isPopular: true,
    rating: 4.9,
    reviews: 350,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '3',
    name: 'Netflix',
    slug: 'netflix',
    price: 1500,
    image: 'https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg',
    category: 'Entertainment',
    description: 'Unlimited movies and TV shows streaming',
    longDescription: 'Netflix is the world\'s leading streaming entertainment service with a vast library of movies, TV shows, documentaries, and original content. Enjoy unlimited streaming in stunning 4K Ultra HD quality on multiple devices. With new content added regularly, there\'s always something new to discover.',
    features: [
      '4K Ultra HD streaming quality',
      'Watch on multiple devices simultaneously',
      'Download content for offline viewing',
      'No advertisements',
      'Personalized recommendations',
      'Kids profiles with parental controls',
      'Exclusive Netflix Originals',
      'Multi-language support and subtitles'
    ],
    whatsIncluded: [
      'Premium Netflix subscription',
      'Up to 4 simultaneous streams',
      '4K + HDR streaming',
      'Unlimited downloads',
      'Access to entire Netflix library'
    ],
    compatibility: [
      'Smart TVs (Samsung, LG, Sony, etc.)',
      'Streaming devices (Roku, Fire TV, Chromecast)',
      'Game consoles (PlayStation, Xbox)',
      'iOS and Android devices',
      'Web browsers',
      'Windows and macOS apps'
    ],
    stock: 75,
    isPopular: true,
    rating: 4.8,
    reviews: 500,
    requiresAge: false,
    deliveryTime: '10-15 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '4',
    name: 'CapCut Pro',
    slug: 'capcut-pro',
    price: 750,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/CapCut_logo.svg/800px-CapCut_logo.svg.png',
    category: 'Video',
    description: 'Professional video editing made simple',
    longDescription: 'CapCut Pro is a powerful yet easy-to-use video editing app perfect for content creators, TikTokers, and social media enthusiasts. Create professional-looking videos with advanced effects, transitions, and AI-powered features. Export in high quality without watermarks and take your content to the next level.',
    features: [
      'Professional video editing tools',
      'No watermark on exports',
      '1000+ premium templates',
      'Advanced effects and transitions',
      'AI-powered auto-captions',
      'Green screen (chroma key)',
      'Cloud storage for projects',
      'Export in 4K resolution'
    ],
    whatsIncluded: [
      'CapCut Pro subscription',
      'All premium features unlocked',
      'Unlimited cloud storage',
      'Priority rendering',
      'Commercial use license'
    ],
    compatibility: [
      'iOS 11.0 or later',
      'Android 5.0 or later',
      'Windows 10 or later',
      'macOS 10.15 or later'
    ],
    stock: 60,
    isPopular: false,
    rating: 4.6,
    reviews: 200,
    requiresAge: false,
    deliveryTime: '5-15 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '5',
    name: 'Photoshop',
    slug: 'photoshop',
    price: 1299,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png',
    category: 'Design',
    description: 'Industry-standard photo editing software',
    longDescription: 'Adobe Photoshop is the world\'s most advanced image editing and design software. Used by professionals worldwide, Photoshop offers unmatched creative possibilities with AI-powered tools, advanced compositing, and precise editing capabilities. Perfect for photographers, designers, and digital artists.',
    features: [
      'Advanced photo editing and retouching',
      'AI-powered Neural Filters',
      'Content-Aware Fill and Remove',
      'Professional color grading',
      'Layer-based editing',
      '100GB cloud storage',
      'Adobe Fonts access',
      'Mobile app integration'
    ],
    whatsIncluded: [
      'Adobe Photoshop subscription',
      'Desktop application (Windows/Mac)',
      'Photoshop on iPad',
      'Cloud storage and sync',
      'Adobe Portfolio website',
      'Regular updates and new features'
    ],
    compatibility: [
      'Windows 10 (64-bit) or later',
      'macOS 11 or later',
      'iPad with iPadOS 14 or later',
      'Minimum 8GB RAM (16GB recommended)',
      'GPU with DirectX 12 support'
    ],
    stock: 40,
    isPopular: false,
    rating: 4.7,
    reviews: 180,
    requiresAge: false,
    deliveryTime: '10-20 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '6',
    name: 'Gemini Advanced',
    slug: 'gemini-advanced',
    price: 2000,
    image: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    category: 'AI',
    description: 'Google\'s most capable AI assistant',
    longDescription: 'Gemini Advanced is powered by Google\'s most capable AI model, offering superior reasoning, coding, and creative capabilities. With extended context windows and multimodal understanding, Gemini Advanced can help with complex tasks, from writing and analysis to coding and creative projects.',
    features: [
      'Access to Gemini Ultra 1.0',
      'Extended context window (1M tokens)',
      'Multimodal capabilities (text, image, code)',
      'Priority access and faster responses',
      'Advanced reasoning and analysis',
      'Code generation and debugging',
      'Integration with Google Workspace',
      'Early access to new features'
    ],
    whatsIncluded: [
      'Gemini Advanced subscription',
      '2TB Google One storage',
      'Access to Gemini in Gmail, Docs, and more',
      'Priority support',
      'Family sharing (up to 5 members)'
    ],
    compatibility: [
      'Web browser access',
      'Google app on iOS and Android',
      'Integration with Google Workspace',
      'API access for developers'
    ],
    stock: 30,
    isPopular: false,
    rating: 4.8,
    reviews: 95,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '7',
    name: 'Canva Pro',
    slug: 'canva-pro',
    price: 500,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/1200px-Canva_Logo.svg.png',
    category: 'Design',
    description: 'Design anything with ease',
    longDescription: 'Canva Pro is the ultimate design platform for creating stunning graphics, presentations, social media posts, and more. With millions of premium templates, photos, and graphics, plus powerful AI tools, you can create professional designs in minutes. Perfect for businesses, marketers, and content creators.',
    features: [
      '100+ million premium stock photos, videos, and graphics',
      'Brand Kit with custom fonts and colors',
      'Magic Resize for instant format changes',
      'Background Remover tool',
      'Team collaboration features',
      'Content Planner for social media',
      '100GB cloud storage',
      'Priority support'
    ],
    whatsIncluded: [
      'Canva Pro subscription',
      'Unlimited designs and downloads',
      'Access to all premium content',
      'Brand Kit and templates',
      'Team collaboration tools',
      'Commercial use license'
    ],
    compatibility: [
      'Web browser (all modern browsers)',
      'iOS app (iOS 13.0 or later)',
      'Android app (Android 7.0 or later)',
      'Windows app',
      'macOS app'
    ],
    stock: 80,
    isPopular: true,
    rating: 4.7,
    reviews: 280,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '8',
    name: 'Pornhub Premium',
    slug: 'premium-adult',
    price: 1999,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Pornhub-logo.svg',
    category: 'Adult',
    description: 'Pornhub Premium subscription access',
    longDescription: 'Access Pornhub Premium with unlimited streaming in HD and 4K quality. This subscription provides access to a vast library of exclusive premium content from top studios and creators. Enjoy ad-free viewing, download videos for offline viewing, and stream on multiple devices with complete privacy and discretion.',
    features: [
      'HD and Full HD streaming',
      'Ad-free experience',
      'Exclusive premium content',
      'Multiple device support',
      'Download for offline viewing',
      'Regular content updates',
      'Private browsing mode',
      'Secure and discreet billing'
    ],
    whatsIncluded: [
      'Premium subscription access',
      'Unlimited streaming',
      'All premium content unlocked',
      'Multi-device support',
      'Privacy protection'
    ],
    compatibility: [
      'Web browser (desktop and mobile)',
      'iOS devices (18+ verification required)',
      'Android devices (18+ verification required)',
      'Smart TVs and streaming devices'
    ],
    stock: 25,
    isPopular: false,
    rating: 4.5,
    reviews: 150,
    requiresAge: true,
    deliveryTime: '15-30 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '9',
    name: 'Windows 11 Pro',
    slug: 'windows-11-pro',
    price: 1200,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Windows_11_logo.svg/2048px-Windows_11_logo.svg.png',
    category: 'Software',
    description: 'Lifetime Windows 11 Pro license',
    longDescription: 'Get a genuine lifetime license for Windows 11 Pro, Microsoft\'s latest operating system. Perfect for professionals and power users who need advanced features like BitLocker encryption, Remote Desktop, Hyper-V virtualization, and enterprise-grade security. This is a one-time purchase with lifetime validity.',
    features: [
      'Lifetime license activation',
      'BitLocker device encryption',
      'Remote Desktop functionality',
      'Hyper-V virtualization',
      'Windows Sandbox for testing',
      'Group Policy management',
      'Assigned Access for kiosk mode',
      'Enterprise-grade security features'
    ],
    whatsIncluded: [
      'Genuine Windows 11 Pro license key',
      'Lifetime activation',
      'Digital download link',
      'Installation guide',
      'Activation support'
    ],
    compatibility: [
      '64-bit processor (1 GHz or faster)',
      '4 GB RAM minimum (8 GB recommended)',
      '64 GB storage minimum',
      'UEFI firmware with Secure Boot',
      'TPM version 2.0',
      'DirectX 12 compatible graphics'
    ],
    stock: 100,
    isPopular: true,
    rating: 4.9,
    reviews: 450,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: 'Lifetime license validity'
  },
  {
    id: '10',
    name: 'Microsoft 365',
    slug: 'microsoft-365',
    price: 1000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
    category: 'Software',
    description: 'Lifetime Microsoft 365 subscription',
    longDescription: 'Get lifetime access to Microsoft 365 (formerly Office 365) with all premium apps and services. Includes Word, Excel, PowerPoint, Outlook, OneNote, Publisher, Access, and 1TB OneDrive cloud storage. Perfect for students, professionals, and businesses who need reliable productivity tools.',
    features: [
      'Lifetime subscription access',
      'Word, Excel, PowerPoint, Outlook',
      'OneNote, Publisher, Access',
      '1TB OneDrive cloud storage',
      'Microsoft Teams collaboration',
      'Advanced security features',
      'Install on multiple devices',
      'Regular updates and new features'
    ],
    whatsIncluded: [
      'Microsoft 365 lifetime account',
      'All Office applications',
      '1TB OneDrive storage',
      'Microsoft Teams access',
      'Premium templates and fonts',
      'Technical support'
    ],
    compatibility: [
      'Windows 10 or later',
      'macOS (3 most recent versions)',
      'iOS and Android devices',
      'Web browser access',
      'Internet connection required'
    ],
    stock: 150,
    isPopular: true,
    rating: 4.8,
    reviews: 520,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: 'Lifetime subscription guarantee'
  },
  {
    id: '11',
    name: 'Surfshark VPN Premium',
    slug: 'surfshark-vpn-premium',
    price: 1000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Surshark_Logo_Pos.svg',
    category: 'VPN',
    description: 'Secure and private internet access with unlimited devices',
    longDescription: 'Surfshark VPN Premium provides top-tier online security and privacy protection with unlimited device connections. Browse anonymously, access geo-restricted content, and protect your data on public Wi-Fi. With servers in 100+ countries and military-grade encryption, Surfshark keeps you safe online without compromising speed.',
    features: [
      'Unlimited device connections',
      'No-logs policy for complete privacy',
      'Kill Switch protection',
      'CleanWeb ad blocker',
      '3200+ servers in 100+ countries',
      'WireGuard protocol support',
      'MultiHop (double VPN)',
      '24/7 customer support'
    ],
    whatsIncluded: [
      'Surfshark VPN Premium account',
      'Unlimited simultaneous connections',
      'All premium features unlocked',
      'Access to all server locations',
      'Ad and malware blocking',
      'Priority support'
    ],
    compatibility: [
      'Windows 7 or later',
      'macOS 10.12 or later',
      'iOS 12.0 or later',
      'Android 5.0 or later',
      'Linux (Ubuntu, Debian, Mint)',
      'Browser extensions (Chrome, Firefox, Edge)',
      'Smart TVs and routers'
    ],
    stock: 50,
    isPopular: false,
    rating: 4.7,
    reviews: 185,
    requiresAge: false,
    deliveryTime: '5-15 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '12',
    name: 'ExpressVPN Premium',
    slug: 'expressvpn-premium',
    price: 600,
    image: 'https://upload.wikimedia.org/wikipedia/en/7/79/ExpressVPN-logo.svg',
    category: 'VPN',
    description: 'Ultra-fast VPN service with top-tier security',
    longDescription: 'ExpressVPN Premium is one of the fastest and most reliable VPN services available. With military-grade encryption, a strict no-logs policy, and servers in 105 countries, ExpressVPN ensures your online activities remain private and secure. Perfect for streaming, gaming, and secure browsing with blazing-fast speeds.',
    features: [
      'Lightning-fast connection speeds',
      'Military-grade 256-bit encryption',
      'TrustedServer technology',
      'Network Lock kill switch',
      '3000+ servers in 105 countries',
      'Split tunneling feature',
      'MediaStreamer for smart TVs',
      '24/7 live chat support'
    ],
    whatsIncluded: [
      'ExpressVPN Premium account',
      'Up to 8 simultaneous connections',
      'Unlimited bandwidth',
      'Access to all server locations',
      'Apps for all devices',
      'Priority customer support'
    ],
    compatibility: [
      'Windows 7 or later',
      'macOS 10.12 or later',
      'iOS 12.0 or later',
      'Android 5.0 or later',
      'Linux (Ubuntu, Debian, Fedora)',
      'Browser extensions (Chrome, Firefox, Edge)',
      'Routers and smart TVs'
    ],
    stock: 50,
    isPopular: false,
    rating: 4.8,
    reviews: 220,
    requiresAge: false,
    deliveryTime: '5-15 minutes',
    warranty: '30-day replacement guarantee'
  },
  {
    id: '13',
    name: 'YouTube Premium',
    slug: 'youtube-premium',
    price: 400,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Youtube_logo.png/1200px-Youtube_logo.png',
    category: 'Entertainment',
    description: 'Ad-free YouTube with background play and downloads',
    longDescription: 'YouTube Premium offers an enhanced viewing experience with ad-free videos, background playback, and offline downloads. Enjoy uninterrupted music and videos across all your devices, plus access to YouTube Music Premium. Perfect for content enthusiasts who want the best YouTube experience without interruptions.',
    features: [
      'Ad-free videos across YouTube',
      'Background play on mobile devices',
      'Download videos for offline viewing',
      'YouTube Music Premium included',
      'Access to YouTube Originals',
      'Picture-in-picture mode',
      'High-quality audio streaming',
      'Support your favorite creators'
    ],
    whatsIncluded: [
      'YouTube Premium subscription (1 month)',
      'YouTube Music Premium access',
      'Ad-free experience on all devices',
      'Offline downloads',
      'Background playback'
    ],
    compatibility: [
      'Web browser (all modern browsers)',
      'iOS app (iOS 12.0 or later)',
      'Android app (Android 5.0 or later)',
      'Smart TVs (Android TV, Samsung, LG)',
      'Game consoles (PlayStation, Xbox)',
      'Streaming devices (Chromecast, Roku)'
    ],
    stock: 100,
    isPopular: true,
    rating: 4.8,
    reviews: 320,
    requiresAge: false,
    deliveryTime: '5-10 minutes',
    warranty: '30-day replacement guarantee'
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

export function getRelatedProducts(currentProductId: string, category: string, limit: number = 4, currentSlug?: string): Product[] {
  return products
    .filter(product => 
      product.id !== currentProductId && 
      product.slug !== currentSlug &&
      product.category === category
    )
    .slice(0, limit)
}

export function getAllProductSlugs(): string[] {
  return products.map(product => product.slug)
}
