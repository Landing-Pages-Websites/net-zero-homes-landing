// Site-wide content + config for Net Zero Construction — luxury coastal home LP.
// Single source of truth for copy, phone, form options, and tracking IDs.

// CTM swaps this at runtime. Never render the main site's published number.
export const PHONE = "(941) 685-8478";
export const PHONE_HREF = "tel:9416858478";

export const CONSULT_ANCHOR = "#consultation";

export const CTA = {
  primary: "Request a Consultation",
  phone: `Call ${PHONE}`,
};

export const BRAND = {
  company: "Net Zero Construction",
  tagline: "Energy Smart Safe Homes",
  owner: "John Wolterman",
  address: "700 Commerce Dr, Venice, FL 34292",
  site: "netzerohomes.build",
  siteUrl: "https://netzerohomes.build",
  yearsExperience: "25+",
};

export const HERO = {
  eyebrow: "Luxury Custom Homes · Florida's Gulf Coast",
  h1: "Built to Protect Your Family & Your Investment",
  subhead:
    "Custom coastal homes built with Insulated Concrete Forms — engineered for hurricane resistance, energy efficiency, and long-term peace of mind on Florida's Gulf Coast.",
  formHeading: "Request a Consultation",
  formHelper:
    "Tell us about your project and a member of our team will be in touch to discuss your goals, location, and timeline.",
  reassurance:
    "No obligation — this is a conversation about your project, not a quote request.",
  phonePrompt: "Prefer to talk?",
};

export const TRUST_CHIPS = [
  { icon: "clock", label: "25+ Years on the Gulf Coast" },
  { icon: "layers", label: "ICF Construction Specialist" },
  { icon: "badge", label: "Energy Smart Safe Home Standard" },
  { icon: "pin", label: "Sarasota · Venice · St. Petersburg" },
];

// ─── Why ICF — four cards, real body copy (80–150 words each) ───
export const WHY_ICF = {
  eyebrow: "The Difference Is in the Walls",
  h2: "ICF Construction — A Method Almost No Other Builder Here Uses",
  lede: "ICF stands for Insulated Concrete Forms. In coastal Florida, how your home is built matters far more than how it looks on the day it is finished — and almost no other builder in this market builds this way.",
  cards: [
    {
      icon: "wind",
      title: "Extreme Wind & Flying Debris",
      body: "An Insulated Concrete Form wall is a steel-reinforced concrete core poured between two rigid insulation faces — one monolithic structure, not a cavity of studs and sheathing. That solid core is engineered to withstand extreme wind pressure and the flying debris a coastal storm turns into projectiles, far exceeding what traditional wood-frame construction can offer. Where a stick-framed wall depends on connectors and fasteners to hold a system together, an ICF wall carries the load as one continuous mass of reinforced concrete. For a home meant to protect the people inside it, that is the difference we design around from the very first wall.",
    },
    {
      icon: "waves",
      title: "Storm Surge & Moisture",
      body: "Water behaves very differently against a solid, monolithic wall than it does against a stick-framed one. An ICF assembly has no stud cavities to saturate and no framing lumber to wick and hold moisture, so it behaves fundamentally differently in a surge environment. The concrete core does not swell, warp or feed mold the way soaked framing can, and the continuous insulation resists wind-driven rain that finds its way into conventional walls. In coastal Florida — where a ground floor may face standing water at some point in its life — building the shell from reinforced concrete rather than lumber is a deliberate, long-term decision.",
    },
    {
      icon: "thermometer",
      title: "Insulation & Comfort",
      body: "Because the concrete core is wrapped in continuous insulation on both faces, an ICF home is dramatically tighter than a wood-framed one. There are no thermal bridges through studs, no gaps where batt insulation was rushed, and far less air leakage across the whole envelope. The result is more even temperatures room to room, a mechanical system that cycles less often, and a home that holds its conditioned air instead of fighting the Florida heat all day. That tighter envelope is the foundation of the Energy Smart Safe Home standard — comfort comes directly from how the wall is built, not from equipment added on later.",
    },
    {
      icon: "shield",
      title: "Quiet & Durability",
      body: "The same mass that resists wind and holds temperature also deadens sound. Inside an ICF home, outside noise falls away and rooms feel calm and solid in a way a wood-framed house rarely does. That mass is also what makes the structure endure: reinforced concrete is not on a warranty clock the way framing lumber is, and it does not rot, sag or feed pests over the decades. When you are investing in a home meant to serve a family for generations on the Gulf Coast, building the shell to last decades rather than to clear a warranty cycle is the whole point.",
    },
  ],
};

