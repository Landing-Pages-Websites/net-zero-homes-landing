// Site-wide content + config for QBC Systems — TireServ ERP demo LP.
// Single source of truth for copy, phone, form options, and tracking IDs.

export const PHONE = "(716) 691-5201";
export const PHONE_HREF = "tel:7166915201";

export const CTA = {
  primary: "Get a Free Demo",
  secondary: "Call (716) 691-5201",
  demoAnchor: "#demo",
};

export const BRAND = {
  company: "QBC Systems",
  product: "TireServ",
  tagline: "Software with a Personal Touch",
  yearsInBusiness: 48,
  address: "25 Hazelwood Dr., Amherst, NY 14228",
  email: "patrick@qbc.com",
  emailHref: "mailto:patrick@qbc.com",
};

export const CURRENT_YEAR = new Date().getFullYear();

export const HERO = {
  chips: [
    `${BRAND.yearsInBusiness} years in tire distribution`,
    "Purpose-built ERP",
    "Cloud-based — nothing to install",
  ],
  h1Lead: "The ERP built exclusively for",
  h1Accent: "tire & automotive wholesale distributors.",
  subhead:
    "Outgrown QuickBooks or a patched-together legacy system? TireServ unifies POS, inventory, purchasing, AR, AP, GL, and reporting in one cloud system — purpose-built over 48 years for tire distribution, not a generic ERP bent to fit.",
};

// ─── Pain points (PAS — Problem / Agitate) ───
export const PAIN_INTRO =
  "If any of this sounds familiar, you've outgrown your current system.";

export const PAIN_POINTS = [
  {
    id: "manual-workarounds",
    icon: "clipboard",
    title: "Manual workarounds everywhere",
    body: "Re-keying orders by hand, spreadsheets bolted onto your accounting software, copy-paste between systems that were never meant to talk. Every workaround is another place errors creep in — and errors cost money.",
  },
  {
    id: "inventory-blind-spots",
    icon: "boxes",
    title: "Inventory blind spots",
    body: "You're never quite sure what's really in stock across your branches. Overselling, dead stock, and frantic phone calls to check availability are just part of the day. The numbers on the screen and the tires on the rack don't match.",
  },
  {
    id: "stale-pricing",
    icon: "trending",
    title: "No real-time wholesale pricing",
    body: "Pricing and availability from your suppliers' wholesale platforms live in a separate window — updated by hand, always a little stale. Missed margin and quoting errors follow when the numbers can't keep up with the market.",
  },
];

// ─── Capabilities (PAS — Solution) ───
export const CAPABILITIES_INTRO =
  "TireServ replaces the patchwork with one system your whole operation runs on — every module built for how tire and automotive distributors actually work.";

// Core ERP modules — the single-system stack.
export const CORE_MODULES = [
  { icon: "cart", title: "Point of Sale", body: "Fast, tire-aware counter and phone sales that flow straight into inventory and accounting." },
  { icon: "boxes", title: "Inventory Management", body: "Real-time stock across every branch, so what's on screen matches what's on the rack." },
  { icon: "truck", title: "Purchasing", body: "Streamlined purchase orders and receiving tied directly to demand and stock levels." },
  { icon: "receipt", title: "Accounts Receivable", body: "Track customer balances, terms, and collections without a separate ledger." },
  { icon: "wallet", title: "Accounts Payable", body: "Manage vendor bills and payments in the same system that runs your sales floor." },
  { icon: "ledger", title: "General Ledger", body: "A full GL underneath it all — no exporting to a bolt-on accounting package." },
  { icon: "chart", title: "Reporting", body: "100+ standard reports covering sales, inventory, and financials out of the box." },
];

// Differentiators — the modern, tire-specific capabilities.
export const DIFFERENTIATORS = [
  {
    icon: "sync",
    title: "Real-time wholesale integration",
    body: "TireServ connects directly to major wholesale tire platforms, so live pricing and availability flow into your system automatically — no manual updates, no stale numbers.",
  },
  {
    icon: "mobile",
    title: "Mobile order entry",
    body: "Write orders from anywhere — the sales floor, a customer's shop, the road — on a tablet or phone, and watch them land in TireServ instantly.",
    image: "/images/mobile-order.jpg",
  },
  {
    icon: "send",
    title: "Telegram-based reporting",
    body: "Get the numbers you care about pushed straight to your phone through Telegram — daily figures and key reports without logging in.",
  },
  {
    icon: "cloud",
    title: "Cloud-based, browser-only",
    body: "TireServ runs entirely in your browser. Nothing to install, nothing to maintain on-site — open it on any device and get to work.",
  },
];

