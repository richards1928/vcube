export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  details?: string[];
  category?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  tagline: string;
  heroHeadline: string;
  items: ServiceItem[];
  color: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "construction" | "interiors" | "branding";
  categoryLabel: string;
  description: string;
  scope: string[];
  status: "Completed" | "In Progress" | "Demonstration Concept";
  year: string;
  isDemo?: boolean;
}

export const SITE_CONFIG = {
  name: "Vcube Infra Projects",
  shortName: "Vcube",
  legalName: "Vcube Infra Projects",
  tagline: "FROM FOUNDATION TO FORM",
  description: "Specialists in residential apartment construction, multi-level independent houses, commercial structures, turnkey interiors, and architectural branding.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vcubeinfra.com",
  
  // WhatsApp & Communication Configuration
  // Configurable phone number with country code (no spaces/symbols for API)
  whatsapp: {
    phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919014303773",
    displayNumber: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+91 90143 03773",
    isVerifiedPlaceholder: false,
    defaultGreeting: "Hello Vcube Infra Projects, I'd like to discuss a project enquiry.",
  },

  // Contact Details
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vcubeinfraprojects@gmail.com",
    address: {
      city: process.env.NEXT_PUBLIC_ADDRESS_CITY || "Hyderabad",
      state: process.env.NEXT_PUBLIC_ADDRESS_STATE || "Telangana",
      country: "India",
      region: "Hyderabad & Regional Telangana",
      consultationNotice: "Consultations, structural reviews, and site evaluations arranged by appointment.",
    },
    businessHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
    workingDays: "Mon - Sat",
  },

  // Navigation Links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/#services",
      subItems: [
        { label: "Construction", href: "/services/construction", desc: "Estimations, Structural Work & Execution" },
        { label: "Interiors", href: "/services/interiors", desc: "Ceilings, Furniture, Flooring & Finishes" },
        { label: "Branding", href: "/services/branding", desc: "Logos, Signage & Architectural Graphics" },
      ],
    },
    { label: "Our Projects", href: "/projects" },
    { label: "Clients", href: "/clients" },
    { label: "Project Queries", href: "/queries" },
    { label: "Contact", href: "/contact" },
  ],

  // Theme Colors
  colors: {
    obsidian: "#090B0D",
    graphite: "#171A1D",
    warmIvory: "#F3F0E8",
    champagneGold: "#C6A36A",
    concreteGrey: "#858782",
    charcoalBorder: "rgba(198, 163, 106, 0.15)",
  },

  // EXACT SERVICES FROM HANDWRITTEN REQUIREMENTS
  services: {
    construction: {
      id: "construction",
      slug: "construction",
      title: "Construction",
      tagline: "Residential Civil Engineering & Structural Development",
      heroHeadline: "Architectural Precision from Foundation to Completed Handover",
      shortDesc: "End-to-end structural engineering and turnkey civil development for residential apartments, multi-level independent houses, commercial structures, estimations, planning, and meticulous on-site execution.",
      color: "#C6A36A",
      items: [
        {
          id: "estimations",
          name: "Estimations",
          description: "Comprehensive quantity surveying, bill of quantities (BOQ), material costing analysis, and budget forecasting for residential and commercial structures.",
          details: [
            "Detailed Bill of Quantities (BOQ)",
            "Cost optimization and material life-cycle analysis",
            "Cash flow scheduling and contingency forecasting",
            "Value engineering assessments"
          ]
        },
        {
          id: "construction-development",
          name: "Construction Development",
          description: "Full-lifecycle project development, site grading, procurement logistics, subcontractor coordination, and turnkey civil project management.",
          details: [
            "Master construction milestone tracking",
            "Turnkey site management & safety standards",
            "Multi-disciplinary engineering coordination",
            "Quality assurance & compliance audits"
          ]
        },
        {
          id: "plans",
          name: "Plans",
          description: "Architectural floor plans, structural working drawings, MEP integration plans, 3D sectionals, and municipal sanction drawings.",
          details: [
            "Architectural & spatial layouts",
            "Structural drafting & foundation layout diagrams",
            "MEP (Mechanical, Electrical, Plumbing) integration plans",
            "Elevation & cross-sectional working blueprints"
          ]
        },
        {
          id: "structural-work",
          name: "Structural Work",
          description: "Reinforced cement concrete (RCC) frameworks, deep foundation pile works, grade beams, column grids, shear walls, and structural steel fabrication.",
          details: [
            "Earthwork, raft and deep pile foundations",
            "RCC column grid & heavy-load floor slab casting",
            "High-tensile structural steel framing",
            "Seismic & wind resistance engineering"
          ]
        },
        {
          id: "execution",
          name: "Execution",
          description: "Field implementation, continuous quality inspections, timeline adherence, safety protocols, and handover protocol.",
          details: [
            "Daily on-site supervision by certified site engineers",
            "Material testing & concrete slump/cube validation",
            "Strict structural tolerance benchmarks",
            "Turnkey client sign-off and handover"
          ]
        }
      ]
    },

    interiors: {
      id: "interiors",
      slug: "interiors",
      title: "Interiors",
      tagline: "Spatial Transformation & Architectural Finishes",
      heroHeadline: "Crafted Interiors Balancing Function, Lighting & Materials",
      shortDesc: "Comprehensive interior solutions spanning false ceilings, custom furniture, high-grade flooring, electrical MEP, flutter boards, painting, and architectural cladding.",
      color: "#E2C392",
      // All items from handwritten notes preserved without omission
      items: [
        {
          id: "false-ceilings",
          name: "False Ceilings",
          category: "Ceiling & Lighting Infrastructure",
          description: "Gypsum, grid, acoustic, wooden baffle, and modular false ceiling installations with concealed ambient cove lighting troughs.",
          details: [
            "Gypsum board and perimeter coves",
            "Acoustic perforated ceiling systems",
            "Metal grid and architectural wooden baffles",
            "Integrated magnetic track lighting troughs"
          ]
        },
        {
          id: "furniture",
          name: "Furniture",
          category: "Joinery & Custom Fit-outs",
          description: "Bespoke modular workstations, executive desks, conference suites, residential cabinetry, wardrobes, and ergonomic custom seating.",
          details: [
            "Custom architectural joinery & millwork",
            "Modular commercial workstation clusters",
            "Executive and conference table fabrication",
            "Custom residential wardrobes and credenzas"
          ]
        },
        {
          id: "flooring",
          name: "Flooring",
          category: "Surface & Floor Solutions",
          description: "Large-format vitrified tiles, Italian marble, engineered hardwood, epoxy industrial coatings, and luxury vinyl tile (LVT) installations.",
          details: [
            "Natural stone installation, large-format tile laying & surface polishing",
            "Large-format slim porcelain slab installation",
            "Engineered natural hardwood and herringbone parquet",
            "Self-levelling epoxy and anti-static ESD flooring"
          ]
        },
        {
          id: "electrical-work",
          name: "Electrical Work",
          category: "MEP & Technical Infrastructure",
          description: "Complete conduit routing, DB dressing, architectural accent lighting, smart automated switching, and dedicated power loads.",
          details: [
            "Concealed fire-retardant electrical conduit laying",
            "Distribution board (DB) balance and circuit testing",
            "Low-voltage automation and DALI lighting controls",
            "UPS power integration and surge protection"
          ]
        },
        {
          id: "flutter-boards",
          name: "Flutter Boards",
          category: "Specialized Display & Joinery Systems",
          description: "Specialized dynamic slat, louvre, and kinetic display/partition board installations (preserved from client specifications).",
          details: [
            "Precision mechanical mounting frameworks",
            "Architectural flutter slat wall partitions",
            "Dual-sided presentation and decorative paneling",
            "Client-customized material specifications"
          ]
        },
        {
          id: "painting",
          name: "Painting",
          category: "Surface & Wall Finishes",
          description: "Stucco, Venetian plaster, smooth-coat PU finishes, textured masonry paint, and anti-fungal premium interior/exterior emulsions.",
          details: [
            "Multi-coat base putty & laser surface levelling",
            "Textured architectural wall finishes & specialized micro-coatings",
            "Polyurethane (PU) and duco satin spray finishes",
            "Low-VOC high-durability washable emulsions"
          ]
        },
        {
          id: "glass-films",
          name: "Glass Films",
          category: "Glazing Treatments & Privacy",
          description: "Frosted privacy bands, dichroic films, one-way vision solar protection, and custom etched architectural manifestations.",
          details: [
            "Architectural frosted privacy manifestation bands",
            "Gradient frosted film for conference room glass",
            "Dichroic color-shifting design films",
            "Safety shatter-retention film applications"
          ]
        },
        {
          id: "wallpapers",
          name: "Wallpapers",
          category: "Surface & Wall Finishes",
          description: "Heavy-duty textured vinyl wallcoverings, bespoke seamless murals, acoustic fabric backings, and metallic leaf designs.",
          details: [
            "Commercial-grade fabric-backed vinyl wallcoverings",
            "Custom-scale architectural mural wallpaper",
            "Natural grasscloth and linen textured rolls",
            "Seamless pattern alignment & seam sealing"
          ]
        },
        {
          id: "foam-boards",
          name: "Foam Boards",
          category: "Display & Graphic Substrates",
          description: "High-density foam-core substrate fabrication for lightweight 3D interior features, directional wayfinding, and architectural models.",
          details: [
            "High-density rigid PVC and foam board cutting",
            "Matte-laminated architectural display panels",
            "3D dimensional typography and motifs",
            "Lightweight standoff mounting systems"
          ]
        },
        {
          id: "vinyl-stickers",
          name: "Vinyl Stickers",
          category: "Surface & Graphic Substrates",
          description: "Precision computer-cut cast vinyl, typography decals, safety warnings, and high-impact decorative graphics.",
          details: [
            "Plotter-cut high-tack indoor and outdoor vinyl",
            "Matte and gloss architectural lettering",
            "Safety regulation & compliance iconography",
            "Bubble-free air-release adhesive application"
          ]
        },
        {
          id: "acp-cladding",
          name: "ACP Cladding",
          category: "Facade & Wall Envelopes",
          description: "Aluminum Composite Panel (ACP) fabrication, sub-frame framing, groove routing, and weather-resistant interior/exterior cladding.",
          details: [
            "Structural aluminum channel sub-framing",
            "CNC V-groove routing and folding",
            "PVDF exterior grade weather-proof coatings",
            "Silicone weather-proofing joint sealant"
          ]
        }
      ]
    },

    branding: {
      id: "branding",
      slug: "branding",
      title: "Branding",
      tagline: "Architectural Identity & Environmental Graphics",
      heroHeadline: "Physical Brand Presence Seamlessly Integrated into Architecture",
      shortDesc: "End-to-end architectural branding spanning external monolithic signage, 3D illuminated logos, interior wayfinding, wall graphics, and sun control films.",
      color: "#D4AF37",
      items: [
        {
          id: "logos",
          name: "Logos",
          description: "Fabrication of 3D dimensional corporate emblems, acrylic front-lit, reverse halo-lit stainless steel, and solid brass reception insignias.",
          details: [
            "3D channel letters with waterproof IP67 LED modules",
            "Titanium-gold and brushed steel halo illumination",
            "Solid acrylic push-through dimensional letters",
            "Reception wall emblem mounting and concealed wiring"
          ]
        },
        {
          id: "external-signage",
          name: "External Signage",
          description: "Building facade sky signage, pylon totems, cantilevered blade signs, and entrance gate branding engineered for high wind loads.",
          details: [
            "Rooftop & high-rise structural facade signage",
            "Freestanding architectural monument pylon signs",
            "Illuminated entrance gate fascia branding",
            "Structural sub-framing design & weather-resistant mounting"
          ]
        },
        {
          id: "internal-signage",
          name: "Internal Signage",
          description: "Architectural wayfinding directories, conference room designations, room plaques, and elevator lobby cues.",
          details: [
            "Modular directional wayfinding and floor directories",
            "Magnetic interchangeable desk and room markers",
            "Architectural room identification & directional wayfinding",
            "Brushed metallic standoffs and tempered glass plaques"
          ]
        },
        {
          id: "wall-graphics",
          name: "Wall Graphics",
          description: "Large-format corporate narrative murals, acoustic fabric tension frames, environmental brand timelines, and hand-finished architectural artwork.",
          details: [
            "Seamless tension-fabric silicone edge graphics (SEG)",
            "Direct-to-wall high-resolution architectural printing",
            "Core corporate values and culture brand walls",
            "UV-cured scratch-resistant environmental graphics"
          ]
        },
        {
          id: "sun-control-films",
          name: "Sun Control Films",
          category: "Architectural Performance Glazing",
          description: "High-rejection ceramic solar films, UV-shielding tints, spectrally selective thermal barriers, and glare reduction for glass facades.",
          details: [
            "Solar heat reduction with up to 88% IR rejection (manufacturer rating)",
            "Up to 99% UV radiation blocking for interior protection",
            "Low-reflectivity neutral natural daylight preservation",
            "Building energy efficiency & HVAC load reduction"
          ]
        }
      ]
    }
  },

  // Demonstration Portfolio Projects (Prioritizing residential apartments, independent houses & commercial structures)
  demoProjects: [
    {
      id: "proj-1",
      title: "Surya Heights Residential Apartments",
      category: "construction",
      categoryLabel: "Apartment Construction",
      description: "Turnkey multi-story residential apartment development featuring ground stilt parking, spacious residential units, earthquake-resistant RCC frame, cantilevered glass balconies, and modern exterior elevation.",
      scope: ["Foundation & Plinth", "RCC Structural Frame", "Floor Slabs & Staircase", "Elevation & Finishing"],
      status: "Demonstration Concept",
      year: "2025",
      isDemo: true
    },
    {
      id: "proj-2",
      title: "The Courtyard Modern Independent House",
      category: "construction",
      categoryLabel: "Independent Multi-Floor House",
      description: "Contemporary multi-level private residence with covered parking entrance, cantilevered box balconies with teakwood louvers, terrace garden pergola, and custom architectural joinery.",
      scope: ["Architectural Plans", "Structural RCC Frame", "Modern Facade Finishes", "Terrace Pergola"],
      status: "Demonstration Concept",
      year: "2025",
      isDemo: true
    },
    {
      id: "proj-3",
      title: "Contemporary Residential Living & Spatial Interiors",
      category: "interiors",
      categoryLabel: "Residential Interiors",
      description: "High-end apartment interior transformation featuring gypsum false ceilings with warm cove lighting, teak flutter boards, Italian vitrified flooring, and bespoke modular cabinetry.",
      scope: ["False Ceilings", "Flutter Boards", "Flooring", "Custom Furniture", "Electrical Work"],
      status: "Demonstration Concept",
      year: "2024",
      isDemo: true
    },
    {
      id: "proj-4",
      title: "Vaishnavi Enclave Residential Project",
      category: "construction",
      categoryLabel: "Apartment Construction",
      description: "Turnkey residential apartment development progressing through deep foundation, RCC column grid, floor slabs, AAC block masonry, and exterior weather-coat elevation.",
      scope: ["Civil Execution", "Structural Slabs", "Brickwork & Masonry", "Site Supervision"],
      status: "Demonstration Concept",
      year: "2024",
      isDemo: true
    },
    {
      id: "proj-5",
      title: "Vcube Residency Architectural Signage & Branding",
      category: "branding",
      categoryLabel: "Residential Community Branding",
      description: "Complete architectural identity package for residential apartment community: 3D illuminated entrance gate emblem, floor wayfinding directories, and UV solar sun control window films.",
      scope: ["External Signage", "3D Illuminated Logos", "Internal Wayfinding", "Sun Control Films"],
      status: "Demonstration Concept",
      year: "2024",
      isDemo: true
    },
    {
      id: "proj-6",
      title: "Arcadia Boutique Commercial & Retail Hub",
      category: "construction",
      categoryLabel: "Commercial Development (Secondary)",
      description: "A 3-storey boutique commercial and retail building featuring exterior ACP cladding, ground floor double-height showroom glazing, and illuminated corporate signage.",
      scope: ["Structural Work", "ACP Facade Cladding", "Commercial Glazing", "External Signage"],
      status: "Demonstration Concept",
      year: "2024",
      isDemo: true
    }
  ]
};

