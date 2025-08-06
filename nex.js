// --- Utility Functions (equivalent to Python's random, uuid) ---
function weightedRandomChoice(items, weights) {
    let i;
    let cumulativeWeights = [];
    for (i = 0; i < weights.length; i++) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }

    let random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];

    for (i = 0; i < cumulativeWeights.length; i++) {
        if (random < cumulativeWeights[i]) {
            return items[i];
        }
    }
    return items[items.length - 1];
}

// --- Product Data Definitions (Translated from products.py) ---

const NUM_NEW_PRODUCTS_TO_ADD = 200;

const ADJECTIVES = [
    "Advanced", "Smart", "Dynamic", "Intuitive", "Modern", "Seamless", "Robust", "Versatile", "Personalized",
    "Cutting-Edge", "Integrated", "Interactive", "Streamlined", "Comprehensive", "Scalable", "Efficient",
    "Elegant", "Sophisticated", "Agile", "Optimized", "Intelligent", "Innovative", "Responsive", "Secure",
    "Professional", "Vibrant", "User-Friendly", "Global", "Powerful", "Flexible", "Data-Driven", "Creative",
    "Collaborative", "Automated", "Next-Gen", "High-Performance", "Customizable", "AI-Powered", "Cloud-Based",
    "Mobile-Ready", "Futuristic", "Adaptive", "Holistic", "Integrated", "Quantum", "Synergistic", "Transformative",
    "Groundbreaking", "Revolutionary", "Pioneering", "Leading-Edge", "Premier", "Elite", "Exceptional",
    "Superior", "Prime", "Top-Tier", "World-Class", "Exceptional", "Unrivaled", "Unparalleled", "State-of-the-Art",
    "Futuristic", "Disruptive", "Game-Changing", "Progressive", "Forward-Thinking", "Optimized", "Enhanced",
    "Redefined", "Simplified", "Accelerated", "Refined", "Polished", "Sleek", "Minimalist", "Bold", "Vivid",
    "Strategic", "Tactical", "Strategic", "Proactive", "Reactive", "Profound", "Insightful", "Actionable",
    "Empowering", "Transformative", "Impactful", "Meaningful", "Purpose-Driven", "Value-Driven", "Customer-Centric",
    "Outcome-Focused", "Solution-Oriented", "Results-Driven", "Performance-Driven", "Growth-Oriented",
    "Future-Proof", "Sustainable", "Eco-Friendly", "Ethical", "Responsible", "Transparent", "Trustworthy",
    "Reliable", "Dependable", "Consistent", "Consistent", "Flawless", "Exceptional", "Outstanding", "Superb",
    "Magnificent", "Splendid", "Stellar", "Brilliant", "Radiant", "Sparkling", "Dazzling", "Vivid", "Luminous",
    "Shining", "Gleaming", "Glittering", "Glistening", "Shimmering", "Twinkling", "Scintillating", "Resplendent",
    "Sublime", "Grand", "Majestic", "Regal", "Noble", "Opulent", "Luxurious", "Posh", "Fancy", "Elegant",
    "Chic", "Stylish", "Fashionable", "Trendy", "Modernistic", "Contemporary", "Classic", "Timeless", "Vintage",
    "Retro", "Artistic", "Creative", "Innovative", "Imaginative", "Visionary", "Ingenious", "Clever", "Astute",
    "Perceptive", "Discerning", "Insightful", "Sagacious", "Wise", "Knowledgeable", "Expert", "Proficient",
    "Skilled", "Adept", "Masterful", "Virtuoso", "Seasoned", "Experienced", "Veteran", "Pioneer", "Trailblazer"
];

const ECOMMERCE_CATEGORIES_SPECIFIC = ['e-commerce', 'retail', 'marketplace', 'fashion', 'grocery store', 'digital goods', 'subscription box', 'arts & crafts store', 'book store', 'electronics store'];
const APP_CATEGORIES_SPECIFIC = ['app', 'productivity', 'finance', 'health', 'education', 'entertainment', 'travel planner', 'social media', 'utility', 'communication', 'gaming', 'food delivery', 'learning', 'music streaming'];
const WEBSITE_CATEGORIES_SPECIFIC = ['website', 'portfolio', 'corporate', 'blog', 'real estate', 'restaurant', 'fitness', 'travel', 'event', 'saas', 'web development'];
const AI_CATEGORIES_SPECIFIC = ['ai solutions', 'cybersecurity', 'data analytics', 'cloud services', 'consulting', 'custom software', 'game development', 'design'];

const CATEGORY_COLORS = {
    'ai solutions': '#28a745',    // Green
    'web development': '#007bff', // Blue
    'mobile apps': '#6f42c1',     // Purple
    'design': '#fd7e14',          // Orange
    'e-commerce': '#dc3545',      // Red
    'cybersecurity': '#17a2b8',   // Teal
    'data analytics': '#ffc107',  // Yellow
    'cloud services': '#6610f2',  // Indigo
    'consulting': '#e83e8c',      // Pink
    'custom software': '#20c997', // Emerald
    'game development': '#6c757d', // Grey (default)

    // General categories (often overlapping with the above)
    'website': '#3498db', 'portfolio': '#9b59b6', 'corporate': '#2c3e50',
    'blog': '#1abc9c', 'real estate': '#e74c3c', 'restaurant': '#e67e22',
    'education': '#2980b9', 'fitness': '#27ae60', 'travel': '#f1c40f',
    'event': '#8e44ad', 'saas': '#34495e', 'ai': '#e67e22', 'app': '#2ecc71',
    'retail': '#e91e63', 'marketplace': '#ff9800', 'fashion': '#9c27b0',
    'grocery store': '#cddc39', 'digital goods': '#607d8b',
    'subscription box': '#795548', 'productivity': '#673ab7', 'finance': '#009688',
    'health': '#4caf50', 'entertainment': '#f4436', 'travel planner': '#03a9f4',
    'social media': '#5e35b1', 'utility': '#ffc107', 'communication': '#00796b',
    'gaming': '#ff5252', 'food delivery': '#ff5722', 'learning': '#1a237e',
    'arts & crafts store': '#FFD700', 'book store': '#A52A2A', 'electronics store': '#00BFFF',
    'music streaming': '#9C27B0'
};

let CATEGORY_WEIGHTS = {
    'e-commerce': 0.10, 'app': 0.10, 'website': 0.10, 'ai solutions': 0.08,
    'retail': 0.03, 'marketplace': 0.03, 'fashion': 0.03, 'grocery store': 0.02,
    'digital goods': 0.02, 'subscription box': 0.02, 'productivity': 0.03,
    'finance': 0.02, 'health': 0.02, 'education': 0.02, 'entertainment': 0.01, 'food delivery': 0.01,
    'learning': 0.01, 'portfolio': 0.03, 'corporate': 0.03, 'blog': 0.02,
    'real estate': 0.02, 'restaurant': 0.02, 'fitness': 0.02, 'travel': 0.02,
    'event': 0.01, 'saas': 0.03, 'cybersecurity': 0.04, 'data analytics': 0.04,
    'cloud services': 0.03, 'consulting': 0.03, 'custom software': 0.03,
    'game development': 0.02, 'design': 0.03, 'web development': 0.05,
    'social media': 0.015, 'utility': 0.015, 'communication': 0.015, 'gaming': 0.015,
    'travel planner': 0.015, 'music streaming': 0.015, 'arts & crafts store': 0.01,
    'book store': 0.01, 'electronics store': 0.01
};

const ALL_CATEGORY_KEYS = Object.keys(CATEGORY_COLORS);
for (const cat of ALL_CATEGORY_KEYS) {
    if (!(cat in CATEGORY_WEIGHTS)) {
        CATEGORY_WEIGHTS[cat] = 0.005; // Small default weight
    }
}

let TOTAL_WEIGHT = 0;
for (const cat in CATEGORY_WEIGHTS) {
    TOTAL_WEIGHT += CATEGORY_WEIGHTS[cat];
}

if (TOTAL_WEIGHT > 0) {
    for (const cat in CATEGORY_WEIGHTS) {
        CATEGORY_WEIGHTS[cat] /= TOTAL_WEIGHT; // Normalize
    }
}

const CATEGORIES_FOR_CHOICE = Object.keys(CATEGORY_WEIGHTS);
const WEIGHTS_FOR_CHOICE = Object.values(CATEGORY_WEIGHTS);

const BASE_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'AED', 'SGD', 'MXN', 'BRL'];