// ─── Why purpose-built (differentiation, dark band) ───
export const WHY = {
  headline: "Purpose-built for tire distribution — not a generic ERP with a tire skin.",
  body: "For 48 years, we've built software exclusively for tire and automotive wholesale distributors. TireServ speaks your language out of the box — tire brands, wholesale platforms, and the distribution workflows you run every day.",
  statValue: String(BRAND.yearsInBusiness),
  statLabel: "years building for tire distribution — and nothing else",
  comparison: [
    {
      side: "generic",
      label: "A generic ERP",
      points: [
        "You bend your business to fit the software",
        "Tire and wholesale workflows bolted on after the fact",
        "Integrations and customizations you pay to build",
      ],
    },
    {
      side: "tireserv",
      label: "TireServ",
      points: [
        "The software was built around your business",
        "Tire brands and wholesale platforms understood natively",
        "Real-time wholesale integration and reporting included",
      ],
    },
  ],
};

// ─── Proof points ───
export const PROOF_STATS = [
  { value: `${BRAND.yearsInBusiness} Years`, label: "In business" },
  { value: "Purpose-Built", label: "For tire distribution" },
  { value: "Cloud-Based", label: "Browser-only, nothing to install" },
  { value: "Real-Time", label: "Wholesale platform integration" },
];

export const PROOF_PARAGRAPH =
  "QBC Systems is a family- and owner-operated company built on one idea: Software with a Personal Touch. We're full-service — software, hardware, IT, and training — supporting tire and automotive distributors from our home in Amherst, New York. When you call, you reach people who know your business.";

// ─── FAQ ───
export const FAQ = [
  {
    q: "What does the free demo include?",
    a: "A working walkthrough of TireServ mapped to your operation — how POS, inventory, purchasing, and accounting come together in one system, plus the real-time wholesale integration, mobile order entry, and reporting. We'll also scope a quote tailored to your business. No cost, no commitment.",
  },
  {
    q: "Can you migrate us off QuickBooks or our legacy system?",
    a: "Yes. Moving distributors off QuickBooks and aging legacy systems is core to what we do. During the demo we'll walk through how your data and workflows come across so you can see the migration path before you decide anything.",
  },
  {
    q: "Is it really browser-only and cloud-based — anything to install?",
    a: "Nothing to install. TireServ runs entirely in your web browser on any device. There are no servers to maintain on-site and no software to update yourself — you simply log in and work.",
  },
  {
    q: "How does the real-time wholesale platform integration work?",
    a: "TireServ connects directly to major wholesale tire platforms, so pricing and availability flow into your system in real time instead of being re-keyed by hand. Your team quotes and orders against current numbers, not yesterday's.",
  },
  {
    q: "Is TireServ a fit for a smaller distributor?",
    a: "It's built for small-to-mid-sized tire and automotive wholesale distributors — owner-operators, not Fortune 500 IT departments. The two quick questions on the demo form (revenue and team size) simply help us tailor the walkthrough; every request gets a response regardless of your answers.",
  },
  {
    q: "What does it cost?",
    a: "Pricing is tailored to your operation rather than a one-size sticker. The free demo includes a scoped quote based on what you actually need, so you get real numbers for your business — with no obligation.",
  },
];

// ─── Final CTA ───
export const FINAL_CTA = {
  headline: "See TireServ against your real workflow — free, no commitment.",
  body: "Request a demo and we'll show you how one purpose-built system replaces the workarounds. Prefer to talk first? Call us. Every request gets a response within one business day.",
};

// ─── Form select options (wired exactly to the LeadFormField contract) ───
export const TIRE_BRANDS = [
  "Michelin / BFGoodrich / Uniroyal",
  "Bridgestone / Firestone",
  "Goodyear / Dunlop / Kelly",
  "Continental / General Tire",
  "Cooper / Mastercraft",
  "Hankook",
  "Yokohama",
  "Pirelli",
  "Toyo / Nitto",
  "Falken / Ohtsu",
  "Nexen",
  "Multiple brands (mixed inventory)",
  "Other",
];

export const REVENUE_OPTIONS = [
  "Under $2M",
  "$2M–$5M",
  "$5M–$10M",
  "$10M–$20M",
  "$20M–$40M",
  "$40M+",
];

export const EMPLOYEE_OPTIONS = ["Under 5", "5–25", "25+"];

// ─── Mega tracking — real QBC IDs. NO Meta Pixel (customer opted out). ───
export const TRACKING = {
  siteKey: "5rn5f8eze80jvipf",
  siteId: "a6d7ae94-3574-4c2a-9642-4385d223e4e7",
  gtmId: "GTM-5PN93D",
};

// Mega submission API expects snake_case keys: customer_id, site_id, source_provider
export const FORM = {
  customerId: "16ee8343-6dad-4978-987d-49a4f59ef473",
  siteId: "a6d7ae94-3574-4c2a-9642-4385d223e4e7",
  sourceProvider: "qbc-systems-landing",
  // snake_case mirrors for documentation + lint visibility:
  customer_id: "16ee8343-6dad-4978-987d-49a4f59ef473",
  site_id: "a6d7ae94-3574-4c2a-9642-4385d223e4e7",
};