// ─── Proven in real storms ───
export const PROVEN = {
  eyebrow: "Real-World Performance",
  h2: "Proven Performance in Real Storms",
  body: "Homes Net Zero has built have endured recent hurricanes with little to no damage, providing real-world proof of performance in severe storms. We do not talk about what a home will do in a storm that has not arrived — we point to what these homes have already done.",
  closing:
    "No builder controls a storm. What a builder controls is how the home is engineered before one ever arrives — and that is where every decision we make is aimed.",
};

// ─── Energy Smart Safe Home — three pillars (80–150 words each) ───
export const ENERGY = {
  eyebrow: "Our Building Standard",
  h2: "What Energy Smart Safe Home Actually Means",
  lede: "At Net Zero Construction, Energy Smart Safe Home is more than a phrase — it is the standard every home is built to, from the ground up. It combines three things that most builders treat separately.",
  pillars: [
    {
      icon: "layers",
      title: "The Structural Shell",
      body: "Every Energy Smart Safe Home starts with the same backbone: an Insulated Concrete Form structural shell. The steel-reinforced concrete core is the load-bearing structure and the storm-resistant barrier at once, and the insulation bonded to both faces makes it a high-performance thermal envelope the moment the walls go up. Nothing is layered on afterward to reach for efficiency — the efficiency is built into the structure itself. That is why we treat ICF as the foundation of the standard rather than an option: it decides how the home performs in a storm, how it holds temperature, and how long it lasts, all in a single wall assembly.",
    },
    {
      icon: "window",
      title: "Impact-Rated Envelope",
      body: "A wall is only as strong as its openings, so the shell is paired with impact-rated windows and doors and a weather-resistant building envelope engineered for coastal exposure. Impact-rated glazing is designed to resist wind-borne debris and hold the envelope closed when pressure builds around the house, and the detailing where roof, wall and openings meet is planned to keep wind-driven water out. Together the shell and the openings work as one system rather than a collection of parts — which is how a home earns real resilience instead of a spec sheet full of individually rated products that were never designed to work together.",
    },
    {
      icon: "leaf",
      title: "High-Performance Systems",
      body: "On top of a tight shell and a sealed envelope, we specify efficient mechanical, water and electrical systems sized for the way the home actually performs. Because the envelope does so much of the work, the equipment can be smaller, run less and last longer — reducing energy use and improving comfort without leaning on any single gadget. The home is left net zero-ready: engineered so high-performance systems and future upgrades can carry it the rest of the way as energy demands rise. It is a home designed for the next several decades of Gulf Coast living, not just for the day the keys are handed over.",
    },
  ],
};

