/**
 * Initial content, migrated 1:1 from the hard-coded frontend
 * (company-profile-falah @ main). Asset paths are relative to the
 * frontend's `public/` folder.
 */
import type { Page, SiteSetting } from '@/payload-types'

export type MediaRef = (assetPath: string, alt?: string) => Promise<number>

type Layout = Page['layout']

const CTA_HEADER = {
  eyebrow: 'Let’s Build Future-Ready Operations',
  title: 'Ready to Build Smarter Training & Operations?',
  description:
    'Partner with Falah Inovasi Teknologi to develop immersive training systems, operational technologies, and digital solutions.',
}

const REQUEST_CONSULTATION = {
  label: 'Request Consultation',
  href: '/contact',
  style: 'fill' as const,
}
const EXPLORE_SOLUTIONS = {
  label: 'Explore Our Solutions',
  href: '/solution',
  style: 'stroke' as const,
}

// ── Collections ────────────────────────────────────────────────────────

/** Order = hero marquee order, then the extra logos used on the About page. */
export const partners = [
  { key: 'ilias', name: 'ILIAS', logo: '/home/partner-ilias.svg', showInHero: true },
  { key: 'plath', name: 'Plath', logo: '/home/partner-plath.svg', showInHero: true },
  {
    key: 'bohemia',
    name: 'Bohemia',
    logo: '/home/0a753080592dcd342c94d545a636dcdf4da59a21.webp',
    showInHero: true,
  },
  { key: 'tni-ad', name: 'TNI AD', logo: '/home/partner-tni-ad.svg', showInHero: true },
  { key: 'trelix', name: 'Trelix', logo: '/home/partner-trelix.svg', showInHero: true },
  { key: 'everbridge', name: 'Everbridge', logo: '/home/partner-everbridge.svg', showInHero: true },
  { key: 'strojirna', name: 'Strojirna', logo: '/home/partner-strojirna.svg', showInHero: true },
  { key: 'tni-al', name: 'TNI AL', logo: '/home/partner-tni-al.svg', showInHero: true },
  {
    key: 'bohemia-2',
    name: 'Bohemia',
    logo: '/home/8174b2638eb0e466077f2ffb86c994fd812fa97a-a1ab07.webp',
    showInHero: true,
  },
  {
    key: 'unity-2',
    name: 'Unity',
    logo: '/home/83f3ebf81d5491ee538a965e7e177167d72c9ec9-559a07.webp',
    showInHero: true,
  },
  {
    key: 'kemhan',
    name: 'KEMHAN',
    logo: '/home/88a046b82458ea063910ce5d1d8298a6d317580e.webp',
    showInHero: true,
  },
  {
    key: 'plath-2',
    name: 'Plath',
    logo: '/home/61b51db11d6cc6b101b8d66fabfcf795877e26e1-528ece.webp',
    showInHero: true,
  },
  { key: 'havelsan', name: 'Havelsan', logo: '/home/partner-havelsan.svg', showInHero: false },
  { key: 'unity', name: 'Unity', logo: '/home/partner-unity.svg', showInHero: false },
  {
    key: 'al',
    name: 'AL',
    logo: '/home/a051f69397e0178c8c265dd8177d9a7264c4053b.webp',
    showInHero: false,
  },
  {
    key: 'ad',
    name: 'AD',
    logo: '/home/aa8414ca799ac8951862b25d4ad3b8c6365e2ef5.webp',
    showInHero: false,
  },
  {
    key: 'kemhan-2',
    name: 'KEMHAN',
    logo: '/home/d145f6c203a9e69198a2140716fa1ab3ab32f08e.webp',
    showInHero: false,
  },
  {
    key: 'au',
    name: 'AU',
    logo: '/home/cec994131a09cf856842b401d37d05540eab5457.webp',
    showInHero: false,
  },
  { key: 'vectra', name: 'Vectra AI', logo: '/home/partner-vectra.svg', showInHero: false },
] as const

export type PartnerKey = (typeof partners)[number]['key']