// --- Description Templates and Word Lists ---
const ECOMMERCE_DESC_TEMPLATES = [
    "A [ADJ] e-commerce platform for selling [ITEM_TYPE]. Features include easy product management, secure payments, and a mobile-responsive design. Boost your online sales with this solution.",
    "Launch your [ADJ] online [STORE_TYPE] with a beautiful and functional design. Includes inventory management, customer accounts, and marketing tools. Perfect for businesses of all sizes.",
    "Build a [ADJ] digital storefront for [NICHE]. Supports multiple payment gateways and shipping options. Provide a seamless shopping experience for your customers.",
    "An [ADJ] solution for your [STORE_TYPE] needs, offering integrated analytics and a streamlined checkout process. Drive conversions and enhance customer loyalty.",
    "Designed for [NICHE] businesses, this [ADJ] e-commerce site ensures optimal performance and a delightful user experience on any device.",
    "Transform your retail strategy with this [ADJ] marketplace solution, enabling multiple vendors and diverse product listings.",
    "Elevate your [FASHION_NICHE] brand with an [ADJ] e-commerce site featuring stunning visuals and intuitive navigation.",
    "A [ADJ] platform for [SUBSCRIPTION_TYPE] box businesses, managing recurring payments and customer subscriptions with ease.",
    "Showcase and sell your [DIGITAL_PRODUCT_TYPE] with this [ADJ] digital goods store, complete with secure delivery and licensing options."
];
const APP_DESC_TEMPLATES = [
    "An [ADJ] mobile application for [APP_FUNCTION]. Offers a user-friendly interface and robust features to simplify your daily tasks.",
    "Boost your [AREA] with this [ADJ] app solution. Track progress, manage schedules, and collaborate effectively from anywhere.",
    "Transform your [ACTIVITY] with an [ADJ] and interactive application. Designed for [TARGET_USER] to enhance their [BENEFIT].",
    "Experience seamless [APP_FUNCTION] with this [ADJ] app, featuring offline capabilities and cloud synchronization.",
    "A [ADJ] digital tool for [TARGET_USER] to [BENEFIT_VERB] their [AREA] effectively, with real-time updates and smart notifications.",
    "Your ultimate companion for [ACTIVITY], this [ADJ] app helps you [BENEFIT_VERB] your [AREA] goals with ease and precision.",
    "Simplify your [AREA] with this [ADJ] and intuitive mobile application, packed with features for [BENEFIT_VERB] and [BENEFIT_APP_2].",
    "Stay organized and productive with this [ADJ] task manager app, featuring visual boards and customizable workflows.",
    "Manage your finances effortlessly with this [ADJ] budgeting app, offering expense tracking, goal setting, and insightful reports."
];
const WEBSITE_DESC_TEMPLATES = [
    "A [ADJ] website template for [WEBSITE_TYPE] businesses. Professional design, easy customization, and essential features to establish your online presence.",
    "Create a captivating [ADJ] online presence for your [WEBSITE_TYPE] project. Showcases your work with elegant layouts and engaging content sections.",
    "Launch your [ADJ] [WEBSITE_TYPE] portal. Fully responsive and optimized for speed, it provides a powerful foundation for your online strategy.",
    "Build a [ADJ] and interactive [WEBSITE_TYPE] to engage your audience and highlight your unique value proposition.",
    "This [ADJ] web solution provides a complete toolkit for managing your [WEBSITE_TYPE] online presence with minimal effort.",
    "Design and develop stunning websites with our [ADJ] web development framework, ensuring performance and scalability."
];
const AI_DESC_TEMPLATES = [
    "Leverage [ADJ] AI for [BENEFIT_AI]. Our solution provides [FEATURE1_AI], [FEATURE2_AI], and [BENEFIT_DETAIL_AI].",
    "An [ADJ] AI system designed to [AI_ACTION] your [BUSINESS_AREA]. Automate processes and gain valuable insights.",
    "Unlock the power of [ADJ] artificial intelligence for [PROBLEM_SOLVING]. Intuitive and highly accurate, it streamlines complex tasks.",
    "Revolutionize [BUSINESS_AREA] with this [ADJ] AI-powered platform, offering [FEATURE1_AI] and deep [BENEFIT_AI] capabilities.",
    "Enhance decision-making with our [ADJ] AI analytics solution, delivering predictive insights from complex data."
];
const CYBERSECURITY_DESC_TEMPLATES = [
    "A [ADJ] cybersecurity service protecting your digital assets from threats. Includes advanced threat detection and real-time monitoring, ensuring data integrity.",
    "Safeguard your business with our [ADJ] cybersecurity audit. Identifies vulnerabilities and provides actionable security recommendations, minimizing risk.",
    "Implement [ADJ] threat intelligence to proactively defend against evolving cyber threats and maintain business continuity."
];
const DATA_ANALYTICS_DESC_TEMPLATES = [
    "Unlock insights with our [ADJ] data analytics platform. Transform raw data into actionable intelligence with powerful visualizations and predictive models.",
    "A [ADJ] solution for comprehensive data analysis and reporting. Streamline your data pipelines and make informed decisions based on accurate metrics.",
    "Gain competitive advantage with [ADJ] big data processing capabilities, designed for real-time insights and strategic planning."
];
const CLOUD_SERVICES_DESC_TEMPLATES = [
    "Deploy and manage your applications with our [ADJ] cloud infrastructure services. Scalable, reliable, and secure cloud solutions for modern enterprises.",
    "Optimize your operations with [ADJ] cloud computing. Flexible and cost-effective services for storage, compute, and networking, ensuring high availability.",
    "Migrate to the cloud seamlessly with our [ADJ] cloud migration services, ensuring minimal downtime and maximum data integrity."
];
const CONSULTING_DESC_TEMPLATES = [
    "Receive [ADJ] IT consulting services to strategize and implement your digital transformation journey, aligning technology with business goals.",
    "Our [ADJ] consulting approach helps businesses optimize technology use for maximum efficiency and growth, offering expert guidance.",
    "Benefit from [ADJ] strategic consulting for technology adoption, ensuring your investments yield optimal returns and sustainable growth."
];
const CUSTOM_SOFTWARE_DESC_TEMPLATES = [
    "Develop bespoke [ADJ] software tailored to your unique business needs. Custom solutions for improved workflows and competitive advantage, built from scratch.",
    "From concept to deployment, we build [ADJ] custom software applications designed for specific industry challenges, ensuring perfect fit.",
    "Realize your vision with [ADJ] custom software development, providing scalable and secure applications that drive innovation."
];
const GAME_DEVELOPMENT_DESC_TEMPLATES = [
    "Bring your gaming vision to life with our [ADJ] game development services. Engaging experiences for various platforms, from concept to launch.",
    "Full-cycle [ADJ] game development, from concept art to coding and post-launch support. Create immersive digital worlds that captivate players.",
    "Partner with us for [ADJ] indie game development, transforming unique ideas into compelling interactive entertainment experiences."
];
const DESIGN_DESC_TEMPLATES = [
    "Elevate your brand with our [ADJ] graphic design services. Captivating visuals for logos, marketing materials, and UI/UX, ensuring cohesive branding.",
    "Professional [ADJ] web and app design to create intuitive and aesthetically pleasing user interfaces and experiences, focusing on usability.",
    "Unlock your brand's potential with [ADJ] visual identity design, crafting memorable logos and comprehensive brand guidelines."
];
const WEB_DEVELOPMENT_DESC_TEMPLATES = [
    "A [ADJ] web development service to build your next-generation online platform. From simple sites to complex applications.",
    "Utilize our expertise in [ADJ] web development for scalable, secure, and high-performance web applications tailored to your business needs.",
    "Transform your ideas into reality with [ADJ] custom web development, ensuring seamless user experience and robust backend functionality."
];

const ITEM_TYPES_ECOMMERCE = ["clothing", "electronics", "handmade crafts", "books", "groceries", "digital downloads", "home decor", "sports gear", "jewelry", "beauty products", "furniture", "collectibles", "vintage items", "digital art", "software licenses", "online courses", "event tickets", "streaming subscriptions", "organic produce", "gourmet foods", "pet supplies", "home improvement tools", "fitness equipment", "educational toys", "craft supplies", "musical instruments", "photography gear", "sports apparel", "health supplements", "automotive parts", "garden supplies", "stationery", "luxury goods", "vintage vinyl", "art prints", "board games", "video games", "collectibles", "smart devices", "kitchenware", "camping gear", "audio equipment", "baby products"];
const STORE_TYPES = ["boutique", "superstore", "online shop", "marketplace", "brand store", "specialty retailer", "hypermarket", "concept store", "gallery", "hub", "emporium", "outlet", "co-op", "distributor", "concierge service", "subscription service", "rental service", "platform", "destination", "trading post", "depot", "exchange", "center"];
const NICHE_ECOMMERCE = ["fashion brands", "tech gadgets", "local artisans", "independent authors", "organic food suppliers", "software businesses", "interior decorators", "sports enthusiasts", "unique gift shops", "sustainable fashion", "indie games", "rare books", "artisanal coffee", "pet care products", "smart home devices", "personalized gifts", "eco-friendly products", "vintage fashion", "collectible toys", "wellness products", "DIY kits", "art supplies", "musical instruments", "camera equipment", "sports memorabilia", "gourmet cheeses", "small batch producers", "virtual goods", "digital artists", "home bakers", "craft brewers", "travel gear", "outdoor equipment"];
const FASHION_NICHE = ["apparel", "accessories", "footwear", "jewelry", "designer", "sustainable", "ethical", "vintage", "urban wear", "activewear", "haute couture", "streetwear"];
const SUBSCRIPTION_TYPE = ["curated", "gourmet", "beauty", "crafting", "reading", "gaming", "snack", "coffee", "wine", "pet care", "tech gadget"];
const DIGITAL_PRODUCT_TYPE = ["eBooks", "software", "templates", "fonts", "stock photos", "digital art", "music tracks", "sound effects", "3D models", "online courses", "webinars", "e-tickets", "digital planners"];