// ─── Process — three numbered steps (80–150 words each) ───
export const PROCESS = {
  eyebrow: "How We Build",
  h2: "A Thoughtful, Proven Way to Build in Coastal Florida",
  lede: "Every project follows the same owner-led path we call Living the Experience — three stages that keep you informed, involved and confident from first conversation to move-in.",
  steps: [
    {
      num: "01",
      title: "Plan with Purpose",
      body: "We start by understanding your property, your lifestyle and your long-term goals. From storm exposure to energy performance, every early decision is made with your family's safety and your investment in mind. This is where the work that protects the whole project happens: architectural and engineering coordination, structural and wind-load planning, and a careful permitting and coastal-compliance review for your specific lot. By resolving the critical decisions early — how the home sits on the site, how it is engineered for its exposure, what the envelope needs to do — we eliminate guesswork and the expensive surprises that surface later. It is the least visible stage of a build and the one that determines everything that follows.",
    },
    {
      num: "02",
      title: "Design and Build Together",
      body: "Working closely with architects, engineers and trusted trades, John leads the build hands-on — on the job site, not managing it from a distance. You stay involved and informed throughout, so the home that gets built is the home you planned. This is where the ICF shell, the impact-rated envelope and the high-performance systems come together in the field, each detail coordinated so the parts function as one engineered whole. Because Net Zero takes on a limited number of homes each year, your project gets the owner's direct attention rather than a rotation of site managers. This is the heart of Living the Experience: your preferences and our expertise building the same thing.",
    },
    {
      num: "03",
      title: "Build with Confidence",
      body: "Throughout construction, every detail is documented and quality-checked against the standard the home was designed to. Nothing is hidden behind drywall that we would not stand behind — the structure, the envelope and the systems are verified as they go in, not assumed. The result is a finished home that delivers real storm resilience, genuine energy efficiency and the long-term peace of mind that made you consider building this way in the first place. You end with a home engineered to protect your family and preserve your investment for decades, plus the documented record of how it was built — which matters on the day you insure it, and on the day you eventually pass it on.",
    },
  ],
};

// ─── Projects gallery ───
export const PROJECTS = {
  eyebrow: "Selected Work",
  h2: "Custom Homes Built to Protect What Matters Most",
  lede: "Custom homes designed for hurricane resistance, energy efficiency and long-term durability on Sarasota's Gulf Coast.",
  closing:
    "With over 25 years of experience building along Florida's Gulf Coast, Net Zero Construction focuses on quality, safety and long-term performance — not volume building.",
  images: [
    {
      src: "/images/gallery-great-room-kitchen.jpg",
      alt: "Open great room flowing into a custom kitchen with vaulted ceilings in a completed Net Zero Construction home.",
      caption: "Open great room & kitchen",
      aspect: "4/3",
    },
    {
      src: "/images/gallery-primary-bath.jpg",
      alt: "Tiled walk-in shower and stone finishes in a primary bathroom of a custom coastal home.",
      caption: "Primary bath",
      aspect: "4/5",
    },
    {
      src: "/images/gallery-kitchen-dining.jpg",
      alt: "Chef's kitchen with a large island opening to a long dining table in a custom coastal residence.",
      caption: "Chef's kitchen & dining",
      aspect: "4/3",
    },
    {
      src: "/images/gallery-dining-gulf-view.jpg",
      alt: "Dining area with a live-edge table and lit display niches in a luxury Gulf Coast home.",
      caption: "Dining with lit niches",
      aspect: "4/3",
    },
    {
      src: "/images/gallery-dining-detail.jpg",
      alt: "Dining area framed by large Gulf-view windows in a completed custom home.",
      caption: "Dining, Gulf-view windows",
      aspect: "4/3",
    },
    {
      src: "/images/gallery-outdoor-kitchen.jpg",
      alt: "Covered outdoor kitchen with a built-in grill on a coastal custom home lanai.",
      caption: "Covered outdoor kitchen",
      aspect: "16/10",
    },
    {
      src: "/images/gallery-pool-lanai.jpg",
      alt: "Screened pool and spa lanai overlooking the landscape of a custom Gulf Coast home.",
      caption: "Screened pool & spa lanai",
      aspect: "16/10",
    },
  ],
};

