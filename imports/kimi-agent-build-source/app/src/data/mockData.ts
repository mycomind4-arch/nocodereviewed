import type { Tool, Article, Comparison, Category, Subscriber, UserRating, AdminStats, EngineStatus, SponsoredSlot } from '@/types';

export const categories: Category[] = [
  { slug: 'website-builders', name: 'Website Builders', description: 'Build professional websites without writing code', icon: 'Globe' },
  { slug: 'app-builders', name: 'App Builders', description: 'Create mobile and web applications visually', icon: 'Smartphone' },
  { slug: 'ecommerce', name: 'Ecommerce', description: 'Build online stores and sell products', icon: 'ShoppingCart' },
  { slug: 'automation', name: 'Automation', description: 'Connect apps and automate workflows', icon: 'Zap' },
  { slug: 'database', name: 'Database', description: 'Visual database and spreadsheet tools', icon: 'Database' },
  { slug: 'ai-tools', name: 'AI Tools', description: 'AI-powered building and design tools', icon: 'Brain' },
  { slug: 'form-builders', name: 'Form Builders', description: 'Create forms, surveys, and collect data', icon: 'FileText' },
  { slug: 'nocode-cms', name: 'No-Code CMS', description: 'Content management without code', icon: 'Layout' },
];

export const tools: Tool[] = [
  {
    id: '1', name: 'Lovable', slug: 'lovable', tagline: 'AI-powered full-stack app builder',
    logoUrl: '', websiteUrl: 'https://lovable.dev', affiliateUrl: 'https://lovable.dev?ref=nocodereviews',
    category: ['ai-tools', 'app-builders'], ratingOverall: 4.8, ratingEase: 4.9, ratingFeatures: 4.7, ratingPricing: 4.5, ratingSupport: 4.6,
    verdict: 'The fastest way to build a full-stack web app. Lovable turns natural language prompts into working applications with database, auth, and deployment included.',
    reviewBody: '## What is Lovable?\n\nLovable is an AI-powered development platform that generates full-stack web applications from natural language descriptions. It represents a new category of tool that goes beyond traditional no-code by leveraging large language models to write actual code.\n\n## Key Features\n\n- **Prompt-to-App**: Describe what you want, get a working app\n- **Full-Stack**: Frontend, backend, database, and auth included\n- **Git Integration**: Export to GitHub for custom development\n- **Supabase Integration**: Built-in database and authentication\n- **Real-time Preview**: See changes instantly as you edit\n\n## Pricing\n\nLovable offers a generous free tier and paid plans starting at $20/month for additional features and higher usage limits.\n\n## Who is it for?\n\nLovable is ideal for founders who need to validate ideas quickly, developers who want to prototype fast, and teams building internal tools. It\'s not yet suited for complex enterprise applications requiring extensive customization.',
    pros: ['Incredibly fast prototyping', 'Full-stack out of the box', 'Natural language interface', 'Git export for developers', 'Active community and frequent updates'],
    cons: ['Limited customization vs hand-coding', 'AI can generate suboptimal patterns', 'Newer platform with evolving features'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['3 projects', 'Community support', 'Basic features'] }, { name: 'Pro', priceMonthly: 20, priceAnnual: 192, features: ['Unlimited projects', 'Priority support', 'Git integration', 'Custom domains'] }, { name: 'Team', priceMonthly: 50, priceAnnual: 480, features: ['Everything in Pro', 'Team collaboration', 'SSO', 'Dedicated support'] }],
    bestFor: ['Startup founders', 'Rapid prototyping', 'Internal tools', 'MVP development'],
    featured: true, sponsored: false, metaTitle: 'Lovable Review 2026 - AI App Builder', metaDescription: 'In-depth review of Lovable, the AI-powered full-stack app builder. Features, pricing, pros and cons.',
    imageUrl: '/images/tool-lovable.jpg'
  },
  {
    id: '2', name: 'Webflow', slug: 'webflow', tagline: 'Professional website builder with full design control',
    logoUrl: '', websiteUrl: 'https://webflow.com', affiliateUrl: 'https://webflow.com?ref=nocodereviews',
    category: ['website-builders'], ratingOverall: 4.7, ratingEase: 4.3, ratingFeatures: 4.9, ratingPricing: 4.4, ratingSupport: 4.5,
    verdict: 'The most powerful visual website builder for professional designers and agencies. Unmatched design freedom with clean code export.',
    reviewBody: '## What is Webflow?\n\nWebflow is a professional no-code platform for building responsive websites. It combines a visual design tool with a powerful CMS and hosting infrastructure.\n\n## Key Features\n\n- **Visual CSS Editor**: Design with the power of code without writing it\n- **CMS Collections**: Dynamic content management built-in\n- **Interactions & Animations**: Complex scroll-triggered animations\n- **Ecommerce**: Full online store capabilities\n- **Code Export**: Export clean HTML, CSS, and JavaScript\n\n## Pricing\n\nWebflow offers site plans starting at $14/month and account plans for freelancers and agencies.\n\n## Who is it for?\n\nWebflow is perfect for designers who want pixel-perfect control, agencies building client sites, and businesses that need a powerful CMS.',
    pros: ['Unmatched design freedom', 'Clean, exportable code', 'Powerful CMS', 'Excellent hosting and CDN', 'Strong community and resources'],
    cons: ['Steeper learning curve', 'Can get expensive at scale', 'Limited backend functionality', 'Ecommerce has transaction fees'],
    pricingTiers: [{ name: 'Starter', priceMonthly: 0, priceAnnual: 0, features: ['Webflow.io domain', '50 CMS items', 'Basic features'] }, { name: 'Basic', priceMonthly: 14, priceAnnual: 168, features: ['Custom domain', 'No CMS', '50 GB bandwidth'] }, { name: 'CMS', priceMonthly: 23, priceAnnual: 276, features: ['2,000 CMS items', '200 GB bandwidth', '3 content editors'] }, { name: 'Business', priceMonthly: 39, priceAnnual: 468, features: ['10,000 CMS items', '400 GB bandwidth', '10 content editors'] }],
    bestFor: ['Professional designers', 'Marketing teams', 'Content-heavy sites', 'Agencies'],
    featured: true, sponsored: false, metaTitle: 'Webflow Review 2026 - Professional No-Code Builder', metaDescription: 'Comprehensive Webflow review. Design freedom, CMS power, pricing analysis, and real user feedback.',
    imageUrl: '/images/tool-webflow.jpg'
  },
  {
    id: '3', name: 'Framer', slug: 'framer', tagline: 'Design and publish sites from a single tool',
    logoUrl: '', websiteUrl: 'https://framer.com', affiliateUrl: 'https://framer.com?ref=nocodereviews',
    category: ['website-builders', 'ai-tools'], ratingOverall: 4.6, ratingEase: 4.5, ratingFeatures: 4.6, ratingPricing: 4.3, ratingSupport: 4.4,
    verdict: 'The best tool for designers who want to go from Figma-like prototyping to live sites. Strong AI features and animation capabilities.',
    reviewBody: '## What is Framer?\n\nFramer started as a prototyping tool and evolved into a full website builder. It offers a Figma-like design experience with the ability to publish sites directly.\n\n## Key Features\n\n- **Figma-like Editor**: Familiar interface for designers\n- **AI Site Generation**: Generate sites from prompts\n- **Effects & Animations**: Scroll effects, hover states, transitions\n- **CMS**: Built-in content management\n- **Plugins**: Extend functionality with community plugins\n\n## Pricing\n\nFramer offers a free mini-site plan and paid plans starting at $15/month for full sites.',
    pros: ['Designer-friendly interface', 'Strong AI generation', 'Great animations', 'Fast publishing', 'Good free tier'],
    cons: ['Smaller ecosystem than Webflow', 'CMS less powerful', 'Limited ecommerce', 'Some features require coding'],
    pricingTiers: [{ name: 'Mini', priceMonthly: 0, priceAnnual: 0, features: ['Framer domain', 'Home + 2 pages'] }, { name: 'Basic', priceMonthly: 15, priceAnnual: 180, features: ['Custom domain', '150 pages', '10k visitors'] }, { name: 'Pro', priceMonthly: 25, priceAnnual: 300, features: ['Unlimited pages', '200k visitors', 'CMS collections'] }],
    bestFor: ['Design teams', 'Landing pages', 'Portfolio sites', 'Marketing sites'],
    featured: true, sponsored: false, metaTitle: 'Framer Review 2026 - From Design to Live Site', metaDescription: 'Framer review: AI site generation, designer workflow, pricing, and how it compares to Webflow.',
    imageUrl: '/images/tool-framer.jpg'
  },
  {
    id: '4', name: 'Bubble', slug: 'bubble', tagline: 'The most powerful no-code app builder',
    logoUrl: '', websiteUrl: 'https://bubble.io', affiliateUrl: 'https://bubble.io?ref=nocodereviews',
    category: ['app-builders'], ratingOverall: 4.4, ratingEase: 3.8, ratingFeatures: 4.8, ratingPricing: 4.2, ratingSupport: 4.3,
    verdict: 'The most capable no-code platform for building complex web applications. A real alternative to traditional development for many use cases.',
    reviewBody: '## What is Bubble?\n\nBubble is a full-featured no-code platform for building complex web applications. It offers a visual programming environment that can handle databases, user authentication, API integrations, and more.\n\n## Key Features\n\n- **Visual Programming**: Build logic with workflows\n- **Database**: Built-in database with complex queries\n- **API Connector**: Connect to any external service\n- **Plugin Ecosystem**: Hundreds of plugins available\n- **Responsive Design**: Build for all screen sizes\n\n## Who is it for?\n\nBubble is ideal for entrepreneurs building SaaS products, marketplaces, and social networks.',
    pros: ['Most powerful logic builder', 'Mature ecosystem', 'Scalable hosting', 'Extensive plugin library', 'Active community'],
    cons: ['Steep learning curve', 'Performance can lag', 'Not mobile-native', 'Complex pricing'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['Development only', 'Bubble branding'] }, { name: 'Starter', priceMonthly: 29, priceAnnual: 348, features: ['Live app', 'Custom domain', '175k workload units'] }, { name: 'Growth', priceMonthly: 119, priceAnnual: 1428, features: ['2 apps', '250k workload units', 'Premium support'] }],
    bestFor: ['SaaS founders', 'Marketplaces', 'Social platforms', 'Complex web apps'],
    featured: true, sponsored: false, metaTitle: 'Bubble Review 2026 - Build Real Apps Without Code', metaDescription: 'Bubble review: The most powerful no-code app platform. Learn about workflows, plugins, pricing, and limitations.',
    imageUrl: '/images/tool-bubble.jpg'
  },
  {
    id: '5', name: 'Shopify', slug: 'shopify', tagline: 'The leading ecommerce platform',
    logoUrl: '', websiteUrl: 'https://shopify.com', affiliateUrl: 'https://shopify.com?ref=nocodereviews',
    category: ['ecommerce'], ratingOverall: 4.7, ratingEase: 4.6, ratingFeatures: 4.8, ratingPricing: 4.0, ratingSupport: 4.7,
    verdict: 'The gold standard for ecommerce. Unmatched ecosystem, reliability, and scalability for online stores of any size.',
    reviewBody: '## What is Shopify?\n\nShopify is the world\'s leading ecommerce platform, powering over 4 million online stores. It provides everything needed to start, run, and grow an online business.\n\n## Key Features\n\n- **Online Store Builder**: Customizable themes and drag-and-drop editor\n- **Payment Processing**: Shopify Payments with competitive rates\n- **Inventory Management**: Track stock across channels\n- **Marketing Tools**: SEO, email marketing, social integration\n- **App Store**: 8,000+ apps to extend functionality\n\n## Pricing\n\nPlans start at $39/month plus transaction fees. Shopify Plus for enterprises starts at $2,300/month.',
    pros: ['Most mature ecommerce platform', 'Huge app ecosystem', 'Excellent uptime and security', 'Multi-channel selling', 'Great customer support'],
    cons: ['Transaction fees without Shopify Payments', 'Monthly costs add up', 'Theme customization limits', 'Blog/CMS is basic'],
    pricingTiers: [{ name: 'Basic', priceMonthly: 39, priceAnnual: 468, features: ['Online store', '2 staff accounts', 'Basic reports'] }, { name: 'Shopify', priceMonthly: 105, priceAnnual: 1260, features: ['5 staff accounts', 'Professional reports', 'Lower transaction fees'] }, { name: 'Advanced', priceMonthly: 399, priceAnnual: 4788, features: ['15 staff accounts', 'Advanced reports', 'Third-party calculated shipping'] }],
    bestFor: ['Online retailers', 'DTC brands', 'Omnichannel sellers', 'Businesses scaling fast'],
    featured: true, sponsored: false, metaTitle: 'Shopify Review 2026 - Ecommerce Platform', metaDescription: 'Complete Shopify review: pricing, features, app ecosystem, and whether it\'s right for your store.',
    imageUrl: '/images/tool-shopify.jpg'
  },
  {
    id: '6', name: 'Zapier', slug: 'zapier', tagline: 'Connect your apps and automate workflows',
    logoUrl: '', websiteUrl: 'https://zapier.com', affiliateUrl: 'https://zapier.com?ref=nocodereviews',
    category: ['automation'], ratingOverall: 4.5, ratingEase: 4.7, ratingFeatures: 4.6, ratingPricing: 4.0, ratingSupport: 4.4,
    verdict: 'The most popular automation platform with 7,000+ app integrations. Essential for connecting your no-code stack.',
    reviewBody: '## What is Zapier?\n\nZapier is an online automation tool that connects your favorite apps, such as Gmail, Slack, Mailchimp, and over 7,000 others.\n\n## Key Features\n\n- **Zaps**: Automated workflows between apps\n- **Multi-step Zaps**: Chain multiple actions together\n- **Filters & Logic**: Conditional automation\n- **Paths**: Branching logic for complex workflows\n- **AI Features**: Natural language automation builder\n\n## Pricing\n\nFree plan for 100 tasks/month. Paid plans start at $19.99/month.',
    pros: ['7,000+ app integrations', 'Easy to use', 'Reliable execution', 'Great free tier', 'AI automation builder'],
    cons: ['Can get expensive with high task volume', 'Some integrations are basic', 'No real-time syncing on lower plans'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['100 tasks/month', '5 Zaps', 'Single-step Zaps'] }, { name: 'Professional', priceMonthly: 19.99, priceAnnual: 239.88, features: ['750 tasks/month', 'Unlimited Zaps', 'Multi-step Zaps'] }, { name: 'Team', priceMonthly: 69, priceAnnual: 828, features: ['2,000 tasks/month', 'Shared workspaces', 'Premier support'] }],
    bestFor: ['Small businesses', 'Marketing teams', 'Operations automation', 'App integration'],
    featured: false, sponsored: false, metaTitle: 'Zapier Review 2026 - Automation Platform', metaDescription: 'Zapier review: 7,000+ integrations, pricing, and how to automate your no-code stack.',
    imageUrl: '/images/tool-zapier.jpg'
  },
  {
    id: '7', name: 'Airtable', slug: 'airtable', tagline: 'The spreadsheet-database hybrid',
    logoUrl: '', websiteUrl: 'https://airtable.com', affiliateUrl: 'https://airtable.com?ref=nocodereviews',
    category: ['database'], ratingOverall: 4.5, ratingEase: 4.4, ratingFeatures: 4.5, ratingPricing: 4.1, ratingSupport: 4.3,
    verdict: 'The most flexible database tool for non-developers. Spreadsheets meet relational databases in a beautiful interface.',
    reviewBody: '## What is Airtable?\n\nAirtable combines the simplicity of a spreadsheet with the power of a database. It\'s used for project management, content calendars, CRM, and more.\n\n## Key Features\n\n- **Multiple Views**: Grid, Kanban, Calendar, Gallery, Form\n- **Relational Database**: Link records between tables\n- **Automations**: Built-in workflow automation\n- **Interface Designer**: Build custom apps on your data\n- **Extensions**: Add charts, maps, and more\n\n## Pricing\n\nFree for up to 1,000 records per base. Plus plan at $20/user/month.',
    pros: ['Extremely flexible', 'Beautiful interface', 'Multiple views', 'Strong collaboration', 'Active marketplace'],
    cons: ['Can get expensive for teams', 'Record limits on lower plans', 'Not a full backend replacement', 'Limited formula capabilities vs Excel'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['1,000 records/base', '1GB attachment space', 'Interface Designer'] }, { name: 'Plus', priceMonthly: 20, priceAnnual: 240, features: ['5,000 records/base', '5GB attachment space', 'Custom branded forms'] }, { name: 'Pro', priceMonthly: 45, priceAnnual: 540, features: ['50,000 records/base', '20GB attachment space', 'Scripting'] }],
    bestFor: ['Project management', 'Content operations', 'CRM', 'Inventory tracking'],
    featured: false, sponsored: false, metaTitle: 'Airtable Review 2026 - Database for Everyone', metaDescription: 'Airtable review: spreadsheet meets database. Views, automations, pricing, and use cases.',
    imageUrl: '/images/tool-airtable.jpg'
  },
  {
    id: '8', name: 'Notion', slug: 'notion', tagline: 'All-in-one workspace for notes, docs, and databases',
    logoUrl: '', websiteUrl: 'https://notion.so', affiliateUrl: 'https://notion.so?ref=nocodereviews',
    category: ['nocode-cms', 'database'], ratingOverall: 4.6, ratingEase: 4.3, ratingFeatures: 4.7, ratingPricing: 4.5, ratingSupport: 4.2,
    verdict: 'The most versatile productivity tool. Docs, wikis, databases, and project management in one beautiful, collaborative space.',
    reviewBody: '## What is Notion?\n\nNotion is an all-in-one workspace that combines note-taking, document creation, databases, and project management.\n\n## Key Features\n\n- **Flexible Pages**: Mix text, images, databases, and embeds\n- **Databases**: Multiple views including table, board, calendar, list\n- **Templates**: Huge template gallery\n- **Collaboration**: Real-time editing and comments\n- **AI Assistant**: Built-in AI for writing and summarizing\n\n## Pricing\n\nFree for personal use. Plus at $10/user/month. Business at $15/user/month.',
    pros: ['Incredibly versatile', 'Beautiful design', 'Great free tier', 'Huge template community', 'Strong AI features'],
    cons: ['Can be slow with large databases', 'Mobile app limitations', 'Steep learning curve for advanced features', 'Offline access limited'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['Unlimited pages', '10 guest invites', '7-day page history'] }, { name: 'Plus', priceMonthly: 10, priceAnnual: 120, features: ['Unlimited file uploads', '100 guest invites', '30-day page history'] }, { name: 'Business', priceMonthly: 15, priceAnnual: 180, features: ['SAML SSO', 'Private teamspaces', '90-day page history'] }],
    bestFor: ['Knowledge management', 'Project management', 'Personal productivity', 'Team collaboration'],
    featured: false, sponsored: false, metaTitle: 'Notion Review 2026 - All-in-One Workspace', metaDescription: 'Notion review: notes, docs, databases, and AI in one tool. Pricing, features, and alternatives.',
    imageUrl: '/images/tool-notion.jpg'
  },
  {
    id: '9', name: 'Make', slug: 'make', tagline: 'Visual automation with advanced logic',
    logoUrl: '', websiteUrl: 'https://make.com', affiliateUrl: 'https://make.com?ref=nocodereviews',
    category: ['automation'], ratingOverall: 4.4, ratingEase: 4.0, ratingFeatures: 4.7, ratingPricing: 4.3, ratingSupport: 4.2,
    verdict: 'More powerful than Zapier for complex automations. The visual scenario builder is a game-changer for advanced workflows.',
    reviewBody: '## What is Make?\n\nMake (formerly Integromat) is a visual automation platform that lets you build complex workflows with advanced logic, data transformation, and error handling.\n\n## Key Features\n\n- **Visual Scenario Builder**: Drag-and-drop workflow creation\n- **Advanced Logic**: Iterators, aggregators, routers\n- **Data Transformation**: Transform data between apps\n- **Error Handling**: Built-in error routes and retries\n- **1,000+ Apps**: Wide integration library\n\n## Pricing\n\nFree for 1,000 operations/month. Core plan at $9/month.',
    pros: ['More powerful than competitors', 'Visual builder is intuitive', 'Advanced data handling', 'Better value for high volume', 'Detailed execution history'],
    cons: ['Steeper learning curve', 'Fewer integrations than Zapier', 'Interface can feel complex', 'Smaller community'],
    pricingTiers: [{ name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['1,000 ops/month', '2 active scenarios'] }, { name: 'Core', priceMonthly: 9, priceAnnual: 108, features: ['10,000 ops/month', 'Unlimited scenarios'] }, { name: 'Pro', priceMonthly: 16, priceAnnual: 192, features: ['40,000 ops/month', 'Full-text search', ' scenario outputs'] }],
    bestFor: ['Complex automations', 'Data transformation', 'Tech-savvy teams', 'High-volume workflows'],
    featured: false, sponsored: false, metaTitle: 'Make Review 2026 - Advanced Automation', metaDescription: 'Make (Integromat) review: visual automation with advanced logic. Pricing vs Zapier and features.',
    imageUrl: '/images/tool-make.jpg'
  },
];