export const aboutPartnerRows: { rowOne: PartnerKey[]; rowTwo: PartnerKey[] } = {
  rowOne: ['ilias', 'plath', 'bohemia', 'strojirna', 'havelsan', 'everbridge'],
  rowTwo: ['unity', 'al', 'ad', 'kemhan-2', 'au', 'vectra'],
}

export const certifications = [
  {
    title: 'ISO 9001:2015 QMS',
    subtitle: 'Quality Management System',
    description:
      'Ensuring structured quality management and reliable implementation processes across operational technology projects.',
    icon: '/home/cert-iso.svg',
    iconShape: 'square',
    certificate: '/about/6344c5f997c3d40fc8b7c786d728dedb59c8a904.webp',
    certificateFocus: 'top',
  },
  {
    title: 'TKDN Certification',
    subtitle: 'Domestic Component Compliance',
    description:
      'Supporting national industry growth through locally compliant technology and operational solutions.',
    icon: '/home/cert-tkdn.svg',
    iconShape: 'wide',
    certificate: '/about/c9c4d051832f17cdfd69f36233a943e5aca0b3d6.webp',
    certificateFocus: 'top',
  },
  {
    title: 'National Defense Industry',
    subtitle: 'Strategic Defense Technology Sector',
    description:
      'Contributing to mission-critical training and operational technology initiatives within the national defense ecosystem.',
    icon: '/home/88a046b82458ea063910ce5d1d8298a6d317580e.webp',
    iconShape: 'narrow',
    certificate: '/about/c9cab7691bbe1d2ccce3b99a21eb2804f5057079.webp',
    certificateFocus: 'center',
  },
] as const

export const categories = [
  { slug: 'virtual-training-suite', title: 'Virtual Training Suite', hasDetailPage: true },
  { slug: 'simulation-training', title: 'Simulation Training', hasDetailPage: false },
  { slug: 'command-center', title: 'Command Center', hasDetailPage: false },
  { slug: 'advanced-education-system', title: 'Advanced Education System', hasDetailPage: false },
  { slug: 'virtual-connect-suite', title: 'Virtual Connect Suite', hasDetailPage: false },
] as const

export const virtualTrainingSuiteDetail = (media: MediaRef) => async () => ({
  hero: {
    title: 'Virtual Training Suite',
    description: 'Technology-enhanced learning environments for modern educational institutions.',
    image: await media('/solution/virtual-training-suite/hero.webp'),
    recommendedFor: ['VR Training', 'Mission Readiness', 'Operational Simulation'],
  },
  challenges: {
    eyebrow: 'The Challenges',
    title: 'Common challenges that impact readiness & mission effectiveness',
    description:
      'Modern operational environment demand more than traditional training methods. These challenges can limit performance, increase cost, & introduce unnecessary risk.',
    items: [
      {
        icon: 'downtime' as const,
        title: 'High Equipment Downtime',
        description: 'Long maintenance time leads to operational disruptions and productivity loss',
      },
      {
        icon: 'cost' as const,
        title: 'Expensive Practical Training',
        description: 'Using real equipment for training increases cost and resources consumption',
      },
      {
        icon: 'error' as const,
        title: 'Human Error & incorrect Procedures',
        description: 'Technicians may skip steps or make mistakes that can cause equipment failure',
      },
      {
        icon: 'inconsistent' as const,
        title: 'Inconsistent Procedures',
        description: 'Different technicians follow different methods and standard',
      },
    ],
  },
  showcase: {
    background: await media('/solution/virtual-training-suite/video-bg.webp'),
    tabs: [
      {
        name: 'Operational Training',
        description: 'Advanced fixed-wing simulators for pilot readiness and mission training.',
        tags: ['Defence', 'Pilot Training', 'Emergency Response', 'Operational Exercise'],
      },
      {
        name: 'Language Training',
        description:
          'Immersive scenarios that build mission-language fluency and communication confidence under pressure.',
        tags: ['Mission Language', 'Communication', 'Cross-Cultural', 'Real-time Practice'],
      },
      {
        name: 'Maintenance Training',
        description:
          'Guide technicians through complex maintenance tasks in a safe, repeatable simulated environment.',
        tags: ['Equipment', 'Repair', 'Diagnostics', 'Readiness'],
      },
      {
        name: 'VTS Editor',
        description:
          'A no-code editor to design, customize, and deploy virtual training scenarios for your organization.',
        tags: ['Scenario Builder', 'Custom Content', 'Deployment', 'Analytics'],
      },
      {
        name: 'Medical Training',
        description:
          'High-fidelity medical simulation for emergency response and clinical procedure training.',
        tags: ['Emergency Care', 'Clinical', 'Team Response', 'Debrief'],
      },
    ],
  },
  cta: {
    ...CTA_HEADER,
    eyebrow: "Let's Build Future-Ready Operations",
    background: await media('/solution/virtual-training-suite/cta.webp'),
    buttonLabel: 'Request Consultation',
    buttonHref: '/contact',
  },
})