const APP_FUNCTIONS = ["task management", "personal finance", "fitness tracking", "language learning", "meditation & mindfulness", "recipe & meal planning", "travel itinerary builder", "budgeting & expense tracking", "habit & goal tracking", "photo & video editing", "social media management", "remote work collaboration", "event discovery", "smart home control", "news aggregation", "podcast player", "sleep tracking", "parenting support", "plant identification", "star gazing", "DIY project guides", "vehicle maintenance", "personal journaling", "virtual fitness classes", "document scanning", "online tutoring", "music creation", "AR shopping", "mental health support", "calorie counting", "journaling", "stock tracking", "cryptocurrency monitoring", "workout planning", "diet logging", "mindfulness exercises", "language exchange", "vocabulary building", "trip expense splitting", "flight tracking", "weather forecasting", "unit conversion", "QR code scanning", "voice recording", "screen recording", "PDF editing", "virtual try-on", "digital art creation", "3D modeling", "coding practice", "interview prep", "story writing", "poetry creation"];
const AREAS = ["productivity", "financial planning", "health & wellness", "education", "personal growth", "communication", "time management", "creativity", "mental wellness", "culinary skills", "linguistic proficiency", "travel experiences", "financial literacy", "team synergy", "event organization", "home automation", "information consumption", "audio entertainment", "sleep quality", "child development", "botany", "astronomy", "home repair", "self-reflection", "physical fitness", "digital organization", "academic success", "musical talent", "shopping experience", "investment management", "digital security", "daily routine", "lifestyle management", "learning journey", "fitness goals", "artistic expression"];
const ACTIVITIES = ["workflow", "daily routine", "learning journey", "health goals", "creative process", "budgeting", "mindful living", "cooking adventures", "language acquisition", "trip planning", "financial management", "habit formation", "visual content creation", "team projects", "event coordination", "home management", "knowledge absorption", "audio enjoyment", "rest & recovery", "child care", "plant care", "astronomical observation", "DIY projects", "journaling", "workout routines", "document management", "online learning", "music production", "retail therapy", "portfolio management", "digital security", "skill development", "self-improvement", "community engagement", "virtual experiences", "gaming sessions", "meal prep"];
const TARGET_USERS = ["professionals", "students", "families", "entrepreneurs", "fitness enthusiasts", "creatives", "travelers", "gamers", "educators", "small business owners", "freelancers", "remote teams", "parents", "seniors", "tech enthusiasts", "book lovers", "music lovers", "foodies", "DIYers", "gardeners", "health-conscious individuals", "investors", "cybersecurity professionals", "designers", "developers", "job seekers", "writers", "photographers", "artists", "musicians", "homeowners", "commuters", "pet owners"];
const BENEFITS_APP = ["enhanced productivity", "financial well-being", "improved health", "new skill acquisition", "creative freedom", "stress reduction", "stronger connections", "better organization", "seamless travel", "smarter home", "informed decisions", "personal growth", "mindfulness", "efficient planning", "effortless learning", "immersive entertainment", "data security", "time savings", "cost reduction", "convenience", "empowerment", "inspiration", "simplification", "clarity", "focus", "discipline", "joy", "peace of mind", "connection", "collaboration", "insight", "control"];
const BENEFIT_VERBS = ["streamline", "optimize", "simplify", "achieve", "master", "monitor", "connect", "learn", "track", "manage", "organize", "create", "discover", "explore", "automate", "enhance", "secure", "personalize", "improve", "boost", "facilitate", "guide", "record", "visualize", "understand", "predict", "communicate", "plan", "design", "build", "analyze", "execute", "transform", "grow"];
const BENEFIT_APP_2 = ["financial clarity", "better sleep", "stress relief", "skill development", "community building", "goal achievement", "personal organization", "creative outlet", "enhanced focus", "time optimization", "seamless communication", "health improvement", "mindful living", "data insights"];

const WEBSITE_TYPES = ["e-commerce store", "corporate site", "personal blog", "online portfolio", "real estate portal", "restaurant website", "educational platform", "fitness studio site", "travel agency site", "event registration page", "SaaS landing page", "non-profit organization website", "medical clinic site", "legal firm website", "financial advisory portal", "automotive dealership site", "art gallery website", "photography showcase", "music artist page", "community forum", "news and media outlet", "job board", "wedding planner site", "construction company site", "interior design studio", "architecture firm site", "coaching business site", "consultancy website", "beauty salon site", "spa and wellness center", "pet services website", "local business directory", "online magazine", "sport club website", "church website", "government portal", "tech startup page", "food blog", "health & wellness blog", "developer portfolio", "artist website", "e-learning portal", "crowdfunding platform", "service booking site", "online directory", "membership site", "fan page", "resume website", "event ticketing platform", "personal branding site"];

const BENEFIT_AI = ["data insights", "content creation", "automated tasks", "decision making", "customer support", "fraud detection", "resource optimization", "personalized recommendations", "natural language understanding", "image analysis", "voice assistance", "intelligent automation", "risk assessment", "market forecasting", "content moderation", "supply chain optimization", "energy management", "medical diagnostics", "legal research", "financial modeling", "predictive maintenance", "sentiment analysis", "trend prediction", "defect detection", "workflow automation", "operational efficiency", "user engagement", "security posture", "compliance automation", "strategic planning", "innovation acceleration"];
const FEATURE1_AI = ["real-time data processing", "advanced neural networks", "conversational AI", "sentiment analysis", "pattern recognition", "generative adversarial networks", "reinforcement learning", "computer vision APIs", "speech-to-text conversion", "predictive modeling", "natural language generation", "deep learning models", "machine learning algorithms", "adaptive learning", "probabilistic reasoning", "graphical models", "expert systems", "fuzzy logic", "evolutionary algorithms", "transfer learning", "edge AI deployment", "federated learning", "explainable AI (XAI)"];
const FEATURE2_AI = ["customizable dashboards", "API integrations", "cloud scalability", "enterprise-grade security", "user-friendly interfaces", "comprehensive reporting", "multi-language support", "on-premise deployment options", "developer-friendly SDKs", "audit trails", "real-time alerts", "AI-powered analytics", "automated workflows", "cross-platform compatibility", "secure data handling", "granular access control", "low-code/no-code interface", "version control", "A/B testing capabilities", "seamless collaboration features", "robust data governance", "cost optimization tools", "24/7 technical support"];
const BENEFIT_DETAIL_AI = ["improving operational efficiency", "enhancing customer satisfaction", "driving revenue growth", "reducing manual errors", "gaining competitive advantage", "fostering innovation", "streamlining workflows", "automating routine tasks", "optimizing resource allocation", "making data-driven decisions", "personalizing user experiences", "securing sensitive data", "predicting market shifts", "minimizing human intervention", "improving decision accuracy", "uncovering hidden patterns", "boosting team productivity", "ensuring regulatory compliance", "forecasting demand accurately", "optimizing pricing strategies", "enhancing product quality", "accelerating time-to-market", "reducing energy consumption"];
const AI_ACTION = ["automate", "predict", "analyze", "generate", "interpret", "optimize", "detect", "recommend", "personalize", "simulate", "forecast", "classify", "transcribe", "synthesize", "understand", "monitor", "diagnose", "resolve", "enhance", "accelerate", "streamline", "identify", "transform", "manage", "process", "secure", "guide", "advise", "evaluate", "plan", "execute"];
const BUSINESS_AREA = ["customer service", "sales & marketing", "finance operations", "human resources", "IT infrastructure", "product development", "supply chain management", "manufacturing processes", "healthcare diagnostics", "legal compliance", "research & development", "logistics", "retail operations", "content creation", "security monitoring", "resource planning", "business intelligence", "market research", "quality assurance", "customer engagement", "risk management", "project management", "inventory control", "fraud prevention", "talent acquisition", "training & development", "data privacy", "network operations", "customer retention", "competitive analysis"];
const PROBLEM_SOLVING = ["complex data analysis", "repetitive tasks", "decision-making under uncertainty", "resource optimization", "fraud detection", "customer churn", "market volatility", "cyber threats", "operational bottlenecks", "medical diagnosis accuracy", "legal document review", "logistical inefficiencies", "inventory management", "personalization at scale", "data security breaches", "manual reporting", "customer query overload", "inefficient resource allocation", "talent gap", "high operational costs", "slow data processing", "inconsistent customer experience", "supply chain disruptions", "regulatory compliance challenges", "missed market opportunities", "poor data quality", "manual risk assessment", "lack of actionable insights"];