export const articles: Article[] = [
  {
    id: '1', slug: 'lovable-review-2026', title: 'Lovable Review 2026: The AI App Builder That Actually Works',
    body: 'Full review content here...', excerpt: 'We tested Lovable, the AI-powered full-stack app builder. Here\'s why it\'s the fastest way from idea to deployed app in 2026.',
    articleType: 'review', category: 'AI Tools', tags: ['lovable', 'ai', 'app-builder', 'review'], seoTitle: 'Lovable Review 2026', seoDescription: 'In-depth Lovable review',
    featuredImageUrl: '/images/tool-lovable.jpg', author: 'Editorial Team', wordCount: 2500, readingTimeMins: 12,
    status: 'published', publishedAt: '2026-05-15T10:00:00Z', updatedAt: '2026-05-15T10:00:00Z', viewCount: 3420, featured: true
  },
  {
    id: '2', slug: 'webflow-vs-framer-2026', title: 'Webflow vs Framer: Which Website Builder Wins in 2026?',
    body: 'Comparison content...', excerpt: 'Two powerhouse website builders go head-to-head. We compare design freedom, AI features, pricing, and ease of use.',
    articleType: 'comparison', category: 'Website Builders', tags: ['webflow', 'framer', 'comparison'], seoTitle: 'Webflow vs Framer 2026', seoDescription: 'Detailed comparison',
    featuredImageUrl: '/images/guide-webflow-vs-framer.jpg', author: 'Editorial Team', wordCount: 3200, readingTimeMins: 15,
    status: 'published', publishedAt: '2026-05-10T10:00:00Z', updatedAt: '2026-05-10T10:00:00Z', viewCount: 5180, featured: true
  },
  {
    id: '3', slug: 'best-no-code-ai-builders', title: 'The Rise of AI Website Builders: 8 Best Tools for 2026',
    body: 'Best-of content...', excerpt: 'AI is transforming how we build websites. These 8 tools are leading the revolution with prompt-to-site capabilities.',
    articleType: 'best-of', category: 'AI Tools', tags: ['ai', 'website-builders', 'best-of'], seoTitle: 'Best AI Website Builders 2026', seoDescription: 'Top AI builders',
    featuredImageUrl: '/images/guide-ai-builders.jpg', author: 'Editorial Team', wordCount: 4500, readingTimeMins: 22,
    status: 'published', publishedAt: '2026-05-05T10:00:00Z', updatedAt: '2026-05-05T10:00:00Z', viewCount: 8950, featured: true
  },
  {
    id: '4', slug: 'webflow-seo-guide', title: 'Is Webflow Good for SEO? A Complete Guide for 2026',
    body: 'Tutorial content...', excerpt: 'Everything you need to know about Webflow SEO: technical setup, best practices, and how it compares to WordPress.',
    articleType: 'tutorial', category: 'Website Builders', tags: ['webflow', 'seo', 'tutorial'], seoTitle: 'Webflow SEO Guide 2026', seoDescription: 'Complete SEO guide',
    featuredImageUrl: '/images/guide-webflow-seo.jpg', author: 'Editorial Team', wordCount: 3800, readingTimeMins: 18,
    status: 'published', publishedAt: '2026-04-28T10:00:00Z', updatedAt: '2026-04-28T10:00:00Z', viewCount: 6230, featured: false
  },
  {
    id: '5', slug: 'bubble-vs-traditional-dev', title: 'Bubble vs Traditional Development: When to Choose No-Code',
    body: 'Guide content...', excerpt: 'A framework for deciding when Bubble can replace traditional coding, and when you still need engineers.',
    articleType: 'guide', category: 'App Builders', tags: ['bubble', 'no-code', 'development'], seoTitle: 'Bubble vs Coding', seoDescription: 'When to choose no-code',
    featuredImageUrl: '/images/tool-bubble.jpg', author: 'Editorial Team', wordCount: 2900, readingTimeMins: 14,
    status: 'published', publishedAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-20T10:00:00Z', viewCount: 4100, featured: false
  },
  {
    id: '6', slug: 'shopify-alternatives-2026', title: '7 Best Shopify Alternatives for Ecommerce in 2026',
    body: 'Best-of content...', excerpt: 'Shopify is great but not for everyone. We found 7 alternatives that might be better for your specific ecommerce needs.',
    articleType: 'best-of', category: 'Ecommerce', tags: ['shopify', 'alternatives', 'ecommerce'], seoTitle: 'Shopify Alternatives 2026', seoDescription: 'Best alternatives',
    featuredImageUrl: '/images/tool-shopify.jpg', author: 'Editorial Team', wordCount: 3600, readingTimeMins: 17,
    status: 'published', publishedAt: '2026-04-15T10:00:00Z', updatedAt: '2026-04-15T10:00:00Z', viewCount: 7890, featured: false
  },
];