export const products = [
  {
    slug: 'operational-training',
    title: 'Operational Training',
    summary: 'Advanced fixed-wing simulators for pilot readiness and mission training.',
    image: '/home/11741bf42ede88699c0d4a8887fb08c6bc410913.webp',
    layout: { wide: true, largeTitle: true },
  },
  {
    slug: 'language-training',
    title: 'Language Training',
    summary:
      'Immersive scenarios that build mission-language fluency and communication confidence under pressure.',
    image: '/solution/26084133901f38ffdb0a0d834e68f2abf7f01a10.webp',
    imageMobile: '/solution/9dee84aa2fba896df6a942d2c0b7360fc89fd9a0.webp',
  },
  {
    slug: 'maintenance-training',
    title: 'Maintenance Training',
    summary:
      'Guide technicians through complex maintenance tasks in a safe, repeatable simulated environment.',
    image: '/solution/10a5d1245f72bfd89f17f50606b7e7305e297729.webp',
    imageMobile: '/solution/4ea7da47e3a99f421aa2170b8f455951267d3748.webp',
  },
  {
    slug: 'troubleshooting-training',
    title: 'Troubleshooting Training',
    summary: 'Diagnose and resolve equipment faults step by step in realistic simulated scenarios.',
    image: '/solution/31deac48545172aea55a3ae044ab871699406688.webp',
    imageMobile: '/solution/ac716aeb028db0e1e31be1828a370893f3c0404b.webp',
  },
  {
    slug: 'medical-training',
    title: 'Medical Training',
    summary:
      'High-fidelity medical simulation for emergency response and clinical procedure training.',
    image: '/solution/b8fab63d7cb82402b57018a514f8d26d1348ef94-67f37a.webp',
    imageMobile: '/solution/4821fcd72c10c59a24ff708b9b0f42948420fd13.webp',
  },
] as const

// ── Pages ──────────────────────────────────────────────────────────────

