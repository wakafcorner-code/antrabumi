/**
 * src/types/home-content.ts
 * Types and defaults for all editable Homepage Sections (CRUD in /admin/beranda).
 */

export interface TimelineItem {
  year: string;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface PillarContentItem {
  id: string;
  key: string;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface FrameworkStepItem {
  step: string;
  title: string;
  desc: string;
  descEn?: string;
}

export interface HomeSectionsContent {
  // 01 — MENGAPA KAMI HADIR
  whyUs: {
    badge: string;
    badgeEn?: string;
    title: string;
    titleEn?: string;
    leadText: string;
    leadTextEn?: string;
    bridgeTitle: string;
    bridgeTitleEn?: string;
    bridgeText: string;
    bridgeTextEn?: string;
    imageUrl?: string;
  };

  // 02 — TENTANG ANTRABUMI
  about: {
    badge: string;
    badgeEn?: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    secondaryText: string;
    secondaryTextEn?: string;
    diagramUrl?: string;
  };

  // TIGA PILAR UTAMA
  pillars: PillarContentItem[];

  // 03 — BAGAIMANA KAMI BERTUMBUH (PERJALANAN KAMI)
  growth: {
    badge: string;
    badgeEn?: string;
    title: string;
    titleEn?: string;
    leadText: string;
    leadTextEn?: string;
    timeline: TimelineItem[];
  };

  // 04 — CARA KAMI BEKERJA (OUR FRAMEWORK & GEDSI)
  framework: {
    badge: string;
    badgeEn?: string;
    title: string;
    titleEn?: string;
    leadText: string;
    leadTextEn?: string;
    steps: FrameworkStepItem[];
    gedsiTitle: string;
    gedsiTitleEn?: string;
    gedsiText: string;
    gedsiTextEn?: string;
  };

  // CTA / AJAKAN KOLABORASI
  cta: {
    badge: string;
    badgeEn?: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    primaryButtonText: string;
    primaryButtonTextEn?: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonTextEn?: string;
    secondaryButtonLink: string;
  };
}

export const DEFAULT_HOME_CONTENT: HomeSectionsContent = {
  whyUs: {
    badge: "01 — MENGAPA KAMI HADIR",
    badgeEn: "01 — WHY WE EXIST",
    title: "Perubahan yang berarti lahir ketika pengetahuan, alam, dan masyarakat saling terhubung.",
    titleEn: "Change becomes meaningful when knowledge, nature, and communities are connected.",
    leadText:
      "Indonesia memiliki kekayaan alam, pengetahuan lokal, dan masyarakat yang terus mencari cara untuk beradaptasi. Namun, berbagai tantangan lingkungan dan pembangunan masih sering ditangani secara terpisah.\n\nPengetahuan tidak selalu menjadi aksi. Pengalaman di lapangan belum selalu menjadi pembelajaran. Dan solusi tidak selalu tumbuh bersama mereka yang akan menjalaninya.",
    leadTextEn:
      "Indonesia possesses rich nature, local knowledge, and communities continuously seeking ways to adapt. However, environmental and developmental challenges are still often addressed in silos.\n\nKnowledge does not always translate into action. Field experiences do not always become learning. And solutions do not always grow with those who will live them.",
    bridgeTitle: "ANTRABUMI Hadir untuk menjembatani ruang tersebut.",
    bridgeTitleEn: "ANTRABUMI Exists to Bridge That Space.",
    bridgeText:
      "Kami menghubungkan riset, pengalaman, pengetahuan lokal, dan kolaborasi untuk memahami persoalan, mengembangkan solusi, dan mendukung perubahan yang relevan bagi manusia dan alam.",
    bridgeTextEn:
      "We connect research, field experience, local knowledge, and cross-sector collaboration to understand issues holistically, develop contextual solutions, and support meaningful change for people and nature.",
    imageUrl: "/images/home/bridge-diagram.svg",
  },

  about: {
    badge: "02 — TENTANG ANTRABUMI",
    badgeEn: "02 — ABOUT ANTRABUMI",
    title: "Menghubungkan pengetahuan menjadi aksi, dan kolaborasi menjadi perubahan.",
    titleEn: "Connecting knowledge into action, and collaboration into change.",
    description:
      "ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan masyarakat. Kami mempertemukan pengalaman lapangan, riset, pengetahuan lokal, dan berbagai perspektif untuk memahami persoalan secara lebih utuh dan mengembangkan pendekatan yang kontekstual.",
    descriptionEn:
      "ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities. We bring together field experience, research, local knowledge, and diverse perspectives to understand challenges holistically and develop contextual approaches.",
    secondaryText:
      "Kami bekerja bersama komunitas, pemerintah, akademisi, organisasi masyarakat sipil, sektor swasta, dan mitra pembangunan untuk membangun perubahan yang lebih terhubung dan berkelanjutan.",
    secondaryTextEn:
      "We collaborate with communities, government, academia, civil society, the private sector, and development partners to foster more connected and sustainable change.",
    diagramUrl: "/images/home/pillars-diagram.svg",
  },

  pillars: [
    {
      id: "01",
      key: "KNOWLEDGE",
      label: "Pengetahuan",
      labelEn: "Knowledge",
      description:
        "Riset, pembelajaran dari lapangan, dan integrasi pengetahuan lokal untuk melahirkan pendekatan yang kontekstual dan bermakna.",
      descriptionEn:
        "Research, field learning, and integration of local knowledge to produce contextual and meaningful approaches.",
    },
    {
      id: "02",
      key: "NATURE",
      label: "Alam",
      labelEn: "Nature",
      description:
        "Konservasi, keberlanjutan ekologis, dan mitigasi iklim yang berbasiskan pemahaman ekosistem nyata di lapangan.",
      descriptionEn:
        "Conservation, ecological sustainability, and climate mitigation grounded in real ecosystem understanding from the field.",
    },
    {
      id: "03",
      key: "COMMUNITIES",
      label: "Masyarakat / Komunitas",
      labelEn: "Communities",
      description:
        "Pengembangan komunitas, inklusi sosial (GEDSI), dan kemitraan kolaboratif lintas sektor yang berpijak pada konteks lokal.",
      descriptionEn:
        "Community development, social inclusion (GEDSI), and collaborative cross-sector partnerships rooted in local context.",
    },
  ],

  growth: {
    badge: "03 — BAGAIMANA KAMI BERTUMBUH",
    badgeEn: "03 — HOW WE GROW",
    title: "Setiap langkah memperluas pengalaman. Setiap pengalaman membentuk cara kami bekerja.",
    titleEn: "Every step expands experience. Every experience shapes how we work.",
    leadText:
      "ANTRABUMI tumbuh dari perjalanan yang dimulai pada tahun 2021. Berbagai pengalaman di lapangan, kolaborasi lintas sektor, dan proses belajar bersama menjadi fondasi yang membentuk identitas organisasi ini.\n\nHari ini, perjalanan tersebut terus berlanjut melalui ANTRABUMI sebagai ruang kolaborasi yang menghubungkan pengetahuan, alam, dan masyarakat untuk menciptakan perubahan yang relevan dan berkelanjutan.",
    leadTextEn:
      "ANTRABUMI grew from a journey that began in 2021. Diverse field experiences, cross-sector collaborations, and mutual learning have become the foundation shaping this organization's identity.",
    timeline: [
      {
        year: "2021",
        label: "Awal Perjalanan",
        labelEn: "The Beginning",
        description:
          "PT Antar Bumi Sahawahita didirikan sebagai awal perjalanan membangun pengalaman dan kolaborasi di bidang lingkungan dan pembangunan berkelanjutan.",
        descriptionEn:
          "PT Antar Bumi Sahawahita was established as the beginning of building field experience and collaboration.",
      },
      {
        year: "2022",
        label: "Belajar dari Lapangan",
        labelEn: "Learning from the Field",
        description:
          "Memperluas pengalaman melalui penelitian, pendampingan masyarakat, dan berbagai inisiatif konservasi di lapangan.",
        descriptionEn:
          "Expanding experience through research, community mentoring, and grassroots conservation initiatives.",
      },
      {
        year: "2023",
        label: "Memperluas Kolaborasi",
        labelEn: "Expanding Collaboration",
        description:
          "Membangun kolaborasi bersama komunitas, pemerintah, akademisi, sektor swasta, dan organisasi masyarakat sipil.",
        descriptionEn:
          "Forging collaborations with communities, government, academia, private sector, and civil society.",
      },
      {
        year: "2024",
        label: "Memperkuat Pendekatan",
        labelEn: "Strengthening Our Approach",
        description:
          "Memperkuat pendekatan yang menghubungkan pengetahuan, konservasi, dan pengembangan masyarakat dalam berbagai program.",
        descriptionEn:
          "Strengthening methodologies that connect knowledge, conservation, and community development across programs.",
      },
      {
        year: "2025",
        label: "Membentuk Identitas",
        labelEn: "Forming an Identity",
        description:
          "Menyatukan pengalaman dan jejaring sebagai fondasi lahirnya identitas ANTRABUMI.",
        descriptionEn:
          "Consolidating field experiences and networks as the foundation of the ANTRABUMI identity.",
      },
      {
        year: "2026",
        label: "A New Chapter",
        labelEn: "A New Chapter",
        description:
          "ANTRABUMI diperkenalkan sebagai institusi yang menghubungkan pengetahuan, alam, dan masyarakat melalui kolaborasi yang lebih luas.",
        descriptionEn:
          "ANTRABUMI is introduced as an institution connecting knowledge, nature, and communities through wider collaboration.",
      },
    ],
  },

  framework: {
    badge: "04 — CARA KAMI BEKERJA",
    badgeEn: "04 — HOW WE WORK",
    title: "Setiap kolaborasi dimulai dengan memahami konteks, bukan menawarkan solusi.",
    titleEn: "Every collaboration begins with understanding context, not offering solutions.",
    leadText:
      "ANTRABUMI menghubungkan berbagai pihak untuk merancang solusi yang relevan dengan kebutuhan di lapangan. Kami percaya bahwa perubahan yang bertahan dibangun melalui proses yang terbuka, kolaboratif, dan terus belajar dari setiap pengalaman.",
    leadTextEn:
      "ANTRABUMI connects diverse stakeholders to design solutions relevant to on-the-ground needs. We believe enduring change is built through open, collaborative processes.",
    steps: [
      {
        step: "01",
        title: "LISTEN",
        desc: "Memahami konteks dan mendengarkan kebutuhan lapangan sebelum menawarkan solusi.",
        descEn: "Understanding context and listening to grassroots needs before offering solutions.",
      },
      {
        step: "02",
        title: "CONNECT",
        desc: "Menghubungkan perspektif yang beragam, pengetahuan lokal, dan bukti riset ilmiah.",
        descEn: "Connecting diverse perspectives, local wisdom, and scientific research evidence.",
      },
      {
        step: "03",
        title: "CO-CREATE",
        desc: "Merancang pendekatan dan solusi bersama komunitas serta pemangku kepentingan terkait.",
        descEn: "Designing approaches and solutions collaboratively with communities and stakeholders.",
      },
      {
        step: "04",
        title: "ACT",
        desc: "Menjalankan program dan inisiatif nyata secara kontekstual dan bertanggung jawab.",
        descEn: "Executing real programs and contextual initiatives responsibly on the ground.",
      },
      {
        step: "05",
        title: "LEARN",
        desc: "Mendokumentasikan, merefleksikan, dan mengintegrasikan pembelajaran untuk keberlanjutan.",
        descEn: "Documenting, reflecting on, and integrating lessons learned for long-term sustainability.",
      },
    ],
    gedsiTitle: "GEDSI sebagai Pendekatan",
    gedsiTitleEn: "GEDSI as an Approach",
    gedsiText:
      "Gender Equality, Disability and Social Inclusion (GEDSI) menjadi bagian dari cara kami memahami konteks, melibatkan masyarakat, dan merancang solusi. Kami memastikan keberagaman perspektif, pengalaman, akses, dan kebutuhan menjadi bagian dari proses dan pengambilan keputusan.",
    gedsiTextEn:
      "Gender Equality, Disability and Social Inclusion (GEDSI) is integral to how we understand context, engage communities, and design solutions. We ensure diverse perspectives, accessibility, and needs inform every decision.",
  },

  cta: {
    badge: "KOLABORASI & KEMITRAAN",
    badgeEn: "COLLABORATION & PARTNERSHIP",
    title: "Mari Terhubung & Berkolaborasi untuk Perubahan Nyata.",
    titleEn: "Let's Connect & Collaborate for Meaningful Change.",
    description:
      "ANTRABUMI membuka ruang kolaborasi lintas sektor bersama komunitas, akademisi, pemerintah, lembaga swadaya, dan mitra pembangunan.",
    descriptionEn:
      "ANTRABUMI welcomes cross-sector collaboration with communities, academia, government, civil society, and development partners.",
    primaryButtonText: "Mulai Kolaborasi",
    primaryButtonTextEn: "Start Collaborating",
    primaryButtonLink: "/kolaborasi#kontak",
    secondaryButtonText: "Pelajari Lebih Lanjut",
    secondaryButtonTextEn: "Learn More",
    secondaryButtonLink: "/tentang",
  },
};
