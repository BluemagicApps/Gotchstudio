/**
 * Rich, per-service landing-page content. Keyed by the `slug` in data/services.ts.
 * This supplements the base Service record (title, summary, description,
 * deliverables) with the deeper sections a strong, industry-standard service
 * page needs: an extended intro, who it's for, how the engagement works, an
 * indicative timeline + investment band, and FAQs (including how to book).
 *
 * Copy is authored in English and surfaced directly; translate before launch if
 * required (UI chrome around it is handled via /messages).
 */

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`;

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceDetail {
  /** One-line hero subtitle. */
  tagline: string;
  /** Full-bleed hero image. */
  heroImage: string;
  /** 2–3 paragraph overview. */
  intro: string[];
  /** Who the service is the right fit for. */
  idealFor: string[];
  /** Tailored, service-specific engagement steps. */
  howItWorks: ServiceStep[];
  /** Indicative duration band. */
  timeline: string;
  /** Indicative investment band + how billing works. */
  investment: string;
  /** Service-specific FAQs (include booking + pricing questions). */
  faqs: ServiceFaq[];
}

export const serviceDetails: Record<string, ServiceDetail> = {
  residential: {
    tagline: "Full-service homes designed for how you actually live.",
    heroImage: U("photo-1505693416388-ac5ce068fe85"),
    intro: [
      "Our residential practice delivers complete, turnkey interiors — from the first conversation about how you live to the day you walk into a fully styled, move-in-ready home. We take responsibility for the whole journey: interior architecture, custom furnishings, art, and the hundreds of small decisions in between.",
      "Every project is bespoke. We design around your routines, your collections, and the light your rooms actually get, producing spaces that feel timeless rather than trend-driven — homes that age gracefully and grow more beloved with time.",
    ],
    idealFor: [
      "Primary residences, pied-à-terre, and estates seeking a single, cohesive vision",
      "Clients who want one accountable team from concept through installation",
      "Homeowners investing in enduring quality over fast, disposable design",
      "Projects anywhere in the US or internationally, on-site or remote-led",
    ],
    howItWorks: [
      {
        title: "Discovery & brief",
        description:
          "An in-depth consultation to map how you live, what moves you, and the goals, budget, and timeline for the home.",
      },
      {
        title: "Concept & design development",
        description:
          "Spatial strategy, palette, and curated references evolve into resolved layouts, millwork, lighting, and furnishings — presented through drawings, samples, and realistic visualizations.",
      },
      {
        title: "Procurement & production",
        description:
          "We source, commission, and manage every element through our global trade network, handling logistics, lead times, and quality control.",
      },
      {
        title: "Installation & reveal",
        description:
          "A white-glove install down to the final styled detail, followed by aftercare so the home keeps performing for years.",
      },
    ],
    timeline:
      "Typically 9–18 months from brief to reveal, depending on scope and construction.",
    investment:
      "Full-service residential projects are bespoke and generally begin in the six figures. We work on a clear, staged fee structure agreed up front — no surprises.",
    faqs: [
      {
        q: "How do we get started?",
        a: "Book a consultation below or send an inquiry. We'll discuss your space, goals, and budget, then propose a tailored scope and fee.",
      },
      {
        q: "Do you take on whole-home projects only?",
        a: "Whole homes are our specialty, but we also take select single-room projects. If a room is all you need, e-Design or a virtual consultation may be the better fit.",
      },
      {
        q: "Can you work with our architect or builder?",
        a: "Yes — we collaborate closely with architects and contractors, and can join at any stage. Earlier is better for a seamless result.",
      },
      {
        q: "Do you work outside of New Jersey?",
        a: "We work across all 50 states and internationally. Many projects are led remotely with periodic site visits.",
      },
    ],
  },

  commercial: {
    tagline: "Branded environments that feel like destinations.",
    heroImage: U("photo-1524758631624-e2822e304c36"),
    intro: [
      "We design commercial and hospitality spaces engineered for experience and longevity — workplaces, showrooms, restaurants, and hotels that express a brand while remaining deeply human and comfortable.",
      "Our approach balances the operational realities of a working space (durability, flow, maintenance, code) with the residential warmth that makes people want to stay, return, and remember.",
    ],
    idealFor: [
      "Hospitality venues, workplaces, showrooms, and flagship retail",
      "Brands that want their physical space to tell their story",
      "Operators who need design that performs under real-world use",
      "Multi-site rollouts needing a repeatable, on-brand language",
    ],
    howItWorks: [
      {
        title: "Brand & experience brief",
        description:
          "We align on brand, audience, operational needs, and the experience each space should create.",
      },
      {
        title: "Concept & space planning",
        description:
          "Concept environments, circulation, and zoning resolved against capacity, service, and code requirements.",
      },
      {
        title: "FF&E & documentation",
        description:
          "Specification of furniture, fixtures, equipment, and finishes, with documentation your contractors can build from.",
      },
      {
        title: "Project management & opening",
        description:
          "We manage procurement and installation through to a launch-ready, photograph-ready space.",
      },
    ],
    timeline:
      "Typically 6–14 months depending on size, fit-out, and phasing.",
    investment:
      "Scoped per project against area, fit-out level, and FF&E. We provide a structured proposal and fee after an initial discovery call.",
    faqs: [
      {
        q: "Can you design for a brand we already have?",
        a: "Absolutely. We translate existing brand guidelines into a spatial language, or develop one with you if it doesn't yet exist.",
      },
      {
        q: "Do you handle multiple locations?",
        a: "Yes — we build a design system that keeps every location on-brand while respecting each site's character.",
      },
      {
        q: "Do you manage the build?",
        a: "We provide project management and work alongside your contractors, or recommend trusted partners.",
      },
      {
        q: "How do we begin?",
        a: "Send an inquiry or book a consultation. We'll review your brief, site, and goals before proposing a scope.",
      },
    ],
  },

  "new-build-renovation": {
    tagline: "Architectural collaboration from foundation to finish.",
    heroImage: U("photo-1600210492486-724fe5c67fb0"),
    intro: [
      "For ground-up builds and substantial renovations, we partner with your architect and builder from the earliest stages — ensuring the interior architecture and the building rise as one coherent vision rather than being reconciled at the end.",
      "Getting involved early lets us shape ceiling heights, sightlines, window placement, and material transitions, so the finished interiors feel inevitable: nothing forced, nothing left over.",
    ],
    idealFor: [
      "Ground-up new builds and gut renovations",
      "Clients assembling an architect + builder + designer team",
      "Projects where interior architecture is central to the result",
      "Owners who value early, integrated decision-making",
    ],
    howItWorks: [
      {
        title: "Early collaboration",
        description:
          "We join the architectural conversation to influence layout, light, structure, and flow before they're fixed.",
      },
      {
        title: "Interior architecture",
        description:
          "Millwork, finish schedules, lighting, and material transitions are resolved in lockstep with the architecture.",
      },
      {
        title: "Coordination & site supervision",
        description:
          "We coordinate trades and supervise on site so design intent survives construction.",
      },
      {
        title: "Furnishing & completion",
        description:
          "Furnishings and styling complete the space, delivered move-in ready.",
      },
    ],
    timeline:
      "Runs with the construction schedule — commonly 12–30 months end to end.",
    investment:
      "Fees reflect the depth of architectural coordination involved; agreed in stages after a scoping call.",
    faqs: [
      {
        q: "When should we bring you in?",
        a: "As early as possible — ideally during schematic design. Early involvement produces the most seamless, cost-effective result.",
      },
      {
        q: "Do you replace our architect?",
        a: "No. We collaborate with your architect and builder; interior design and architecture are complementary disciplines.",
      },
      {
        q: "Can you supervise the site?",
        a: "Yes — site supervision and trade coordination are part of this service to protect the design through the build.",
      },
      {
        q: "How do we start?",
        a: "Book a consultation with your plans (even early ones) and we'll advise on timing and scope.",
      },
    ],
  },

  "kitchen-bath": {
    tagline: "The hardest-working rooms, made beautiful.",
    heroImage: U("photo-1586023492125-27b2c045efd7"),
    intro: [
      "Kitchens and baths reward obsessive attention. We design bespoke cabinetry, considered ergonomics, and enduring materials to produce rooms that are as functional as they are sculptural — and that hold their value over decades.",
      "From stone selection and appliance specification to lighting and plumbing, every decision is resolved in detail, so the result is beautiful in photographs and a pleasure to actually use.",
    ],
    idealFor: [
      "Kitchen and bathroom renovations within a larger or standalone project",
      "Clients who cook, host, and want a room engineered around it",
      "Homeowners specifying custom cabinetry and natural stone",
      "Spaces needing both high function and high finish",
    ],
    howItWorks: [
      {
        title: "Function & layout",
        description:
          "We study how you use the space, then resolve ergonomics, storage, and workflow before aesthetics.",
      },
      {
        title: "Cabinetry & materials",
        description:
          "Custom cabinetry, stone, fittings, and appliances are selected and detailed as a cohesive whole.",
      },
      {
        title: "Technical coordination",
        description:
          "Plumbing, electrical, lighting, and ventilation are coordinated with your trades.",
      },
      {
        title: "Installation",
        description:
          "We oversee installation to a precise, lasting finish.",
      },
    ],
    timeline:
      "Typically 4–9 months including custom cabinetry lead times.",
    investment:
      "Driven by cabinetry, stone, and appliance selections; scoped after a consultation and site review.",
    faqs: [
      {
        q: "Can you do just a kitchen or just a bath?",
        a: "Yes — these can be standalone engagements or part of a wider project.",
      },
      {
        q: "Do you provide the cabinetry?",
        a: "We design custom cabinetry and commission it through our trusted makers, managing fabrication and fit.",
      },
      {
        q: "Will you coordinate plumbers and electricians?",
        a: "Yes — we coordinate the technical trades so everything aligns with the design.",
      },
      {
        q: "How do I book?",
        a: "Request a consultation below with a few photos and dimensions of the room.",
      },
    ],
  },

  "furnishings-procurement": {
    tagline: "Sourcing, custom commissions, and seamless logistics.",
    heroImage: U("photo-1567538096630-e0c55bd6374c"),
    intro: [
      "Through our global trade network we source, commission, and manage every furnishing in a space — handling logistics, receiving, installation, and styling end to end, so you never have to chase a freight forwarder or inspect a crate.",
      "Whether you need a single statement commission or a whole home furnished, we bring trade access, vetted makers, and the operational muscle to land everything beautifully and on time.",
    ],
    idealFor: [
      "Clients with finished architecture who need it furnished",
      "Projects requiring custom or commissioned pieces",
      "Anyone wanting trade-only access and managed logistics",
      "Stagings, second homes, and rapid, high-quality fit-outs",
    ],
    howItWorks: [
      {
        title: "Scheme & selection",
        description:
          "We build a furnishing scheme and present curated, trade-sourced selections with options.",
      },
      {
        title: "Commission & order",
        description:
          "We place and track orders, commission custom pieces, and manage lead times.",
      },
      {
        title: "Receiving & logistics",
        description:
          "Items are received, inspected, and consolidated for a single coordinated delivery.",
      },
      {
        title: "Install & style",
        description:
          "We install and style the space, down to the final object.",
      },
    ],
    timeline:
      "Typically 2–6 months depending on custom lead times.",
    investment:
      "Combines a procurement fee with trade pricing on goods; structure shared after a consultation.",
    faqs: [
      {
        q: "Can I use trade pricing through you?",
        a: "Yes — we source through trade accounts and manage the purchasing on your behalf.",
      },
      {
        q: "Do you handle delivery and installation?",
        a: "Fully — receiving, inspection, logistics, installation, and styling are all included.",
      },
      {
        q: "Can you commission custom pieces?",
        a: "Yes — bespoke commissions through our maker network are a core part of this service.",
      },
      {
        q: "How do we begin?",
        a: "Book a consultation with your plans or a wishlist and we'll propose an approach.",
      },
    ],
  },

  "e-design": {
    tagline: "Our signature aesthetic, delivered remotely.",
    heroImage: U("photo-1493809842364-78817add7ffb"),
    intro: [
      "e-Design is a flexible, room-by-room digital package for clients anywhere in the world. You receive concept boards, layouts, and a curated shopping list — then implement on your own schedule, at your own pace.",
      "It's the most accessible way to work with us: the same considered eye and sourcing, delivered as a clear, actionable plan you execute yourself (or hand to a local installer).",
    ],
    idealFor: [
      "Clients outside our travel range or on a defined budget",
      "Single rooms and refreshes rather than full builds",
      "Hands-on homeowners who enjoy implementing",
      "Anyone wanting designer direction without full-service fees",
    ],
    howItWorks: [
      {
        title: "Share your space",
        description:
          "You send photos, dimensions, and a short brief through our simple intake.",
      },
      {
        title: "Concept & plan",
        description:
          "We deliver a concept board, floor plan, and a curated, shoppable product list.",
      },
      {
        title: "Implementation guide",
        description:
          "A clear, step-by-step guide so you (or a local pro) can bring it to life.",
      },
      {
        title: "One revision round",
        description:
          "We refine the package once based on your feedback.",
      },
    ],
    timeline:
      "Typically 2–4 weeks per room.",
    investment:
      "A fixed per-room package — far more accessible than full-service. Exact pricing shared on inquiry.",
    faqs: [
      {
        q: "How is this different from full-service?",
        a: "You implement the plan yourself; we provide the design, layout, and shopping list rather than managing procurement and installation.",
      },
      {
        q: "What do I receive?",
        a: "A concept board, floor plan, curated product list, and an implementation guide — plus one revision round.",
      },
      {
        q: "Can I upgrade to full-service later?",
        a: "Yes — many clients start with e-Design and expand if they'd like us to take over execution.",
      },
      {
        q: "How do I start?",
        a: "Send an inquiry below and we'll share the intake and package details.",
      },
    ],
  },

  "virtual-consults": {
    tagline: "Expert guidance, one focused session at a time.",
    heroImage: U("photo-1497215728101-856f4ea42174"),
    intro: [
      "Book a designer for a single, high-impact video session to solve a specific challenge — a color decision, a furniture layout, a sourcing question, or a second opinion before you commit.",
      "It's the fastest way to get our perspective: 60 focused minutes of live feedback, followed by a written action summary and resource links so you can move forward with confidence.",
    ],
    idealFor: [
      "A specific question or decision rather than a full project",
      "A sanity-check before a significant purchase or renovation",
      "Clients wanting expert input quickly and affordably",
      "Anyone, anywhere — sessions are fully remote",
    ],
    howItWorks: [
      {
        title: "Book a slot",
        description:
          "Pick a date and time below and tell us what you'd like to focus on.",
      },
      {
        title: "Prepare",
        description:
          "Send photos and any plans in advance so we make the most of the hour.",
      },
      {
        title: "Live 60-minute session",
        description:
          "We work through your questions on a video call with live, actionable feedback.",
      },
      {
        title: "Action summary",
        description:
          "You receive a written recap with recommendations and resource links.",
      },
    ],
    timeline:
      "A single 60-minute session, usually scheduled within days.",
    investment:
      "A flat per-session fee — the most affordable way to work with the studio.",
    faqs: [
      {
        q: "What can we cover in one session?",
        a: "One or two focused topics: a palette, a layout, sourcing direction, or a second opinion. We'll tell you in advance if your needs are better served by e-Design or full-service.",
      },
      {
        q: "Do I get anything in writing?",
        a: "Yes — a written action summary and resource links after the call.",
      },
      {
        q: "Is it really remote?",
        a: "Entirely. Sessions run over video, so we can work with you anywhere.",
      },
      {
        q: "How do I book?",
        a: "Use the booking widget below to reserve a date and time.",
      },
    ],
  },

  "ai-enhanced-design": {
    tagline: "Visualize options instantly, then refine with our team.",
    heroImage: U("photo-1600585154340-be6161a56a0c"),
    intro: [
      "Our AI Studio lets you explore design directions in your own space in seconds — reimagine a room in our signature styles, virtually furnish an empty shell, take a style quiz, and chat with our design concierge. Then you collaborate with our designers to bring the chosen vision to life with real materials.",
      "AI accelerates the early, exploratory phase: it helps you and our team align on direction faster, with fewer abstract conversations and more confident decisions. It complements human design — it doesn't replace the craft, sourcing, and execution that follow.",
    ],
    idealFor: [
      "Clients who want to see options before committing",
      "Anyone exploring a direction for a room or whole home",
      "Faster alignment between you and our design team",
      "A modern, interactive on-ramp to a full project",
    ],
    howItWorks: [
      {
        title: "Explore in the AI Studio",
        description:
          "Use the Room Visualizer, Virtual Staging, Style Quiz, and 360° Walkthrough to find directions you love.",
      },
      {
        title: "Share your direction",
        description:
          "Send us what resonated — styles, rooms, and references the tools surfaced.",
      },
      {
        title: "Designer handoff",
        description:
          "Our team translates the AI exploration into a real, buildable design with genuine materials and sourcing.",
      },
      {
        title: "Bring it to life",
        description:
          "We take it forward through any of our services, from e-Design to full-service.",
      },
    ],
    timeline:
      "Explore instantly; the designer collaboration follows your chosen service's timeline.",
    investment:
      "The AI Studio is free to explore. Engagements that follow are priced per the service you choose.",
    faqs: [
      {
        q: "Is the AI Studio free?",
        a: "Yes — exploring the Room Visualizer, Virtual Staging, Style Quiz, and concierge is free. You only invest if you proceed with a design service.",
      },
      {
        q: "Does AI replace your designers?",
        a: "No. AI speeds up exploration and alignment; our designers handle the real craft, sourcing, and execution.",
      },
      {
        q: "Can I use my own room photos?",
        a: "Yes — the Room Visualizer and Virtual Staging work from a photo of your space.",
      },
      {
        q: "What happens after I explore?",
        a: "Share what you liked or book a consultation, and we'll turn it into a real plan.",
      },
    ],
  },
};

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}