// WhatsApp Link Generator Helper
export function generateWhatsAppLink(options: {
  service?: "construction" | "interiors" | "branding" | string;
  projectTitle?: string;
  customNotes?: string;
  enquiryType?: string;
}) {
  const { phoneNumber } = SITE_CONFIG.whatsapp;
  let message = "";

  if (options.projectTitle) {
    message = `Hello Vcube Infra Projects, I'm inquiring about "${options.projectTitle}". I would like to discuss specifications, timeline, and execution details.`;
  } else if (options.service === "construction") {
    message = "Hello Vcube Infra Projects, I'm interested in your construction services. I'd like to discuss a project.";
  } else if (options.service === "interiors") {
    message = "Hello Vcube Infra Projects, I'm interested in your interior services (False Ceilings, Furniture, Flooring, Finishes). I'd like to discuss a project.";
  } else if (options.service === "branding") {
    message = "Hello Vcube Infra Projects, I'm interested in your branding & architectural signage services. I'd like to discuss a project.";
  } else if (options.enquiryType) {
    message = `Hello Vcube Infra Projects, I'm interested in initiating a ${options.enquiryType} project. I would like to schedule a consultation.`;
  } else {
    message = SITE_CONFIG.whatsapp.defaultGreeting;
  }

  if (options.customNotes) {
    message += ` Details: ${options.customNotes}`;
  }

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