export const comparisons: Comparison[] = [
  {
    id: '1', slug: 'lovable-vs-bolt', title: 'Lovable vs Bolt: AI App Builders Compared',
    toolA: tools[0], toolB: tools[1], body: 'Detailed comparison...',
    winnerOverall: 'lovable', seoTitle: 'Lovable vs Bolt', seoDescription: 'Compare Lovable and Bolt',
    viewCount: 2340, status: 'published', publishedAt: '2026-05-01T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: '2', slug: 'webflow-vs-framer', title: 'Webflow vs Framer: Website Builder Battle',
    toolA: tools[1], toolB: tools[2], body: 'Detailed comparison...',
    winnerOverall: 'webflow', seoTitle: 'Webflow vs Framer', seoDescription: 'Compare Webflow and Framer',
    viewCount: 5180, status: 'published', publishedAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-20T10:00:00Z'
  },
  {
    id: '3', slug: 'zapier-vs-make', title: 'Zapier vs Make: Automation Platforms Compared',
    toolA: tools[5], toolB: tools[8], body: 'Detailed comparison...',
    winnerOverall: undefined, seoTitle: 'Zapier vs Make', seoDescription: 'Compare automation tools',
    viewCount: 3450, status: 'published', publishedAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-10T10:00:00Z'
  },
  {
    id: '4', slug: 'airtable-vs-notion', title: 'Airtable vs Notion: Database Tools Face Off',
    toolA: tools[6], toolB: tools[7], body: 'Detailed comparison...',
    winnerOverall: undefined, seoTitle: 'Airtable vs Notion', seoDescription: 'Compare database tools',
    viewCount: 4120, status: 'published', publishedAt: '2026-03-28T10:00:00Z', updatedAt: '2026-03-28T10:00:00Z'
  },
];