// ─── Owner-led ───
export const OWNER = {
  eyebrow: "Family-Run & Personally Built",
  h2: "John Wolterman Leads Every Build",
  body: "John Wolterman, owner of Net Zero Construction, leads every project alongside a small, experienced team, bringing over 25 years of hands-on building experience to a limited number of custom homes each year. That limit is not a marketing device — it is how one owner-builder can be on every job site and stand behind every wall. When you build with Net Zero, the person whose name is on the company is the person on your project.",
  imageAlt:
    "John Wolterman and the Net Zero Construction team on a Gulf Coast job site.",
};

// ─── Proof ───
export const PROOF = {
  eyebrow: "What People Are Saying",
  h2: "Trusted by Homeowners and the Gulf Coast Press",
  pressLine:
    "Net Zero's work has also been featured in the Gulf Coast press — by SRQ Magazine and Get Real Exclusive.",
};

// ─── Service area ───
export const SERVICE_AREA = {
  eyebrow: "Where We Build",
  h2: "Building Across Florida's Gulf Coast",
  body: "Net Zero Construction builds throughout roughly a 100-mile radius of Venice, Florida. If you are unsure whether your lot is within range, ask us — we are glad to tell you before you invest any more time.",
  cities: [
    "Sarasota",
    "Venice",
    "St. Petersburg",
    "Bradenton",
    "Nokomis",
    "Osprey",
    "Englewood",
    "& the surrounding Gulf Coast",
  ],
};

// ─── FAQ (6 rows, 60–120 words each) ───
export const FAQ = {
  eyebrow: "Common Questions",
  h2: "Questions Homeowners Ask Before They Build",
  items: [
    {
      q: "What is ICF, and how is it different from block or wood-frame construction?",
      a: "ICF stands for Insulated Concrete Forms. In practice, your home's walls are a steel-reinforced concrete core poured between two permanent faces of rigid insulation — one continuous, monolithic structure rather than a frame of wood studs or stacked block. Wood-frame walls rely on fasteners and sheathing to hold a system together; concrete block is strong but insulates poorly on its own. An ICF wall is structural, storm-resistant and highly insulated all at once, which is why we use it as the backbone of every home we build on the coast.",
    },
    {
      q: "Does building with ICF change how my home can be designed, or how it looks?",
      a: "No. ICF changes what the walls are made of, not what the home can be. Inside and out, a finished ICF home looks like any other high-end custom home — the concrete core is completely concealed by the finishes, cladding and details you choose. We work from your architecture, whether that is a contemporary coastal design or a Mediterranean-style estate, and engineer the ICF shell to support it. Wall thickness is planned into the design from the start, so the method disappears into the finished home and only the performance remains.",
    },
    {
      q: "How does ICF affect energy performance and day-to-day comfort?",
      a: "Because the concrete core is wrapped in continuous insulation on both faces, an ICF home is far tighter than a wood-framed one — fewer thermal bridges, less air leakage, and a mechanical system that cycles less to hold temperature. Day to day, that reads as more even temperatures from room to room, noticeably quieter interiors, and a home that stays comfortable through the Florida heat. It is the structural basis of our Energy Smart Safe Home standard and leaves the home net zero-ready. We do not publish savings figures, because performance depends on your design — but the envelope does the heavy lifting.",
    },
    {
      q: "Do you build on my lot, or can you help me find one?",
      a: "Both. Many of our clients already own or are under contract on coastal or near-coastal property, and we build on your lot. If you are still searching, we can help you evaluate sites for what actually matters in a custom coastal build — elevation and storm exposure, soil and foundation considerations, setbacks, and how a given lot affects the engineering and permitting of the home you want. Bringing us in before you buy often saves difficulty later, because the site shapes so many of the early structural and compliance decisions.",
    },
    {
      q: "Do you work with my architect?",
      a: "Yes. If you already have an architect, we work directly alongside them, coordinating the structural and envelope engineering that ICF construction requires so your design is realized without compromise. If you do not yet have one, we can bring you together with architects we have built with before and trust on coastal projects. Either way, the goal is the same: architecture, engineering and construction working as one team from the first planning conversation — which is how a complex custom home comes together without the gaps that create problems mid-build.",
    },
    {
      q: "What does the process look like from first conversation to move-in?",
      a: "It follows three stages: Plan with Purpose, Design and Build Together, and Build with Confidence. We begin with your property, goals and exposure, then move into coordinated design and engineering, permitting and coastal-compliance review, and finally a documented, quality-checked build that John leads hands-on. You stay involved and informed the whole way — we call it Living the Experience. Every custom home is different, so we do not put a stopwatch on your project; what we commit to is a considered, owner-led path from the first conversation to the day you move in.",
    },
  ],
};