export const homeLayout = async (media: MediaRef, allCertifications: number[]): Promise<Layout> => [
  {
    blockType: 'hero',
    variant: 'home',
    title: 'Train Smarter with Immersive Simulation Technology',
    description:
      'Immersive simulation systems designed to improve training effectiveness, workforce readiness, and operational performance.',
    background: await media('/home/868c1b8678b700d4c84b8c6d5a837d626c019e5d.webp'),
    buttons: [REQUEST_CONSULTATION, EXPLORE_SOLUTIONS],
    showPartners: true,
    showScrollHint: true,
  },
  {
    blockType: 'problemShowcase',
    header: {
      eyebrow: 'Traditional Training Has Limitations',
      title: 'Modern Training Demands More than Traditional Methods',
      description:
        'Modern organizations require immersive & practical training to improve readiness, safety, and operational performance.',
    },
    background: await media('/home/f10e93358df011d7fbe05934f5f037f47ad15923.webp'),
    items: [
      {
        icon: await media('/home/risk-1.svg'),
        title: 'Real-World Training Comes with Real Risks',
        description:
          'Operational training can be expensive, risky, and difficult to scale in real-world environments.',
      },
      { icon: await media('/home/risk-2.svg'), title: 'Theory Alone Is Not Enough' },
      { icon: await media('/home/risk-3.svg'), title: 'Conventional Training Limits Readiness' },
    ],
    image: await media(
      '/home/551e418bfd19a405d49ad61dcf057d03127ed7ec.webp',
      'Immersive simulation training',
    ),
  },
  {
    blockType: 'videoShowcase',
    header: {
      eyebrow: 'See Immersive Training in Action',
      title: 'Immersive Simulation Systems Built for Safer & Smarter Training',
      description:
        'Falah delivers realistic simulation that improve competency, reduce operational risk, and strengthen workforce readiness.',
    },
    background: await media('/home/88bc9a9201a3404fc882594e5ce830b89b38ea39.webp'),
    poster: await media(
      '/home/10a5d1245f72bfd89f17f50606b7e7305e297729.webp',
      'Operational training simulator',
    ),
    captionTitle: 'Operational Training',
    captionDescription: 'Advanced fixed-wing simulators for pilot readiness and mission training.',
  },
  {
    blockType: 'solutionHighlights',
    header: {
      eyebrow: 'Integrated Technologies for Modern Operations',
      title: 'Integrated Solutions for Modern Training & Operations',
      description:
        'From immersive simulation to command center, Falah delivers integrated technologies that improve operational performance.',
    },
    background: await media('/home/b9b70d4fc025e8a7a993bb8443a97e3de9688b6f.webp'),
    featured: {
      image: await media(
        '/home/11741bf42ede88699c0d4a8887fb08c6bc410913.webp',
        'Virtual Training Suite',
      ),
      title: 'Virtual Training Suite',
      description: 'Technology-enhanced learning environments for modern educational institutions.',
      tagsLabel: 'Recommended For',
      tags: ['VR Training', 'Mission Readiness', 'Operational Simulation'],
      button: { label: 'Explore Our Solutions', href: '/solution' },
    },
    items: [
      {
        image: await media(
          '/home/ad08db80f2a754576b36c904e844bb37fb2dffba.webp',
          'Training Simulator',
        ),
        title: 'Training Simulator',
        href: '/solution',
      },
      {
        image: await media('/home/de800df70f7738cb5bcc4f313676d23acdaab2a1.webp', 'Command Center'),
        title: 'Command Center',
        href: '/solution',
      },
      {
        image: await media(
          '/home/58db185d52171011b7e5d439ed214da038ed6193.webp',
          'Advanced Education Systems',
        ),
        title: 'Advanced Education Systems',
        href: '/solution',
      },
      {
        image: await media(
          '/home/3ebc014598e8a2249d2813ba3224e7bcea7058d0.webp',
          'Virtual Connect Suite',
        ),
        title: 'Virtual Connect Suite',
        href: '/solution',
      },
    ],
  },
  {
    blockType: 'expertise',
    header: {
      eyebrow: 'Built on Experience & Operational Trust',
      title: 'Trusted Expertise for Critical Training & Operations',
      description:
        'Falah combines certified standards, industry expertise, & strategic experience to deliver reliable solutions for complex environments.',
    },
    background: await media('/home/f317684d3b7a2149261ee251a36adcafe02d43ef.webp'),
    stats: [
      { value: 50, suffix: '+', label: 'Strategic Projects' },
      { value: 10, suffix: 'K+ Hour', label: 'of Immersive Training' },
      { value: 99.4, suffix: '%', label: 'Simulation Accuracy' },
      { value: 0, suffix: '', label: 'Operational Accidents' },
    ],
    cards: [
      {
        image: await media('/home/7efd48d26bc3228d5cc49dce0859d27495360778.webp'),
        icon: await media('/home/expert-1.svg'),
        title: 'Content Development',
        description: 'Developing immersive simulation systems for operational &.',
      },
      {
        image: await media('/home/2130c6305d92fa269b888e263381b3e1654ebce8.webp'),
        icon: await media('/home/expert-2.svg'),
        title: 'Software Development',
        description: 'Monitoring, communication, & control for complex environments.',
      },
      {
        image: await media('/home/ff2687bf9298ff3758774cd4688fda88e9e11151.webp'),
        icon: await media('/home/expert-3.svg'),
        title: 'IT Infrastructure Development',
        description: 'Designing interactive learning experiences that improve competency.',
      },
    ],
  },
  {
    blockType: 'certifications',
    variant: 'cards',
    header: {
      eyebrow: 'Meeting Recognized Industry Standards',
      title: 'Certified Standards for Strategic Technology Delivery',
      description:
        'Falah maintains recognized standards & compliance frameworks for reliable technology delivery across operational environments.',
    },
    background: await media('/home/d90572902ab21cd6375c061e1d9f1ea77a5ab7aa.webp'),
    items: allCertifications,
  },
  {
    blockType: 'faq',
    header: {
      eyebrow: 'Answers Before You Get Started',
      title: 'Frequently Asked Questions About Falah Solutions',
      description:
        'Explore common questions about Falah’s immersive simulation systems, operational technologies, and capabilities.',
    },
    background: await media('/home/8462b075f5d2d273d27811df43b5d96ef5ae81ea.webp'),
    items: [
      {
        question: 'What industries does Falah support?',
        answer:
          'Falah supports government, defense, education, and enterprise sectors with simulation training, operational technology, and digital transformation solutions.',
      },
      {
        question: 'Can Falah develop customized simulation systems?',
        answer:
          'Yes. Falah develops customized simulation environments tailored to specific operational, training, and organizational requirements.',
      },
      {
        question: 'Are Falah’s solutions suitable for government and defense environments?',
        answer:
          'Yes. Falah’s solutions are built for secure, mission-critical environments and follow recognized quality and compliance standards.',
      },
      {
        question: 'Does Falah provide implementation and operational support?',
        answer:
          'Yes. Falah provides end-to-end implementation, integration, and ongoing operational support for its simulation and technology solutions.',
      },
      {
        question: 'What types of simulation solutions does Falah provide?',
        answer:
          'Falah provides immersive training simulators, command center solutions, advanced education systems, and virtual connectivity suites.',
      },
      {
        question: 'Can Falah integrate solutions with existing infrastructure?',
        answer:
          'Yes. Falah’s solutions are designed to integrate with existing infrastructure, systems, and operational workflows.',
      },
    ],
  },
  {
    blockType: 'cta',
    variant: 'withMedia',
    header: CTA_HEADER,
    background: await media('/home/72d60c1716d38f195a043cdb8338d0f47aa472c0.webp'),
    buttons: [REQUEST_CONSULTATION, EXPLORE_SOLUTIONS],
    media: await media(
      '/home/5867d85722b9f8d86edcabe75587f140fb96fa57-3dfac4.webp',
      'Falah company video',
    ),
  },
]