// Initial Products (pre-defined)
const INITIAL_PRODUCT_DATA_BASE = [
    {'product_db_key': '1', 'name': 'Modern E-Commerce Platform', 'price': 16.79, 'image': 'https://placehold.co/500x300/3498db/ffffff?text=E-Commerce-Main', 'category': 'e-commerce', 'currency_iso': 'USD', 'long_description': 'A robust and scalable e-commerce solution designed for modern businesses. Features include a secure payment gateway, responsive design for all devices, comprehensive product management, order tracking, and customer accounts. Ideal for startups and growing online stores looking for a professional and user-friendly shopping experience. Integrate effortlessly with popular shipping and marketing tools.',
        'additional_images': [
            'https://placehold.co/500x300/3498db/cccccc?text=E-Commerce+Screen+1',
            'https://placehold.co/500x300/3498db/bbbbbb?text=E-Commerce+Screen+2',
            'https://placehold.co/500x300/3498db/aaaaaa?text=E-Commerce+Screen+3'
        ]},
    {'product_db_key': '2', 'name': 'Creative Portfolio Website', 'price': 7.19, 'image': 'https://placehold.co/500x300/9b59b6/ffffff?text=Portfolio-Main', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Showcase your creative work with stunning visuals and engaging layouts. This template is perfect for photographers, designers, artists, and freelancers. It offers customizable galleries, project pages, and an elegant "About Me" section to highlight your unique skills and achievements. Make a lasting impression on potential clients and employers.',
        'additional_images': [
            'https://placehold.co/500x300/9b59b6/cccccc?text=Portfolio+Shot+1',
            'https://placehold.co/500x300/9b59b6/bbbbbb?text=Portfolio+Shot+2'
        ]},
    {'product_db_key': '3', 'name': 'Corporate Business Portal', 'price': 13.19, 'image': 'https://placehold.co/500x300/2c3e50/ffffff?text=Corporate', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Build a strong online presence for your corporate entity with this sleek and professional website. Designed for businesses of all sizes, it includes sections for services, team profiles, testimonials, and a dedicated news/blog area. Enhance your credibility and communicate effectively with your stakeholders. Fully customizable to reflect your brand identity.'},
    {'product_db_key': '4', 'name': 'Minimalist Blog & News', 'price': 4.19, 'image': 'https://placehold.co/500x300/1abc9c/ffffff?text=Blog', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'A clean, fast, and highly readable blog template focused on content. Ideal for writers, journalists, and content creators who want their stories to stand out without distractions. Features include optimized typography, easy navigation, social sharing integration, and a responsive design that looks great on any device. Start sharing your voice today.'},
    {'product_db_key': '5', 'name': 'Real Estate Listing Portal', 'price': 1499.00, 'image': 'https://placehold.co/500x300/e74c3c/ffffff?text=Real+Estate', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'A comprehensive platform for real estate agents and agencies to list and manage properties. Features include advanced search filters, interactive maps, high-resolution image galleries, virtual tour integration, and agent profiles. Attract more buyers and sellers with a professional and easy-to-use property portal that simplifies the search and listing process.'},
    {'product_db_key': '6', 'name': 'Restaurant & Food Delivery', 'price': 899.00, 'image': 'https://placehold.co/500x300/e67e22/ffffff?text=Restaurant', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Launch your restaurant online with a stunning menu, online ordering, and table reservation system. This template is designed to tantalize customers with beautiful food photography and a seamless user experience. Perfect for cafes, bistros, and full-service restaurants looking to expand their reach and offer convenient digital services.'},
    {'product_db_key': '7', 'name': 'Online Learning Platform (LMS)', 'price': 1999.00, 'image': 'https://placehold.co/500x300/2980b9/ffffff?text=Education', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Empower education with a feature-rich Learning Management System. Create and manage courses, track student progress, conduct quizzes, and issue certificates. Supports various content types including video, audio, and documents. Ideal for educators, institutions, and businesses offering online training. Foster a dynamic learning environment.'},
    {'product_db_key': '8', 'name': 'Fitness & Gym Website', 'price': 799.00, 'image': 'https://placehold.co/500x300/27ae60/ffffff?text=Fitness', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Inspire health and wellness with a dynamic website for your gym, fitness studio, or personal training business. Showcase class schedules, trainer profiles, success stories, and membership options. Includes booking forms and calls-to-action to convert visitors into clients. Get ready to motivate your audience!'},
    {'product_db_key': '9', 'name': 'Travel Agency Portal', 'price': 1199.00, 'image': 'https://placehold.co/500x300/f1c40f/000000?text=Travel', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Ignite wanderlust with a captivating travel agency website. Feature tour packages, destination guides, flight and hotel booking integrations, and customer reviews. Design vivid itineraries and provide essential travel information to help your clients plan their dream getaways with ease and confidence.'},
    {'product_db_key': '10', 'name': 'Event & Conference Page', 'price': 399.00, 'image': 'https://placehold.co/500x300/8e44ad/ffffff?text=Event', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Create buzz for your next event, conference, or festival with a dedicated and informative landing page. Features include speaker profiles, detailed agenda, venue information, ticketing options, and sponsor showcases. Drive registrations and build excitement with a professional and engaging event portal.'},
    {'product_db_key': '11', 'name': 'SaaS Product Landing Page', 'price': 699.00, 'image': 'https://placehold.co/500x300/34495e/ffffff?text=SaaS', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Introduce your SaaS product with a compelling and conversion-optimized landing page. Highlight key features, benefits, pricing plans, and integrate demo requests or sign-up forms. Designed to clearly communicate your value proposition and drive user acquisition for your software as a service offering.'},

    {'product_db_key': '12', 'name': 'Fashion E-Commerce Boutique', 'price': 1850.00, 'image': 'https://placehold.co/500x300/e91e63/ffffff?text=Fashion+Shop', 'category': 'e-commerce', 'currency_iso': 'USD', 'long_description': 'A stylish and highly customizable e-commerce platform tailored for fashion brands and clothing boutiques. Features include visual product configurators, size guides, lookbooks, customer reviews, and advanced filtering options. Perfect for showcasing apparel, accessories, and beauty products with elegance and functionality. Drive sales with a beautiful online presence.',
        'additional_images': [
            'https://placehold.co/500x300/e91e63/cccccc?text=Fashion+Screen+1',
            'https://placehold.co/500x300/e91e63/bbbbbb?text=Fashion+Screen+2'
        ]},
    {'product_db_key': '13', 'name': 'Online Electronics Superstore', 'price': 2200.00, 'image': 'https://placehold.co/500x300/00bcd4/ffffff?text=Electronics+Store', 'category': 'e-commerce', 'currency_iso': 'USD', 'long_description': 'A robust online store solution for consumer electronics, gadgets, and appliances. Equipped with detailed product specifications, comparison tools, customer reviews, and warranty information. Supports extensive product categories and seamless checkout. Ideal for retailers looking to manage a large inventory of tech products efficiently online.',
        'additional_images': [
            'https://placehold.co/500x300/00bcd4/cccccc?text=Electronics+Screen+1',
            'https://placehold.co/500x300/00bcd4/bbbbbb?text=Electronics+Screen+2'
        ]},
    {'product_db_key': '14', 'name': 'Craft & Artisan Marketplace', 'price': 1500.00, 'image': 'https://placehold.co/500x300/ff9800/ffffff?text=Artisan+Market', 'category': 'e-commerce', 'currency_iso': 'USD', 'long_description': 'Create a vibrant online marketplace for handmade goods, art, and unique crafts. This platform allows multiple vendors to list and sell their products, with integrated payment processing, vendor profiles, and review systems. Foster a community of creators and buyers, offering a personalized shopping experience for unique items.',
        'additional_images': [
            'https://placehold.co/500x300/ff9800/cccccc?text=Artisan+Screen+1',
            'https://placehold.co/500x300/ff9800/bbbbbb?text=Artisan+Screen+2'
        ]},
    {'product_db_key': '15', 'name': 'Custom CRM & ERP Integration', 'price': 3500.00, 'image': 'https://placehold.co/500x300/007bff/ffffff?text=CRM+ERP', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'Develop a bespoke Customer Relationship Management (CRM) or Enterprise Resource Planning (ERP) system tailored precisely to your business operations. Seamlessly integrate existing tools, automate workflows, and centralize data for enhanced efficiency and decision-making. Ideal for complex business processes requiring custom solutions.',
        'additional_images': [
            'https://placehold.co/500x300/007bff/cccccc?text=CRM+Screen+1',
            'https://placehold.co/500x300/007bff/bbbbbb?text=ERP+Screen+2'
        ]},
    {'product_db_key': '16', 'name': 'High-Conversion Landing Page Package', 'price': 550.00, 'image': 'https://placehold.co/500x300/ff7f50/ffffff?text=Landing+Page', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'A complete package for designing and developing high-converting landing pages. Optimized for SEO and mobile responsiveness, these pages are crafted to capture leads, promote products, or drive specific actions. Includes A/B testing setup and performance analytics integration to maximize your marketing ROI.'},
    {'product_db_key': '17', 'name': 'Interactive Community Forum', 'price': 1200.00, 'image': 'https://placehold.co/500x300/5e35b1/ffffff?text=Community+Forum', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Build an engaging online community with a custom-built forum platform. Features include user profiles, discussion threads, moderation tools, private messaging, and content tagging. Foster connections, facilitate knowledge sharing, and build loyalty among your users or customers.'},
    {'product_db_key': '18', 'name': 'Advanced Online Ticketing System', 'price': 1800.00, 'image': 'https://placehold.co/500x300/dc3545/ffffff?text=Ticketing+System', 'category': 'e-commerce', 'currency_iso': 'USD', 'long_description': 'A robust and secure online ticketing platform for events, workshops, or attractions. Offers customizable ticket types, seating charts, payment gateway integration, real-time sales tracking, and attendee management. Designed for seamless user experience and efficient event organization.'},
    {'product_db_key': '19', 'name': 'Virtual Event & Webinar Platform', 'price': 2800.00, 'image': 'https://placehold.co/500x300/8e44ad/ffffff?text=Virtual+Event', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'Host engaging virtual events, conferences, and webinars with a dedicated, custom-built platform. Includes live streaming capabilities, interactive Q&A, polling, virtual networking rooms, sponsor booths, and post-event analytics. Deliver a professional and immersive online experience to your global audience.',
        'additional_images': [
            'https://placehold.co/500x300/8e44ad/cccccc?text=Virtual+Event+Screen+1',
            'https://placehold.co/500x300/8e44ad/bbbbbb?text=Virtual+Event+Screen+2'
        ]},
    {'product_db_key': '20', 'name': 'Secure Membership Site Builder', 'price': 950.00, 'image': 'https://placehold.co/500x300/673ab7/ffffff?text=Membership+Site', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Create an exclusive online membership platform with tiered access, secure content delivery, and integrated subscription management. Perfect for selling courses, premium content, or building a subscriber community. Features user registration, login, content restriction, and recurring payment options.'},
    {'product_db_key': '21', 'name': 'Dynamic Job Board Portal', 'price': 1700.00, 'image': 'https://placehold.co/500x300/2c3e50/ffffff?text=Job+Board', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Launch a powerful online job board connecting employers with job seekers. Features include job posting and application management, resume submission, advanced search filters, company profiles, and applicant tracking. A comprehensive solution for recruitment agencies or industry-specific job portals.'},
    {'product_db_key': '22', 'name': 'Online Booking & Appointment System', 'price': 1150.00, 'image': 'https://placehold.co/500x300/27ae60/ffffff?text=Booking+System', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Empower your service-based business with an intuitive online booking and appointment system. Allow clients to view availability, book services, and make payments directly from your website. Features customizable calendars, staff management, automated reminders, and seamless integration with popular CRM tools. Perfect for salons, clinics, consultants, and instructors.',
        'additional_images': [
            'https://placehold.co/500x300/27ae60/cccccc?text=Booking+Screen+1',
            'https://placehold.co/500x300/27ae60/bbbbbb?text=Booking+Screen+2'
        ]},
    {'product_db_key': '23', 'name': 'Professional Consultancy Website', 'price': 850.00, 'image': 'https://placehold.co/500x300/e83e8c/ffffff?text=Consultancy+Site', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Establish a credible and authoritative online presence for your consulting firm or individual practice. This website template focuses on showcasing your expertise, services, client testimonials, and thought leadership through a professional blog. Includes clear calls-to-action for inquiries and appointment scheduling, building trust with potential clients.'},
    {'product_db_key': '24', 'name': 'Non-Profit & Charity Fundraising Platform', 'price': 1600.00, 'image': 'https://placehold.co/500x300/1abc9c/ffffff?text=Non-Profit+Fundraiser', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'A dedicated platform for non-profit organizations to share their mission, showcase impact, and effectively raise funds. Features secure donation processing, campaign management, volunteer sign-up forms, and news sections to keep supporters informed. Designed to inspire generosity and simplify charitable giving.',
        'additional_images': [
            'https://placehold.co/500x300/1abc9c/cccccc?text=Fundraiser+Screen+1',
            'https://placehold.co/500x300/1abc9c/bbbbbb?text=Fundraiser+Screen+2'
        ]},
    {'product_db_key': '25', 'name': 'Interactive Digital Magazine/News Portal', 'price': 2100.00, 'image': 'https://placehold.co/500x300/007bff/ffffff?text=Digital+Magazine', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'Launch your online publication with a dynamic and interactive digital magazine or news portal. Features content categorization, author profiles, ad management, reader comments, and subscription options. Provides a rich multimedia experience with optimized loading times for articles, videos, and image galleries.',
        'additional_images': [
            'https://placehold.co/500x300/007bff/cccccc?text=Magazine+Screen+1',
            'https://placehold.co/500x300/007bff/bbbbbb?text=Magazine+Screen+2'
        ]},
    {'product_db_key': '26', 'name': 'Multi-Vendor Service Marketplace', 'price': 3800.00, 'image': 'https://placehold.co/500x300/ffc107/ffffff?text=Service+Marketplace', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'Create a bustling online marketplace where multiple service providers can list their offerings and connect with clients. Supports service categories, provider profiles, rating and review systems, secure messaging, and integrated booking/payment workflows. Ideal for aggregating local services, freelancing gigs, or professional consultations.',
        'additional_images': [
            'https://placehold.co/500x300/ffc107/cccccc?text=Service+Market+Screen+1',
            'https://placehold.co/500x300/ffc107/bbbbbb?text=Service+Market+Screen+2'
        ]},
    {'product_db_key': '27', 'name': 'Personal Brand & Coaching Website', 'price': 750.00, 'image': 'https://placehold.co/500x300/e83e8c/ffffff?text=Coaching+Site', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Build a compelling online home for coaches, mentors, and personal brands. This website is designed to highlight your unique philosophy, programs, client success stories, and media appearances. Features include online course integration, testimonial sections, and easy contact forms to grow your audience and client base.'},
    {'product_db_key': '28', 'name': 'Podcast Hosting & Showcase Website', 'price': 900.00, 'image': 'https://placehold.co/500x300/6f42c1/ffffff?text=Podcast+Site', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Launch your podcast with a professional website dedicated to showcasing your episodes. Features embedded players, show notes, listener comments, and subscription links to major podcast platforms. Designed for ease of content updates and a seamless listening experience for your audience.'},
    {'product_db_key': '29', 'name': 'Online Art Gallery & Exhibition Site', 'price': 1300.00, 'image': 'https://placehold.co/500x300/fd7e14/ffffff?text=Art+Gallery', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Present art collections and virtual exhibitions with an elegant online gallery website. Features high-resolution image display, artist profiles, artwork details, and visitor engagement tools. Perfect for artists, galleries, and curators to reach a global audience and facilitate art sales or inquiries.'},
    {'product_db_key': '30', 'name': 'Recipe & Culinary Blog', 'price': 600.00, 'image': 'https://placehold.co/500x300/e67e22/ffffff?text=Food+Blog', 'category': 'website', 'currency_iso': 'USD', 'long_description': 'Share your culinary creations and recipes with the world on a beautifully designed food blog. Features recipe cards with nutritional information, search filters by ingredient/cuisine, user ratings, and integrated social sharing. Inspire home cooks and food enthusiasts with your passion.',
        'additional_images': [
            'https://placehold.co/500x300/e67e22/cccccc?text=Recipe+Screen+1',
            'https://placehold.co/500x300/e67e22/bbbbbb?text=Recipe+Screen+2'
        ]},
    {'product_db_key': '31', 'name': 'Small Business Service Directory', 'price': 1900.00, 'image': 'https://placehold.co/500x300/17a2b8/ffffff?text=Business+Directory', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'Build a comprehensive online directory for local businesses or specific industry services. Features business listings with detailed profiles, contact information, service descriptions, reviews, and mapping integration. A valuable resource for communities to find and support local enterprises.'},
    {'product_db_key': '32', 'name': 'Event Management Portal (Advanced)', 'price': 4200.00, 'image': 'https://placehold.co/500x300/8e44ad/ffffff?text=Event+Portal', 'category': 'web development', 'currency_iso': 'USD', 'long_description': 'A full-suite event management portal for organizing, promoting, and executing events of any scale. Includes features for venue management, speaker and agenda planning, attendee registration, badge printing, lead retrieval, and post-event reporting. Integrates with CRM and marketing automation platforms for a streamlined workflow.',
        'additional_images': [
            'https://placehold.co/500x300/8e44ad/cccccc?text=Event+Portal+Screen+1',
            'https://placehold.co/500x300/8e44ad/bbbbbb?text=Event+Portal+Screen+2'
        ]},

    // --- Product modified for testing payment success/failure with a low price ---
    {'product_db_key': '101', 'name': 'AI Customer Service Chatbot (Test Payment)', 'price': 5.00, 'image': 'https://placehold.co/500x300/e67e22/ffffff?text=AI+Chatbot-Main', 'category': 'ai solutions', 'currency_iso': 'INR', 'long_description': 'An advanced AI-powered chatbot to handle customer queries 24/7, improving user engagement and reducing support costs. Integrates easily with any website. It uses natural language processing to understand user intent and provide instant, accurate responses. Capable of escalating complex issues to human agents for seamless support. Enhance your customer experience with smart automation.',
            'additional_images': [
                'https://placehold.co/500x300/e67e22/cccccc?text=Chatbot+UI+1',
                'https://placehold.co/500x300/e67e22/bbbbbb?text=Chatbot+UI+2'
            ]},
    {'product_db_key': '102', 'name': 'Image Recognition API', 'price': 5000.00, 'image': 'https://placehold.co/500x300/e74c3c/ffffff?text=AI+Vision', 'category': 'ai solutions', 'currency_iso': 'INR', 'long_description': 'Empower your applications with cutting-edge image recognition capabilities. This API can detect objects, identify faces, categorize images, and analyze visual content with high accuracy. Ideal for for e-commerce, security, content moderation, and accessibility features. Easy to integrate with existing systems for powerful visual AI.'},
    {'product_db_key': '103', 'name': 'Predictive Analytics Dashboard', 'price': 7500.00, 'image': 'https://placehold.co/500x300/f1c40f/ffffff?text=AI+Analytics', 'category': 'data analytics', 'currency_iso': 'INR', 'long_description': 'Gain a competitive edge with an AI-driven predictive analytics dashboard. Forecast future trends, identify key opportunities, and make data-driven decisions. Visualize complex data through intuitive charts and graphs, allowing you to anticipate customer behavior, optimize operations, and mitigate risks effectively. Turn data into actionable insights.'},
    {'product_db_key': '104', 'name': 'Content Generation Engine', 'price': 4200.00, 'image': 'https://placehold.co/500x300/7f8c8d/ffffff?text=AI+Content', 'category': 'ai solutions', 'currency_iso': 'INR', 'long_description': 'Automate and scale your content creation with this powerful AI engine. Generate high-quality articles, marketing copy, product descriptions, and social media posts in minutes. Customize tone, style, and length to match your brand voice. Ideal for digital marketers, bloggers, and e-commerce businesses looking to streamline their content pipeline.'},
    {'product_db_key': '105', 'name': 'Voice Synthesis & Cloning', 'price': 6800.00, 'image': 'https://placehold.co/500x300/3498db/ffffff?text=AI+Voice', 'category': 'ai solutions', 'currency_iso': 'INR', 'long_description': 'Create lifelike voiceovers and unique synthetic voices with advanced AI voice synthesis and cloning technology. Convert text to speech in multiple languages with natural-sounding intonations. Replicate existing voices for personalized audio content. Perfect for e-learning, audiobooks, virtual assistants, and entertainment industries.'},
    {'product_db_key': '106', 'name': 'AI Code Assistant', 'price': 3500.00, 'image': 'https://placehold.co/500x300/2ecc71/ffffff?text=AI+Code', 'category': 'ai solutions', 'currency_iso': 'INR', 'long_description': 'Accelerate your development workflow with an intelligent AI code assistant. Get real-time code suggestions, error detection, automatic refactoring, and code generation. Supports multiple programming languages and integrates with popular IDEs. Boost productivity and reduce debugging time, allowing developers to focus on innovation.'},
    {'product_db_key': '201', 'name': 'Project Management Suite', 'price': 22.80, 'image': 'https://placehold.co/500x300/2ecc71/ffffff?text=Project+Mgmt', 'category': 'mobile apps', 'currency_iso': 'USD', 'long_description': 'A comprehensive application to manage your projects, tasks, and teams efficiently. Features include Kanban boards, Gantt charts, detailed reporting, time tracking, and collaboration tools. Keep your projects on schedule and within budget with intuitive interfaces and powerful functionalities. Suitable for teams of all sizes and industries.'},
    {'product_db_key': '202', 'name': 'SaaS Starter Kit', 'price': 39.60, 'image': 'https://placehold.co/500x300/3498db/ffffff?text=SaaS+Kit', 'category': 'custom software', 'currency_iso': 'USD', 'long_description': 'Kickstart your Software as a Service (SaaS) application development with this robust starter kit. Includes pre-built user authentication, subscription management, payment integration, and a responsive admin dashboard. Save months of development time and focus on building your core product features. Fully documented and highly customizable.'},
    {'product_db_key': '203', 'name': 'Customer Relationship Manager', 'price': 45.50, 'image': 'https://placehold.co/500x300/e74c3c/ffffff?text=CRM+System', 'category': 'custom software', 'currency_iso': 'USD', 'long_description': 'Streamline your sales and customer service with an intuitive Customer Relationship Manager (CRM). Manage leads, track customer interactions, automate follow-ups, and gain insights into your sales pipeline. Improve customer satisfaction and build stronger relationships with a centralized platform for all your client data.'},

    {'product_db_key': '204', 'name': 'Advanced Task Management App', 'price': 28.00, 'image': 'https://placehold.co/500x300/607d8b/ffffff?text=Task+Manager', 'category': 'mobile apps', 'currency_iso': 'USD', 'long_description': 'An intuitive application to organize your tasks, projects, and collaborate with your team. Features include kanban boards, calendar view, recurring tasks, subtasks, and file attachments. Boost your productivity and keep track of all your responsibilities with ease. Integrates with popular cloud storage services.',
        'additional_images': [
            'https://placehold.co/500x300/607d8b/cccccc?text=Task+App+Screen+1',
            'https://placehold.co/500x300/607d8b/bbbbbb?text=Task+App+Screen+2'
        ]},
    {'product_db_key': '205', 'name': 'Personal Finance Tracker', 'price': 15.00, 'image': 'https://placehold.co/500x300/8bc34a/ffffff?text=Finance+Tracker', 'category': 'mobile apps', 'currency_iso': 'USD', 'long_description': 'Take control of your money with this comprehensive personal finance tracking application. Monitor income and expenses, set budgets, track investments, and generate insightful reports. Categorize transactions, set financial goals, and visualize your spending habits to make smarter financial decisions. Secure and easy to use.',
        'additional_images': [
            'https://placehold.co/500x300/8bc34a/cccccc?text=Finance+App+Screen+1',
            'https://placehold.co/500x300/8bc34a/bbbbbb?text=Finance+App+Screen+2'
        ]},
    {'product_db_key': '206', 'name': 'Health & Fitness Coach App', 'price': 35.00, 'image': 'https://placehold.co/500x300/ff5722/ffffff?text=Fitness+Coach', 'category': 'mobile apps', 'currency_iso': 'USD', 'long_description': 'Your personal companion for a healthier lifestyle. This app helps you track workouts, monitor nutrition, set fitness goals, and record progress. Integrates with wearables to sync data seamlessly. Achieve your health and fitness aspirations with smart tracking.',
        'additional_images': [
            'https://placehold.co/500x300/ff5722/cccccc?text=Fitness+App+Screen+1',
            'https://placehold.co/500x300/ff5722/bbbbbb?text=Fitness+App+Screen+2'
        ]},
    {'product_db_key': '207', 'name': 'Language Learning Companion App', 'price': 49.99, 'image': 'https://placehold.co/500x300/2980b9/ffffff?text=Language+App', 'category': 'education', 'currency_iso': 'USD', 'long_description': 'Master a new language with this interactive learning app. Features include vocabulary builders, grammar lessons, conversational practice, and progress tracking. Supports multiple languages with engaging exercises to make learning fun and effective. Perfect for beginners and advanced learners alike.',
        'additional_images': [
            'https://placehold.co/500x300/2980b9/cccccc?text=Lang+App+Screen+1',
            'https://placehold.co/500x300/2980b9/bbbbbb?text=Lang+App+Screen+2'
        ]},
    {'product_db_key': '208', 'name': 'Mindfulness & Meditation Guide', 'price': 24.99, 'image': 'https://placehold.co/500x300/9b59b6/ffffff?text=Meditation+App', 'category': 'health', 'currency_iso': 'USD', 'long_description': 'Cultivate calm and reduce stress with this guided meditation and mindfulness app. Offers a variety of sessions for sleep, focus, anxiety, and personal growth. Includes soothing sounds, mindful exercises, and daily reminders to support your mental well-being journey. Start your path to inner peace today.'},
    {'product_db_key': '209', 'name': 'Smart Recipe & Meal Planner', 'price': 19.99, 'image': 'https://placehold.co/500x300/e67e22/ffffff?text=Recipe+App', 'category': 'food delivery', 'currency_iso': 'USD', 'long_description': 'Discover, plan, and cook delicious meals with ease. This app features thousands of recipes, customizable meal plans, automatic grocery lists, and smart ingredient suggestions. Filter by dietary needs, cooking time, and cuisine type. Simplify your kitchen life and enjoy healthier eating habits.',
        'additional_images': [
            'https://placehold.co/500x300/e67e22/cccccc?text=Recipe+App+Screen+1',
            'https://placehold.co/500x300/e67e22/bbbbbb?text=Recipe+App+Screen+2'
        ]},
    {'product_db_key': '210', 'name': 'Digital Journal & Mood Tracker', 'price': 12.50, 'image': 'https://placehold.co/500x300/795548/ffffff?text=Journal+App', 'category': 'productivity', 'currency_iso': 'USD', 'long_description': 'Capture your thoughts, track your moods, and reflect on your journey with this intuitive digital journal app. Features customizable prompts, secure entries, trend analysis, and memory prompts. A personal space for self-care and mental clarity, helping you understand your emotional patterns over time.'},
    {'product_db_key': '211', 'name': 'Budgeting & Expense Manager Pro', 'price': 29.99, 'image': 'https://placehold.co/500x300/009688/ffffff?text=Budget+App', 'category': 'finance', 'currency_iso': 'USD', 'long_description': 'Gain complete control over your finances with this advanced budgeting and expense management app. Track multiple accounts, categorize transactions, set spending limits, and visualize your financial health with interactive charts. Features bill reminders, income tracking, and cloud sync for financial peace of mind.',
        'additional_images': [
            'https://placehold.co/500x300/009688/cccccc?text=Budget+App+Screen+1',
            'https://placehold.co/500x300/009688/bbbbbb?text=Budget+App+Screen+2'
        ]},
    {'product_db_key': '212', 'name': 'Interactive Music Creation Studio', 'price': 89.99, 'image': 'https://placehold.co/500x300/9C27B0/ffffff?text=Music+Studio+App', 'category': 'music streaming', 'currency_iso': 'USD', 'long_description': 'Unleash your inner musician with this powerful mobile music creation studio. Compose, record, mix, and master tracks directly on your device. Features a wide range of virtual instruments, loops, effects, and multitrack editing. Perfect for aspiring producers, songwriters, and DJs on the go.',
        'additional_images': [
            'https://placehold.co/500x300/9C27B0/cccccc?text=Music+App+Screen+1',
            'https://placehold.co/500x300/9C27B0/bbbbbb?text=Music+App+Screen+2'
        ]},
    {'product_db_key': '213', 'name': 'Personalized Home Workout Planner', 'price': 39.99, 'image': 'https://placehold.co/500x300/4caf50/ffffff?text=Home+Workout+App', 'category': 'fitness', 'currency_iso': 'USD', 'long_description': 'Achieve your fitness goals from anywhere with this personalized home workout planner. Access a vast library of exercises, create custom routines, and follow guided video workouts. Tracks your progress, adapts to your performance, and provides motivation. No gym equipment needed, just your dedication!',
        'additional_images': [
            'https://placehold.co/500x300/4caf50/cccccc?text=Workout+App+Screen+1',
            'https://placehold.co/500x300/4caf50/bbbbbb?text=Workout+App+Screen+2'
        ]},
];

function generateRandomProducts(numProducts = NUM_NEW_PRODUCTS_TO_ADD) {
    const newProductsList = [];

    for (let i = 0; i < numProducts; i++) {
        const product_db_key = Math.random().toString(36).substring(2) + Date.now().toString(36); // Simple UUID
        const category = weightedRandomChoice(CATEGORIES_FOR_CHOICE, WEIGHTS_FOR_CHOICE);

        let price;
        if (ECOMMERCE_CATEGORIES_SPECIFIC.includes(category) || WEBSITE_CATEGORIES_SPECIFIC.includes(category) || category === 'web development') {
            price = parseFloat((Math.random() * (5500.0 - 500.0) + 500.0).toFixed(2));
        } else if (APP_CATEGORIES_SPECIFIC.includes(category)) {
            price = parseFloat((Math.random() * (600.0 - 20.0) + 20.0).toFixed(2));
        } else if (['ai solutions', 'cybersecurity', 'data analytics', 'cloud services', 'custom software'].includes(category)) {
            price = parseFloat((Math.random() * (12000.0 - 1500.0) + 1500.0).toFixed(2));
        } else if (category === 'consulting') {
            price = parseFloat((Math.random() * (8000.0 - 1000.0) + 1000.0).toFixed(2));
        } else if (category === 'game development') {
            price = parseFloat((Math.random() * (15000.0 - 2000.0) + 2000.0).toFixed(2));
        } else if (category === 'design') {
            price = parseFloat((Math.random() * (2500.0 - 300.0) + 300.0).toFixed(2));
        } else {
            price = parseFloat((Math.random() * (2000.0 - 100.0) + 100.0).toFixed(2));
        }

        const currency_iso = BASE_CURRENCIES[Math.floor(Math.random() * BASE_CURRENCIES.length)];
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        let name_suffix = "";
        let long_description = "A comprehensive solution tailored for modern businesses.";

        if (ECOMMERCE_CATEGORIES_SPECIFIC.includes(category)) {
            name_suffix = `${ITEM_TYPES_ECOMMERCE[Math.floor(Math.random() * ITEM_TYPES_ECOMMERCE.length)].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${STORE_TYPES[Math.floor(Math.random() * STORE_TYPES.length)].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`;
            const desc_template = ECOMMERCE_DESC_TEMPLATES[Math.floor(Math.random() * ECOMMERCE_DESC_TEMPLATES.length)];
            long_description = desc_template
                .replace("[ADJ]", adj)
                .replace("[ITEM_TYPE]", ITEM_TYPES_ECOMMERCE[Math.floor(Math.random() * ITEM_TYPES_ECOMMERCE.length)])
                .replace("[STORE_TYPE]", STORE_TYPES[Math.floor(Math.random() * STORE_TYPES.length)])
                .replace("[NICHE]", NICHE_ECOMMERCE[Math.floor(Math.random() * NICHE_ECOMMERCE.length)])
                .replace("[FASHION_NICHE]", FASHION_NICHE[Math.floor(Math.random() * FASHION_NICHE.length)])
                .replace("[SUBSCRIPTION_TYPE]", SUBSCRIPTION_TYPE[Math.floor(Math.random() * SUBSCRIPTION_TYPE.length)])
                .replace("[DIGITAL_PRODUCT_TYPE]", DIGITAL_PRODUCT_TYPE[Math.floor(Math.random() * DIGITAL_PRODUCT_TYPE.length)]);
        } else if (APP_CATEGORIES_SPECIFIC.includes(category)) {
            name_suffix = `${APP_FUNCTIONS[Math.floor(Math.random() * APP_FUNCTIONS.length)].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} App`;
            const desc_template = APP_DESC_TEMPLATES[Math.floor(Math.random() * APP_DESC_TEMPLATES.length)];
            long_description = desc_template
                .replace("[ADJ]", adj)
                .replace("[APP_FUNCTION]", APP_FUNCTIONS[Math.floor(Math.random() * APP_FUNCTIONS.length)])
                .replace("[AREA]", AREAS[Math.floor(Math.random() * AREAS.length)])
                .replace("[ACTIVITY]", ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)])
                .replace("[TARGET_USER]", TARGET_USERS[Math.floor(Math.random() * TARGET_USERS.length)])
                .replace("[BENEFIT]", BENEFITS_APP[Math.floor(Math.random() * BENEFITS_APP.length)])
                .replace("[BENEFIT_VERB]", BENEFIT_VERBS[Math.floor(Math.random() * BENEFIT_VERBS.length)])
                .replace("[BENEFIT_APP_2]", BENEFIT_APP_2[Math.floor(Math.random() * BENEFIT_APP_2.length)]);
        } else if (category === 'ai solutions') {
            name_suffix = `AI ${['Assistant', 'Predictor', 'Generator', 'Analyzer', 'Optimizer', 'Automation Platform', 'Intelligence Suite', 'Vision System', 'Language Model'][Math.floor(Math.random() * 9)]}`;
            const desc_template = AI_DESC_TEMPLATES[Math.floor(Math.random() * AI_DESC_TEMPLATES.length)];
            long_description = desc_template
                .replace("[ADJ]", adj)
                .replace("[BENEFIT_AI]", BENEFIT_AI[Math.floor(Math.random() * BENEFIT_AI.length)])
                .replace("[FEATURE1_AI]", FEATURE1_AI[Math.floor(Math.random() * FEATURE1_AI.length)])
                .replace("[FEATURE2_AI]", FEATURE2_AI[Math.floor(Math.random() * FEATURE2_AI.length)])
                .replace("[BENEFIT_DETAIL_AI]", BENEFIT_DETAIL_AI[Math.floor(Math.random() * BENEFIT_DETAIL_AI.length)])
                .replace("[AI_ACTION]", AI_ACTION[Math.floor(Math.random() * AI_ACTION.length)])
                .replace("[BUSINESS_AREA]", BUSINESS_AREA[Math.floor(Math.random() * BUSINESS_AREA.length)])
                .replace("[PROBLEM_SOLVING]", PROBLEM_SOLVING[Math.floor(Math.random() * PROBLEM_SOLVING.length)]);
        } else if (category === 'cybersecurity') {
            name_suffix = `Cybersecurity ${['Audit', 'Suite', 'Consultation', 'Platform', 'Protection Service', 'Threat Intelligence'][Math.floor(Math.random() * 6)]}`;
            long_description = CYBERSECURITY_DESC_TEMPLATES[Math.floor(Math.random() * CYBERSECURITY_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'data analytics') {
            name_suffix = `Data Analytics ${['Suite', 'Dashboard', 'Service', 'Platform', 'Insights Tool', 'BI Solution'][Math.floor(Math.random() * 6)]}`;
            long_description = DATA_ANALYTICS_DESC_TEMPLATES[Math.floor(Math.random() * DATA_ANALYTICS_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'cloud services') {
            name_suffix = `Cloud Services ${['Platform', 'Management', 'Infrastructure', 'Migration Service', 'Hosting Solution'][Math.floor(Math.random() * 5)]}`;
            long_description = CLOUD_SERVICES_DESC_TEMPLATES[Math.floor(Math.random() * CLOUD_SERVICES_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'consulting') {
            name_suffix = `IT Consulting ${['Service', 'Package', 'Strategy', 'Advisory', 'Transformation Program'][Math.floor(Math.random() * 5)]}`;
            long_description = CONSULTING_DESC_TEMPLATES[Math.floor(Math.random() * CONSULTING_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'custom software') {
            name_suffix = `Custom Software ${['Development', 'Solution', 'Application', 'System Integration'][Math.floor(Math.random() * 4)]}`;
            long_description = CUSTOM_SOFTWARE_DESC_TEMPLATES[Math.floor(Math.random() * CUSTOM_SOFTWARE_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'game development') {
            name_suffix = `Game Development ${['Service', 'Studio', 'Solution', 'Engine', 'Design Package'][Math.floor(Math.random() * 5)]}`;
            long_description = GAME_DEVELOPMENT_DESC_TEMPLATES[Math.floor(Math.random() * GAME_DEVELOPMENT_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'design') {
            name_suffix = `Design ${['Service', 'Package', 'Studio', 'Branding Kit', 'UI/UX Solution'][Math.floor(Math.random() * 5)]}`;
            long_description = DESIGN_DESC_TEMPLATES[Math.floor(Math.random() * DESIGN_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else if (category === 'web development') {
            name_suffix = `Web Development ${['Service', 'Platform', 'Solution', 'Custom Build'][Math.floor(Math.random() * 4)]}`;
            long_description = WEB_DEVELOPMENT_DESC_TEMPLATES[Math.floor(Math.random() * WEB_DEVELOPMENT_DESC_TEMPLATES.length)].replace("[ADJ]", adj);
        } else { // Default for other general website categories
            name_suffix = `${WEBSITE_TYPES[Math.floor(Math.random() * WEBSITE_TYPES.length)].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Website`;
            const desc_template = WEBSITE_DESC_TEMPLATES[Math.floor(Math.random() * WEBSITE_DESC_TEMPLATES.length)];
            long_description = desc_template
                .replace("[ADJ]", adj)
                .replace("[WEBSITE_TYPE]", WEBSITE_TYPES[Math.floor(Math.random() * WEBSITE_TYPES.length)]);
        }

        const name = `${adj} ${name_suffix}`;

        const image_color_hex = (CATEGORY_COLORS[category.toLowerCase()] || '6c757d').replace('#', '');
        const image = `https://placehold.co/500x300/${image_color_hex}/ffffff?text=${category.replace(/ /g, '+').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('+')}`;

        const additional_images = [];
        for (let j = 0; j < Math.floor(Math.random() * 3); j++) { // 0 to 2 additional images
            const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            additional_images.push(`https://placehold.co/500x300/${randomColor}/eeeeee?text=${category.replace(/ /g, '+').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('+')}+Screen+${j+1}`);
        }

        newProductsList.push({
            product_db_key: product_db_key,
            name: name,
            price: price,
            image: image,
            category: category,
            category_color: CATEGORY_COLORS[category.toLowerCase()] || '#6c757d', // Get color
            currency_iso: currency_iso,
            long_description: long_description,
            additional_images: additional_images
        });
    }
    return newProductsList;
}

// Combine initial products with randomly generated ones
const ALL_PRODUCTS_DATA = INITIAL_PRODUCT_DATA_BASE.concat(generateRandomProducts(NUM_NEW_PRODUCTS_TO_ADD));

// Create a productsData map for quick lookup by product_db_key
const productsData = {};
ALL_PRODUCTS_DATA.forEach(p => {
    productsData[p.product_db_key] = p;
});

// Group products by the main categories used in the HTML sections
const productsByCategory = {
    websites: [],
    ai: [],
    apps: []
};

ALL_PRODUCTS_DATA.forEach(product => {
    const lowerCategory = product.category.toLowerCase();
    if (WEBSITE_CATEGORIES_SPECIFIC.includes(lowerCategory) || lowerCategory === 'web development' || lowerCategory === 'e-commerce' || lowerCategory === 'retail' || lowerCategory === 'marketplace') {
        productsByCategory.websites.push(product);
    } else if (AI_CATEGORIES_SPECIFIC.includes(lowerCategory) || lowerCategory === 'ai') {
        productsByCategory.ai.push(product);
    } else if (APP_CATEGORIES_SPECIFIC.includes(lowerCategory) || lowerCategory === 'mobile apps') {
        productsByCategory.apps.push(product);
    }
    // For categories not explicitly matched, they won't appear in these sections
});

// --- Page Load & On-Scroll Animation Scripts (window.load for things that need all assets) ---
window.addEventListener('load', () => {
    const logoContainer = document.querySelector('.logo');
    const heroSection = document.querySelector('.hero-section');
    if (logoContainer) { setTimeout(() => { logoContainer.classList.add('animate'); }, 100); } // FASTER
    if (heroSection) { setTimeout(() => { heroSection.classList.add('animate-in'); }, 100); } // FASTER
});


// --- DOM Manipulation and Event Listeners (wrapped in a single DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    const renderProducts = (products, targetGridId) => { // Removed isHorizontalScroll param as it's not used in this function
        const gridElement = document.getElementById(targetGridId);
        if (!gridElement) return;

        products.forEach(product => {
            const productCardOuter = document.createElement('div');
            productCardOuter.classList.add('product-card-outer', 'animate-on-scroll');
            
            // Simple placeholder URL for product detail in static HTML
            const productDetailUrl = `#product-detail-${product.product_db_key}`; 

            productCardOuter.innerHTML = `
                <a href="${productDetailUrl}" class="product-card-content-link" aria-label="View details for ${product.name}">
                    <div class="product-card" data-product-id="${product.product_db_key}">
                        <div class="product-card-header" style="background-color: ${product.category_color || '#6c757d'};" aria-label="Category: ${product.category}">
                            <span class="category-text">${product.category.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                        </div>
                        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                        <div class="card-body">
                            <h3 class="product-name-heading">${product.name}</h3>
                            <p class="long-description-summary">${product.long_description.substring(0, 100)}...</p>
                            <div class="price">
                                ${product.price.toFixed(2)} ${product.currency_iso}
                            </div>
                        </div>
                    </div>
                </a>
                <div class="card-actions">
                    <button class="add-to-cart-btn" data-product-id="${product.product_db_key}">Add to Cart</button>
                </div>
                <div class="share-container">
                    <button class="universal-share-btn"
                            data-title="${product.name}"
                            data-text="${product.name} - Discover it on Nexaur!"
                            data-url="${productDetailUrl}">
                        <i class="fas fa-share-alt" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            gridElement.appendChild(productCardOuter);
        });
    };

    renderProducts(productsByCategory.websites, 'websites-grid'); // No need for isHorizontalScroll here
    renderProducts(productsByCategory.ai, 'ai-grid');
    renderProducts(productsByCategory.apps, 'apps-grid');

    // --- Horizontal Scroll Buttons Logic ---
    const sections = ['websites']; // IDs of horizontal scroll product sections
    sections.forEach(sectionId => {
        const gridElement = document.getElementById(`${sectionId}-grid`);
        if (gridElement) {
            const wrapper = gridElement.closest('.horizontal-scroll-wrapper');
            if (wrapper) {
                const prevButton = wrapper.querySelector('.scroll-button-prev');
                const nextButton = wrapper.querySelector('.scroll-button-next');

                if (gridElement && prevButton && nextButton) {
                    const firstCard = gridElement.querySelector('.product-card-outer');
                    if (firstCard) {
                        const scrollAmount = firstCard.offsetWidth + 30; // Card width + gap (1.5rem = 24px, adjusted for consistency)

                        nextButton.addEventListener('click', () => {
                            gridElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        });
                        prevButton.addEventListener('click', () => {
                            gridElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                        });
                    }
                }
            }
        }
    });

    console.log(`Total products generated and prepared: ${ALL_PRODUCTS_DATA.length}`);
    console.log(`Websites displayed: ${productsByCategory.websites.length}`);
    console.log(`AI Solutions displayed: ${productsByCategory.ai.length}`);
    console.log(`Applications displayed: ${productsByCategory.apps.length}`);

    // --- On-Scroll Animation Logic ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
    scrollElements.forEach(el => { elementObserver.observe(el); });

    // --- Chatbox / Voice Search Logic (Simplified/Stubbed for static HTML) ---
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('shivayChatInput');
    const chatBody = document.getElementById('chatBody');
    const sendChatMsgBtn = document.getElementById('sendChatMsgBtn');
    const mainVoiceSearchBtn = document.getElementById('mainVoiceSearchBtn');

    // Global functions (needed due to onclick attributes in HTML)
    window.handleStartButtonClick = function() {
        if (chatBox) {
            const isVisible = chatBox.classList.toggle('visible'); // Toggle 'visible' class
            if (isVisible) {
                document.getElementById('chatOpenSound').play().catch(e => console.log('Audio playback blocked:', e));
            }
        }
    };

    window.closeChat = function() {
        if (chatBox) {
            chatBox.classList.remove('visible');
        }
    };

    window.toggleChatMic = function(iconElement) {
        iconElement.classList.toggle('active');
        document.getElementById('micToggleSound').play().catch(e => console.log('Audio playback blocked:', e));
        alert('Voice input is not implemented in this static HTML file.');
    };

    if (chatInput) {
        chatInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendChatMsgBtn.click();
            }
        });
    }

    if (sendChatMsgBtn) {
        sendChatMsgBtn.addEventListener('click', function() {
            const message = chatInput.value.trim();

            if (message) {
                const userMessageDiv = document.createElement('div');
                userMessageDiv.classList.add('message', 'user'); // Changed class name to 'message'
                userMessageDiv.textContent = message; // Using textContent for security/simplicity
                chatBody.appendChild(userMessageDiv);
                chatInput.value = '';
                document.getElementById('messageSendSound').play().catch(e => console.log('Audio playback blocked:', e));
                chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom

                // Simulate AI response
                setTimeout(() => {
                    const aiMessageDiv = document.createElement('div');
                    aiMessageDiv.classList.add('message', 'ai'); // Changed class name to 'message'
                    aiMessageDiv.textContent = `Thank you for your message! As a static HTML file, I can't process it, but I'm here to assist.`;
                    chatBody.appendChild(aiMessageDiv);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        });
    }

    if (mainVoiceSearchBtn) {
        mainVoiceSearchBtn.addEventListener('click', function() {
            alert('Voice search is not implemented in this static HTML file.');
        });
    }
    // End Chatbox / Voice Search Stub

    // --- ADD TO CART SCRIPT (Stubbed for static HTML) ---
    const flashMessagesContainer = document.getElementById('flashMessagesContainer');

    const showFlashMessage = (message, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('flash-message', type);
        msgDiv.textContent = message;
        flashMessagesContainer.appendChild(msgDiv);
        setTimeout(() => {
            msgDiv.remove();
        }, 5000);
    };

    // Initial cart count is always 0 in static HTML
    const updateCartCount = (count) => {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    };
    updateCartCount(0); // Initialize cart count to 0

    // Event delegation for Add to Cart buttons and Share buttons
    document.querySelectorAll('.product-grid').forEach(grid => {
        grid.addEventListener('click', async (event) => { // Made async for navigator.share
            // Handle Add to Cart
            if (event.target.classList.contains('add-to-cart-btn')) {
                const button = event.target;
                const productDbKey = button.dataset.productId;
                if (!productDbKey) {
                    console.error('Product DB Key not found on add-to-cart button.');
                    return;
                }

                let originalText = button.textContent;

                button.disabled = true;
                button.textContent = 'Adding...';
                button.classList.add('adding');

                // Simulate an async operation
                setTimeout(() => {
                    button.classList.remove('adding');
                    // Always simulate success in static HTML
                    updateCartCount(parseInt(document.querySelector('.cart-count').textContent) + 1); // Increment cart count
                    button.classList.add('added');
                    button.textContent = 'Added!';
                    
                    // Use the productsData map to get the product name
                    if (productsData[productDbKey]) {
                        showFlashMessage(`"${productsData[productDbKey].name}" added to cart!`, 'success');
                    } else {
                        showFlashMessage(`Product added to cart!`, 'success'); // Fallback
                    }
                    
                    setTimeout(() => {
                        button.classList.remove('added');
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 1500);

                }, 800); // Simulate network delay
            }

            // Handle Universal Share
            if (event.target.closest('.universal-share-btn')) {
                const button = event.target.closest('.universal-share-btn');
                const title = button.dataset.title;
                const text = button.dataset.text;
                const url = window.location.href; // Use current page URL for sharing, since product_detail links are not real in static HTML

                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: title,
                            text: text,
                            url: url
                        });
                        console.log('Content shared successfully');
                    } catch (error) {
                        if (error.name !== 'AbortError') { // User cancelled share dialog
                            console.error('Error sharing content:', error);
                            showFlashMessage('Could not share. Please try again.', 'danger');
                        }
                    }
                } else {
                    // Fallback for browsers that do not support the Web Share API
                    try {
                        await navigator.clipboard.writeText(url);
                        showFlashMessage('Link copied to clipboard!', 'info');
                        console.log('URL copied to clipboard:', url);
                    } catch (err) {
                        console.error('Failed to copy to clipboard: ', err);
                        showFlashMessage('Could not copy link to clipboard. Please copy it manually: ' + url, 'danger');
                    }
                }
            }
        });
    });
    // End ADD TO CART & SHARE STUB
});