export const userRatings: UserRating[] = [
  { id: '1', toolId: '1', rating: 5, reviewText: 'Built my MVP in 2 hours. Incredible.', reviewerName: 'Sarah K.', submittedAt: '2026-05-10T10:00:00Z', approved: true },
  { id: '2', toolId: '1', rating: 4, reviewText: 'Great for prototyping but needs more customization.', reviewerName: 'Mike R.', submittedAt: '2026-05-08T10:00:00Z', approved: true },
  { id: '3', toolId: '2', rating: 5, reviewText: 'The design freedom is unmatched. Best for professional sites.', reviewerName: 'Jessica T.', submittedAt: '2026-05-05T10:00:00Z', approved: true },
  { id: '4', toolId: '3', rating: 5, reviewText: 'As a designer, Framer feels like home. Publishing is seamless.', reviewerName: 'Alex M.', submittedAt: '2026-05-03T10:00:00Z', approved: true },
];

export const subscribers: Subscriber[] = [
  { id: '1', email: 'user1@example.com', confirmed: true, subscribedAt: '2026-05-01T10:00:00Z', source: 'homepage', tags: ['newsletter'] },
  { id: '2', email: 'user2@example.com', confirmed: true, subscribedAt: '2026-05-02T10:00:00Z', source: 'footer', tags: ['newsletter'] },
  { id: '3', email: 'user3@example.com', confirmed: false, subscribedAt: '2026-05-10T10:00:00Z', source: 'article', tags: ['newsletter'] },
];