const simpleCta = async (media: MediaRef): Promise<Layout[number]> => ({
  blockType: 'cta',
  variant: 'simple',
  header: { ...CTA_HEADER, eyebrow: "Let's Build Future-Ready Operations" },
  background: await media('/solution/536c926b92d74639805de8330a5501663a76d0d7-664780.webp'),
  backgroundMobile: await media('/solution/8ccf2a3a61e7241ef0a8fb2961008038f4a63929-3fbf2b.webp'),
  buttons: [REQUEST_CONSULTATION],
})

export const aboutLayout = async (
  media: MediaRef,
  allCertifications: number[],
  partnerRows: { rowOne: number[]; rowTwo: number[] },
): Promise<Layout> => [
  {
    blockType: 'hero',
    variant: 'centered',
    eyebrow: 'The Experts Behind The Technology',
    title: 'Building Technology for Training, Operations, & Readiness',
    description:
      'Falah develops simulation systems & immersive technologies that improve operational coordination, & learning effectiveness.',
    background: await media('/about/bf1ed1e0b4f868ae7481d5e53d6a26ccc375531e.webp'),
    showCertificates: true,
    showScrollHint: true,
  },
  {
    blockType: 'featureGrid',
    variant: 'cards',
    header: {
      eyebrow: 'Who Are We',
      title: 'Building Technology for Immersive Operations',
      description:
        'Falah Inovasi Teknologi develops simulation systems & immersive technologies that improve training, coordination, & performance.',
    },
    background: await media('/about/290b04bd2a8f7fda66ebe7370810301cbd995810-6fcce1.webp'),
    items: [
      {
        icon: await media('/about/icon-business.svg'),
        title: 'Our Business',
        description:
          'Transform our client ideas into successful solutions that meet their needs & contribute to their business success',
      },
      {
        icon: await media('/about/icon-methods.svg'),
        title: 'Our Methods',
        description:
          'We use an agile methodology that includes collaboratives, flexible, & creative cooperation in a short iterative process',
      },
      {
        icon: await media('/about/icon-commitment.svg'),
        title: 'Our Commitment',
        description:
          'We are committed to creating systems that are easy to use, state-of-the-art, & sustainable, supported by the latest technology, experts, & a professional team',
      },
    ],
  },
  {
    blockType: 'featureGrid',
    variant: 'values',
    header: {
      eyebrow: 'What Drives Us',
      title: 'Building Technology with Purpose & Precision',
      description:
        'Falah combines innovation, expertise, & integrity to deliver immersive technology solutions with long-term impact.',
    },
    background: await media('/about/c5440e092c233b2f9f1a7044d5ece07956df808d-5acc61.webp'),
    backgroundOverlay: await media('/about/80ce5cf49766f874a9a45ff8d443f8a3aa2513c8-7b1b15.webp'),
    quote: 'The Best Innovative Technology Company',
    items: [
      {
        icon: await media('/about/icon-drive-1.svg'),
        title: 'Trusted Partnership',
        description: 'Treat our Clients and Partners with trust, responsibility and respect.',
      },
      {
        icon: await media('/about/icon-drive-2.svg'),
        title: 'Professional Excellence',
        description: 'Build a professional team with extensive knowledge and experience.',
      },
      {
        icon: await media('/about/icon-drive-3.svg'),
        title: 'Advanced technology',
        description: 'Provide outstanding technology infrastructures, services, & solutions.',
      },
      {
        icon: await media('/about/icon-drive-4.svg'),
        title: 'Strategic Company Growth',
        description: 'Establish strategic partnership that drive sustainable innovation & growth.',
      },
    ],
  },
  {
    blockType: 'leadership',
    header: {
      eyebrow: 'Leadership',
      title: 'The Minds Behind Falah Innovation',
      description:
        'Led by experienced professionals, Falah builds future-ready operational solutions through innovation & collaboration.',
    },
    background: await media('/about/f317684d3b7a2149261ee251a36adcafe02d43ef-64dd8f.webp'),
    leaders: [
      {
        photo: await media(
          '/about/273b63f017554210d7990d10b7f6b9d97d942f01.webp',
          'Deni Darodjat Muslim',
        ),
        name: 'Deni Darodjat Muslim',
        roles: ['Founder', 'CEO', 'CTO'],
      },
      {
        photo: await media('/about/1886979d0a47fbfc8d020861c4428a50b1f8ccdf.webp', 'Noviayana'),
        name: 'Noviayana',
        roles: ['CFO'],
        bio: 'Noviayana drives organizational transformation, financial strategy, and sustainable growth through agile and operationally focused leadership.',
      },
      {
        photo: await media(
          '/about/353100947f3ac0575f41b54ba9fa1999fbc43b07.webp',
          'Canggih Sakina Hans',
        ),
        name: 'Canggih Sakina Hans',
        roles: ['COO'],
        bio: 'Canggih specializes in operational excellence, strategic planning, and scalable execution across complex organizational environments.',
      },
      {
        photo: await media('/about/bdf254a764729c53871d83da62a81283acacf239.webp', 'Auriga Sain'),
        name: 'Auriga Sain',
        roles: ['CBDO'],
        bio: 'Auriga focuses on strategic partnerships, business development, and market expansion to strengthen long-term organizational growth.',
      },
    ],
  },
  {
    blockType: 'teamStats',
    header: {
      eyebrow: 'Our Experts',
      title: 'A Multidisciplinary Team Behind\nEvery Operational Solution',
      description:
        'Falah combines immersive technologies & integrated systems to deliver scalable solutions for modern operations.',
    },
    background: await media('/about/6868a17e6f68dfdcc8115fb3554d8cd74ee2fbd6-617b48.webp'),
    items: [
      { label: 'Management Team', value: 55, suffix: '+' },
      { label: 'Software Development Team', value: 45, suffix: '+' },
      { label: 'Content Development Team', value: 45, suffix: '+' },
      { label: 'IT Infrastructure Team', value: 15, suffix: '+' },
    ],
  },
  {
    blockType: 'partners',
    header: {
      eyebrow: 'Trusted Across Critical Industries',
      title: 'Trusted by Government, Defense, Education, and Enterprise Institutions',
      description:
        'Trusted to deliver simulation, training, and operational technology solutions for modern organizations.',
    },
    rowOne: partnerRows.rowOne,
    rowTwo: partnerRows.rowTwo,
  },
  {
    blockType: 'certifications',
    variant: 'gallery',
    header: {
      eyebrow: 'Meeting Recognized Industry Standards',
      title: 'Certified Standards for Strategic Technology Delivery',
      description:
        'Falah maintains recognized standards & compliance frameworks for reliable technology delivery across operational environments.',
    },
    background: await media('/about/b803afd761809dc0f0f44924cec0a407982bee62-70b324.webp'),
    items: allCertifications,
  },
  await simpleCta(media),
]