// ─── Final consultation ───
export const CONSULTATION = {
  eyebrow: "Start the Conversation",
  h2: "Let's Build Something That Lasts",
  lede: "Whether you're planning a custom coastal home or exploring hurricane-resistant construction options, our team is ready to help you take the next step with confidence.",
  reassurances: [
    "No obligation — this is a conversation, not a quote request.",
    "A member of the team responds personally.",
    "We'll cover your goals, location and timeline.",
  ],
  imageAlt:
    "An elevated custom coastal home built by Net Zero Construction under a bright Gulf Coast sky.",
};

// ─── Footer ───
export const FOOTER = {
  boilerplate:
    "Net Zero Construction builds luxury custom homes on Florida's Gulf Coast, engineered to the Energy Smart Safe Home standard with Insulated Concrete Form construction, impact-rated materials and energy-smart design.",
};

// ─── Testimonials — the five real, attributed quotes only ───
export interface Testimonial {
  variant: "editorial-pull" | "client-quote";
  quote: string;
  attribution: string;
  role?: string;
}

export const SRQ_TESTIMONIAL: Testimonial = {
  variant: "editorial-pull",
  quote:
    "The Combination of innovative technique matched with some of the most advanced building material and products on the market, like Insulated Concrete Form (I.C.F.) walls and impact resistant windows provide a dramatic level of insulation and protection from hurricane force winds in excess of 250 miles per hour.",
  attribution: "SRQ Magazine",
};

export const GETREAL_TESTIMONIAL: Testimonial = {
  variant: "editorial-pull",
  quote:
    "From the ground-up, Net Zero's homes are solid, substantial and stunning. Furthermore, they are as distinctive as their owners. Net Zero Construction is raising the bar on residential construction throughout the Gulf Coast region.",
  attribution: "Get Real Exclusive",
};

export const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    variant: "client-quote",
    quote:
      "John, was very prompt with a quote for the job, and ready start when we were ready to go. Very professional on the job, and completed the job in a timely manner. We will definitely be using John again.",
    attribution: "Lisa B.",
    role: "Verified Customer",
  },
  {
    variant: "client-quote",
    quote:
      "Wolterman Bros did very efficient work and was able to work around our production schedule with ease. Will use them again.",
    attribution: "Mike P.",
    role: "Verified Customer",
  },
  {
    variant: "client-quote",
    quote:
      "Great service, dependable, excellent workmanship and hard workers.",
    attribution: "Ron D.",
    role: "Verified Customer",
  },
];

// ─── Form select options ───
export const BUDGET_LABEL =
  "What is your estimated budget for your custom home project?";

export const BUDGET_OPTIONS = [
  "Under $1 million",
  "$1 million–$3 million",
  "$3 million or more",
] as const;

export const DISQUALIFYING_BUDGET = "Under $1 million";

// Mega submission API expects snake_case keys: customer_id, site_id, source_provider
// (GTM + Meta Pixel are injected by the optimizer from MEGA_TAG_CONFIG in layout.tsx)
export const FORM = {
  customerId: "5e8427d2-7b27-4b7d-8057-ccb2d7763739",
  siteId: "e3ef990d-4df5-4654-8a43-64d0c96a55ab",
  sourceProvider: "net-zero-homes-landing",
};