export const sponsoredSlots: SponsoredSlot[] = [
  { id: '1', toolId: '1', slotName: 'Homepage Hero', slotPosition: 'homepage-1', startDate: '2026-05-01', endDate: '2026-06-01', monthlyFee: 500, active: true },
];

export const adminStats: AdminStats = {
  totalTools: 9,
  publishedArticles: 6,
  activeSubscribers: 1247,
  affiliateClicks30d: 342,
  sponsoredRevenue: 1500,
};

export const engineStatuses: EngineStatus[] = [
  { name: 'Content Engine', status: 'active', lastRun: '2026-05-22T06:00:00Z', nextRun: '2026-05-23T06:00:00Z' },
  { name: 'Quality Gateway', status: 'active', lastRun: '2026-05-22T06:05:00Z', nextRun: '2026-05-23T06:05:00Z' },
  { name: 'pSEO Engine', status: 'active', lastRun: '2026-05-21T08:00:00Z', nextRun: '2026-05-28T08:00:00Z' },
  { name: 'Monetization', status: 'active', lastRun: '2026-05-18T06:00:00Z', nextRun: '2026-05-25T06:00:00Z' },
  { name: 'Audience Engine', status: 'paused', lastRun: '2026-05-15T05:00:00Z', nextRun: '2026-05-29T05:00:00Z' },
  { name: 'CRO Engine', status: 'active', lastRun: '2026-05-18T05:30:00Z', nextRun: '2026-05-25T05:30:00Z' },
];

export const getToolsByCategory = (categorySlug: string): Tool[] => {
  return tools.filter(tool => tool.category.includes(categorySlug));
};

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find(tool => tool.slug === slug);
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getComparisonBySlug = (slug: string): Comparison | undefined => {
  return comparisons.find(comp => comp.slug === slug);
};

export const getRelatedTools = (toolId: string, limit: number = 3): Tool[] => {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return [];
  return tools.filter(t => t.id !== toolId && t.category.some(c => tool.category.includes(c))).slice(0, limit);
};

export const getRelatedComparisons = (toolId: string, limit: number = 4): Comparison[] => {
  return comparisons.filter(comp => comp.toolA.id === toolId || comp.toolB.id === toolId).slice(0, limit);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};