export const solutionLayout = async (media: MediaRef): Promise<Layout> => [
  {
    blockType: 'hero',
    variant: 'page',
    eyebrow: 'Our Solutions',
    title: 'Integrated Technologies Built for Operational Excellence',
    description:
      'From immersive simulation to command center, Falah delivers integrated technologies that improve operational performance.',
    background: await media('/solution/a3e9fd7c8037cc3eaa6de2d66792d6cbd68c9b04.webp'),
    backgroundMobile: await media('/solution/e6c66a219b1b4f6a8bed5e70329f8673d0f94271-656c70.webp'),
    buttons: [REQUEST_CONSULTATION],
    showScrollHint: true,
  },
  {
    blockType: 'solutionOverview',
    header: {
      eyebrow: 'Solution Overview',
      title: 'Integrated Solutions for Modern Operations',
      description:
        'Explore operational ecosystems designed to support simulation, training, collaboration, and infrastructure management.',
    },
    background: await media('/solution/b803afd761809dc0f0f44924cec0a407982bee62.webp'),
  },
  await simpleCta(media),
]

export const contactLayout = async (media: MediaRef): Promise<Layout> => [
  {
    blockType: 'contactForm',
    eyebrow: 'Contact Us',
    title: 'Let’s Build Future-Ready Operations Together',
    titleMobile: 'Let’s Discuss Your Training Needs',
    description:
      'Discuss your operational challenges, training initiatives, or technology needs with the Falah team.',
    descriptionMobile:
      'Share your project requirements, operational challenges, or technology initiatives with the Falah team.',
    background: await media('/home/97a64a5c4d3dc933755b867e9e23776073c427e5.webp'),
    submitLabel: 'Request Consultation',
    responseNote: 'Response within 1–2 business days.',
    interestOptions: ['Immersive Simulation', ...categories.map((c) => c.title)],
    whatsappText: 'Need immediate assistance?\nChat with our team via Whatsapp',
    successMessage: 'Thank you! Our team will contact you within 1–2 business days.',
  },
  {
    blockType: 'workflow',
    header: {
      eyebrow: 'Our Workflow',
      title: 'How it works?',
      description:
        'Falah combines immersive technologies & integrated systems to deliver scalable solutions for modern operations.',
    },
    // Placeholder copy carried over from the Figma file — replace in the CMS.
    steps: Array.from({ length: 6 }, () => ({
      title: 'Payment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    })),
  },
  {
    blockType: 'officeMap',
    header: {
      eyebrow: 'Office & Operational Presence',
      title: 'Built From a Collaborative Technology Environment',
      description:
        'Falah operates from a collaborative operational-tech environment designed to support innovation & strategic technology initiatives.',
    },
    background: await media('/solution/8ccf2a3a61e7241ef0a8fb2961008038f4a63929-3fbf2b.webp'),
  },
]

// ── Globals ────────────────────────────────────────────────────────────

const SOLUTION_LINKS = [
  { label: 'Virtual Training Suite', href: '/solution/virtual-training-suite' },
  { label: 'Training Simulators', href: '/solution' },
  { label: 'Advanced Education System', href: '/solution' },
  { label: 'Integrated Operations Center', href: '/solution' },
  { label: 'Cyber Defense Solutions', href: '/solution' },
  { label: 'Cyber Defense Training Solutions', href: '/solution' },
  { label: 'Digital Workplace Solutions', href: '/solution' },
  { label: 'Logistics Management Solution', href: '/solution' },
]

type SocialPlatform = NonNullable<NonNullable<SiteSetting['socials']>[number]['platform']>

export const siteSettings = async (media: MediaRef) => ({
  siteName: 'Falah Inovasi Teknologi',
  siteDescription:
    'Simulation, training, and operational technology solutions for modern organizations.',
  logo: await media(
    '/home/4f0e49a6e733d436853e5c48772d58ef1c454c51.webp',
    'Falah Inovasi Teknologi',
  ),
  contact: {
    address:
      'Jl. Mampang Prapatan XII Kel No.1, RT.8/RW.1, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790',
    shortAddress: 'Jl. Mampang Prapatan XII, No.1,\nJakarta, 12790',
    email: 'business@falahtech.co.id',
    phone: '021 2696 1651',
  },
  socials: [
    { platform: 'facebook', label: 'Facebook', url: '#' },
    { platform: 'instagram', label: 'Instagram', url: '#' },
    { platform: 'linkedin', label: 'LinkedIn', url: '#' },
    { platform: 'tiktok', label: 'TikTok', url: '#' },
    { platform: 'youtube', label: 'YouTube', url: '#' },
  ] satisfies { platform: SocialPlatform; label: string; url: string }[],
})

export const navigation = async (media: MediaRef) => ({
  solutionsLabel: 'Our Solutions',
  solutionLinks: [
    { label: 'Simulation Training Solution', href: '/solution' },
    { label: 'Advanced Education System Solution', href: '/solution', highlight: true },
    { label: 'Command Center Solution', href: '/solution' },
    { label: 'Virtual Training Suites Solution', href: '/solution/virtual-training-suite' },
    { label: 'Virtual Connect Suites Solution', href: '/solution' },
  ],
  featured: {
    title: 'Smart Campus Enterprise',
    description: 'Digital learning infrastructure for modern educational institutions',
    image: await media('/solution/megamenu/featured-2dd562.webp'),
    href: '/solution',
  },
  cards: [
    {
      title: 'Education & Training',
      description: 'Immersive simulation for classrooms and institutional learning',
      image: await media('/solution/megamenu/education-5c3cd6.webp'),
      href: '/solution',
    },
    {
      title: 'Enterprise Command Center',
      description: 'Unified operations for mission-critical command environments',
      image: await media('/solution/megamenu/classroom-376645.webp'),
      href: '/solution',
    },
  ],
  links: [
    { label: 'About', href: '/about' },
    // Placeholder from Figma (empty instance) — point it somewhere real later.
    { label: 'Press Release', href: '#' },
  ],
  cta: { label: 'Contact Us', href: '/contact' },
})

export const footer = {
  description:
    'Immersive simulation and operational technology solutions for government, defense, education, and enterprise sectors.',
  columns: [
    { title: 'Solution', links: SOLUTION_LINKS },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Press Release', href: '#' },
      ],
    },
  ],
  copyright: '© {year} Falah Inovasi Teknologi | All Right Reserved',
}
