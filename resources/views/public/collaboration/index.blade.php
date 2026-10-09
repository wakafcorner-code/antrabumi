@extends('layouts.app')

@section('title', $isEnglish ? 'Collaboration with ANTRABUMI' : 'Ruang Kolaborasi — ANTRABUMI')
@section('description', $isEnglish ? 'Build grounded projects, research, and associate networks with ANTRABUMI.' : 'Kembangkan proyek, riset, dan jaringan associate bersama ANTRABUMI.')
@section('canonical', url('/kolaborasi'))
@section('og_title', $isEnglish ? 'Collaboration with ANTRABUMI' : 'Ruang Kolaborasi — ANTRABUMI')
@section('og_description', $isEnglish ? 'Build grounded projects, research, and associate networks with ANTRABUMI.' : 'Kembangkan proyek, riset, dan jaringan associate bersama ANTRABUMI.')

@section('content')
@php
    $collaborationSpaces = $isEnglish ? [
        [
            'number' => '01',
            'eyebrow' => 'Organizations & Institutions',
            'title' => 'Project & Research Collaboration',
            'description' => 'For organizations, institutions, communities, government, academia, companies, or development partners with an issue, idea, research, or program to work on together.',
            'tags' => ['ESG & Climate', 'Community Assessment', 'Research & Policy'],
            'link' => 'Discuss a Project',
            'icon' => '↗',
            'tone' => 'teal',
        ],
        [
            'number' => '02',
            'eyebrow' => 'Individuals & Experts',
            'title' => 'Join the ANTRABUMI Network',
            'description' => 'For individuals with experience, expertise, knowledge, or perspectives to contribute to ANTRABUMI as part of a multidisciplinary associate network.',
            'tags' => ['Field Researchers', 'Facilitators & Storytellers', 'Thematic Experts'],
            'link' => 'Join the Network',
            'icon' => '✦',
            'tone' => 'orange',
        ],
    ] : [
        [
            'number' => '01',
            'eyebrow' => 'Organisasi & Lembaga',
            'title' => 'Kolaborasi Proyek & Riset',
            'description' => 'Untuk organisasi, institusi, komunitas, pemerintah, akademisi, perusahaan, atau mitra pembangunan yang memiliki persoalan, gagasan, riset, atau program yang ingin dikerjakan bersama.',
            'tags' => ['ESG & Iklim', 'Asesmen Komunitas', 'Riset & Kebijakan'],
            'link' => 'Diskusikan Proyek',
            'icon' => '↗',
            'tone' => 'teal',
        ],
        [
            'number' => '02',
            'eyebrow' => 'Individu & Pakar',
            'title' => 'Bergabung ke Jaringan ANTRABUMI',
            'description' => 'Untuk individu dengan pengalaman, keahlian, pengetahuan, atau perspektif yang ingin berkontribusi dalam pekerjaan ANTRABUMI sebagai bagian dari jaringan associate multidisiplin.',
            'tags' => ['Peneliti Lapangan', 'Fasilitator & Cerita', 'Pakar Tematik'],
            'link' => 'Bergabung ke Jaringan',
            'icon' => '✦',
            'tone' => 'orange',
        ],
    ];
    $collaborationAreas = $isEnglish ? [
        ['title' => 'ESG & Sustainability', 'description' => 'Sustainability strategies, assessments, and approaches grounded in context.'],
        ['title' => 'Community Engagement', 'description' => 'Participatory approaches to understand and work alongside communities.'],
        ['title' => 'Nature-based Solutions', 'description' => 'Approaches connecting ecosystems, resilience, and human needs.'],
        ['title' => 'Research Partnership', 'description' => 'Research, assessment, data, and knowledge translated into decisions.'],
        ['title' => 'Capacity Strengthening', 'description' => 'Capacity building rooted in real needs and practice.'],
        ['title' => 'Knowledge & Storytelling', 'description' => 'Turning knowledge and experience into stories people can understand and use.'],
    ] : [
        ['title' => 'ESG & Keberlanjutan', 'description' => 'Strategi, asesmen, dan pendekatan keberlanjutan yang terhubung dengan konteks.'],
        ['title' => 'Pelibatan Masyarakat', 'description' => 'Pendekatan partisipatif untuk memahami dan bekerja bersama masyarakat.'],
        ['title' => 'Solusi Berbasis Alam', 'description' => 'Pendekatan yang menghubungkan ekosistem, ketahanan, dan kebutuhan manusia.'],
        ['title' => 'Kemitraan Riset', 'description' => 'Riset, asesmen, data, dan penerjemahan pengetahuan untuk pengambilan keputusan.'],
        ['title' => 'Penguatan Kapasitas', 'description' => 'Penguatan kapasitas yang berangkat dari kebutuhan nyata dan praktik.'],
        ['title' => 'Pengetahuan & Penceritaan', 'description' => 'Membawa pengetahuan dan pengalaman menjadi cerita yang dapat dipahami dan digunakan.'],
    ];
    $workingSteps = $isEnglish ? [
        ['title' => 'Listen', 'description' => 'Understand the context, needs, and voices of everyone involved.'],
        ['title' => 'Connect', 'description' => 'Bring together relevant perspectives, knowledge, capacity, and networks.'],
        ['title' => 'Co-create', 'description' => 'Design approaches and solutions together, not from one side alone.'],
        ['title' => 'Act', 'description' => 'Turn shared commitments into practical steps and learning.'],
        ['title' => 'Learn', 'description' => 'Use experience to improve approaches and build shared learning.'],
    ] : [
        ['title' => 'Dengarkan', 'description' => 'Memahami konteks, kebutuhan, dan suara dari pihak-pihak yang terlibat.'],
        ['title' => 'Hubungkan', 'description' => 'Mempertemukan perspektif, pengetahuan, kapasitas, dan jejaring yang relevan.'],
        ['title' => 'Ciptakan Bersama', 'description' => 'Merancang pendekatan dan solusi bersama, bukan dari satu sisi saja.'],
        ['title' => 'Bertindak', 'description' => 'Menerjemahkan kesepakatan menjadi langkah nyata dan dapat dipelajari.'],
        ['title' => 'Belajar', 'description' => 'Menggunakan pengalaman untuk memperbaiki pendekatan dan membangun pembelajaran.'],
    ];
    $networkSectors = $isEnglish ? [
        ['icon' => '👥', 'title' => 'Local & Indigenous Communities', 'description' => 'Building contextual solutions from local wisdom, field practice, and active participation.'],
        ['icon' => '🏛️', 'title' => 'Government & Policymakers', 'description' => 'Connecting field evidence with policy recommendations to strengthen regional planning.'],
        ['icon' => '🔬', 'title' => 'Academia & Researchers', 'description' => 'Translating scientific studies and multidisciplinary research into field action.'],
        ['icon' => '🌱', 'title' => 'Civil Society & NGOs', 'description' => 'Strengthening collective action and learning in conservation and GEDSI advocacy.'],
        ['icon' => '🏢', 'title' => 'Private Sector & Industry', 'description' => 'Developing ESG roadmaps, responsible supply chains, and nature-based solutions.'],
        ['icon' => '🤝', 'title' => 'Development Partners & Donors', 'description' => 'Designing and delivering measurable, impactful programs rooted in communities.'],
    ] : [
        ['icon' => '👥', 'title' => 'Komunitas Lokal & Adat', 'description' => 'Membangun solusi kontekstual berbasis kearifan lokal, praktik lapangan, dan pelibatan aktif.'],
        ['icon' => '🏛️', 'title' => 'Pemerintah & Pembuat Kebijakan', 'description' => 'Menghubungkan bukti lapangan dengan rekomendasi kebijakan untuk memperkuat perencanaan wilayah.'],
        ['icon' => '🔬', 'title' => 'Akademisi & Peneliti', 'description' => 'Menerjemahkan kajian ilmiah dan riset multi-disiplin menjadi aksi nyata di lapangan.'],
        ['icon' => '🌱', 'title' => 'Masyarakat Sipil & NGO', 'description' => 'Memperkuat aksi bersama dan pembelajaran kolektif dalam advokasi konservasi dan GEDSI.'],
        ['icon' => '🏢', 'title' => 'Sektor Swasta & Industri', 'description' => 'Mengembangkan peta jalan ESG, rantai pasok bertanggung jawab, dan solusi berbasis alam.'],
        ['icon' => '🤝', 'title' => 'Mitra Pembangunan & Donor', 'description' => 'Merancang dan mengeksekusi program intervensi yang terukur, berdampak, dan berakar pada masyarakat.'],
    ];
@endphp
<div class="bg-white">
    @if($errors->any())
        <div role="alert" aria-live="assertive" class="mx-auto mt-6 w-full max-w-[980px] rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            <p class="font-semibold">{{ $isEnglish ? 'Please review the information below.' : 'Periksa kembali informasi yang Anda kirim.' }}</p>
            <ul class="mt-2 list-disc space-y-1 pl-5">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <section class="relative isolate overflow-hidden border-b border-neutral-100 bg-[#071A16] py-16 text-white sm:py-24 lg:py-28">
        <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-20 h-96 w-96 rounded-full bg-[#0D5C4D]/45 blur-3xl"></div>
        <div aria-hidden="true" class="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-[#D96B27]/15 blur-3xl"></div>
        <div class="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 md:px-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-16 lg:px-10">
            <div class="max-w-3xl">
                <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#E5A823]">
                    <span class="h-1.5 w-1.5 rounded-full bg-[#E5A823]"></span>
                    {{ $isEnglish ? 'COLLABORATION SPACE' : 'RUANG KOLABORASI' }}
                </p>
                <h1 class="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                    {{ $isEnglish ? 'Change is never built alone.' : 'Perubahan tidak pernah dibangun sendirian.' }}
                </h1>
                <p class="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                    {{ $isEnglish ? 'ANTRABUMI works with organizations, communities, researchers, and individuals who have an issue, knowledge, or idea they want to develop into meaningful impact.' : 'ANTRABUMI bekerja bersama organisasi, komunitas, peneliti, dan individu yang memiliki persoalan, pengetahuan, atau gagasan yang ingin dikembangkan menjadi dampak nyata.' }}
                </p>
                <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a href="#formulir" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0D5C4D] px-6 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#147A66] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A823]">
                        {{ $isEnglish ? 'Start a Project Discussion' : 'Mulai Diskusi Proyek' }} <span aria-hidden="true">→</span>
                    </a>
                    <a href="#formulir" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#E5A823]/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A823]">
                        {{ $isEnglish ? 'Join the Associate Network' : 'Gabung Jaringan Associate' }} <span aria-hidden="true" class="text-[#E5A823]">✦</span>
                    </a>
                </div>
            </div>
            <div class="relative mx-auto w-full max-w-md lg:max-w-none">
                <div class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
                    <div class="relative -mx-3 -mt-3 mb-4 overflow-hidden rounded-2xl border border-white/10 sm:-mx-4 sm:-mt-4">
                        <img src="/images/illustrations/collaboration.svg" alt="" aria-hidden="true" fetchpriority="high" class="block h-auto w-full">
                        <span class="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#071A16]/75 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:text-[10px]">{{ $isEnglish ? 'Knowledge · Nature · Community' : 'Pengetahuan · Alam · Komunitas' }}</span>
                    </div>
                    <div class="flex items-center justify-between border-b border-white/10 pb-5">
                        <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">{{ $isEnglish ? 'TWO WAYS TO COLLABORATE' : 'DUA RUANG KOLABORASI' }}</p>
                        <span class="font-mono text-xs text-[#E5A823]">01 / 02</span>
                    </div>
                    <div class="space-y-5 pt-5">
                        @foreach($collaborationSpaces as $space)
                            <div class="flex items-start gap-4">
                                <span @class([
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold',
                                    'bg-[#0D5C4D]/30 text-emerald-200' => $space['tone'] === 'teal',
                                    'bg-[#D96B27]/20 text-orange-200' => $space['tone'] === 'orange',
                                ])>{{ $space['number'] }}</span>
                                <div class="min-w-0">
                                    <p class="font-heading text-base font-bold text-white">{{ $space['eyebrow'] }}</p>
                                    <p class="mt-1 text-sm leading-relaxed text-neutral-400">{{ $space['title'] }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <div class="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-neutral-400">
                        <span class="h-2 w-2 rounded-full bg-[#E5A823]"></span>
                        {{ $isEnglish ? 'From shared questions to grounded action' : 'Dari pertanyaan bersama menjadi aksi yang membumi' }}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section aria-labelledby="spaces-heading" class="scroll-mt-24 border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-20 lg:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-3xl sm:mb-12">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? '01 / TWO COLLABORATION SPACES' : '01 / DUA RUANG KOLABORASI' }}</p>
                <h2 id="spaces-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Find the right way to connect with ANTRABUMI.' : 'Temukan cara yang tepat untuk terhubung dengan ANTRABUMI.' }}</h2>
                <p class="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">{{ $isEnglish ? 'Whether you are an institution seeking a strategic partnership or an expert ready to contribute your skills.' : 'Baik sebagai institusi yang mencari kemitraan strategis, maupun sebagai individu pakar yang ingin menyumbangkan keahlian.' }}</p>
            </div>
            <div class="grid gap-5 lg:grid-cols-2 lg:gap-6">
                @foreach($collaborationSpaces as $space)
                    <article @class([
                        'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8',
                        'border-[#0D5C4D]/20 hover:border-[#0D5C4D]/45' => $space['tone'] === 'teal',
                        'border-[#D96B27]/20 hover:border-[#D96B27]/45' => $space['tone'] === 'orange',
                    ])>
                        <div @class([
                            'absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100',
                            'bg-[#0D5C4D]' => $space['tone'] === 'teal',
                            'bg-[#D96B27]' => $space['tone'] === 'orange',
                        ])></div>
                        <div class="flex items-center justify-between gap-4">
                            <span class="font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{{ $space['number'] }} <span class="mx-1 text-neutral-300">/</span> {{ $space['eyebrow'] }}</span>
                            <span @class([
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition duration-300 group-hover:rotate-45',
                                'bg-[#0D5C4D]/10 text-[#0D5C4D]' => $space['tone'] === 'teal',
                                'bg-[#D96B27]/10 text-[#D96B27]' => $space['tone'] === 'orange',
                            ]) aria-hidden="true">{{ $space['icon'] }}</span>
                        </div>
                        <h3 class="mt-7 font-heading text-2xl font-bold leading-tight text-neutral-950 sm:text-3xl">{{ $space['title'] }}</h3>
                        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">{{ $space['description'] }}</p>
                        <div class="mt-6 flex flex-wrap gap-2">
                            @foreach($space['tags'] as $tag)
                                <span class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600">{{ $tag }}</span>
                            @endforeach
                        </div>
                        <a href="#formulir" class="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-[#0D5C4D] transition duration-200 hover:gap-3 hover:text-[#147A66] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]">
                            {{ $space['link'] }} <span aria-hidden="true">→</span>
                        </a>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section aria-labelledby="areas-heading" class="border-b border-neutral-100 bg-white py-16 sm:py-20 lg:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? '02 / COLLABORATION AREAS' : '02 / BIDANG KOLABORASI' }}</p>
                    <h2 id="areas-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Spaces for work we can shape together.' : 'Ruang kerja yang dapat dibentuk bersama.' }}</h2>
                </div>
                <a href="#formulir" class="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#0D5C4D] hover:text-[#147A66] sm:self-auto">{{ $isEnglish ? 'Discuss an idea' : 'Diskusikan gagasan' }} <span aria-hidden="true">↗</span></a>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                @foreach($collaborationAreas as $index => $area)
                    <article class="group rounded-2xl border border-neutral-200 bg-[#FAF9F5] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow-lg sm:p-6">
                        <span class="font-mono text-xs font-bold tracking-widest text-[#D96B27]">0{{ $index + 1 }}</span>
                        <h3 class="mt-4 font-heading text-lg font-bold text-neutral-950">{{ $area['title'] }}</h3>
                        <p class="mt-2 min-h-12 text-sm leading-relaxed text-neutral-600">{{ $area['description'] }}</p>
                        <a href="#formulir" class="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0D5C4D] transition group-hover:gap-3">
                            {{ $isEnglish ? 'Work with us in this area' : 'Bekerja sama di bidang ini' }} <span aria-hidden="true">→</span>
                        </a>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section aria-labelledby="process-heading" class="border-b border-neutral-100 bg-[#071A16] py-16 text-white sm:py-20 lg:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-3xl sm:mb-12">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E5A823]">{{ $isEnglish ? '03 / HOW WE WORK TOGETHER' : '03 / CARA BEKERJA BERSAMA KAMI' }}</p>
                <h2 id="process-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{{ $isEnglish ? 'We start with the issue, not a service package.' : 'Mulai dari persoalan, bukan paket layanan.' }}</h2>
            </div>
            <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                @foreach($workingSteps as $index => $step)
                    <li class="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#E5A823]/40 hover:bg-white/[0.07] sm:p-6">
                        <span class="font-mono text-sm font-bold text-[#E5A823]">0{{ $index + 1 }}</span>
                        <h3 class="mt-5 font-heading text-xl font-bold">{{ $step['title'] }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-neutral-400">{{ $step['description'] }}</p>
                    </li>
                @endforeach
            </ol>
        </div>
    </section>

    <section aria-labelledby="network-heading" class="border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-20 lg:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-3xl sm:mb-12">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? '04 / PARTNERS & COLLABORATION NETWORK' : '04 / MITRA & JEJARING KOLABORASI' }}</p>
                <h2 id="network-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Working with partners across sectors.' : 'Bekerja Bersama Berbagai Sektor' }}</h2>
                <p class="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">{{ $isEnglish ? 'ANTRABUMI brings different perspectives together so change is contextual, grounded, and sustainable.' : 'ANTRABUMI mempertemukan berbagai perspektif agar perubahan yang terjadi bersifat kontekstual, membumi, dan berkelanjutan.' }}</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                @foreach($networkSectors as $sector)
                    <article class="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0D5C4D]/30 hover:shadow-lg sm:p-6">
                        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D5C4D]/[0.07] text-2xl transition duration-300 group-hover:scale-110" aria-hidden="true">{{ $sector['icon'] }}</span>
                        <h3 class="mt-5 font-heading text-lg font-bold text-neutral-950">{{ $sector['title'] }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ $sector['description'] }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    @if(count($partners) > 0)
        <section aria-labelledby="partner-directory-heading" class="border-b border-neutral-100 bg-white py-14 sm:py-16">
            <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
                <div class="mb-8 text-center">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? 'OUR PARTNERS' : 'MITRA KAMI' }}</p>
                    <h2 id="partner-directory-heading" class="mt-3 font-heading text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">{{ $isEnglish ? 'Our collaborative network' : 'Jejaring kolaborasi kami' }}</h2>
                </div>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    @foreach($partners as $partner)
                        <div class="flex h-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            @if($partner['logoUrl'])
                                <img src="{{ $partner['logoUrl'] }}" alt="{{ $partner['logoAlt'] ?? $partner['name'] }}" class="max-h-10 max-w-full object-contain">
                            @else
                                <span class="font-heading text-xs font-bold text-neutral-700">{{ $partner['name'] }}</span>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    <section id="kontak" class="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <div class="mx-auto w-full max-w-[1100px] px-5 md:px-7 lg:px-10">
            @if(session('sent') || session('success'))
                <div class="mb-6 rounded-2xl border border-[#0D5C4D]/20 bg-[#F1F8F5] px-4 py-3 text-sm font-medium text-[#0D5C4D]">
                    {{ session('success') ?: ($isEnglish ? 'Your message has been sent.' : 'Pesan berhasil dikirim.') }}
                </div>
            @endif
            <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
                <div class="rounded-3xl bg-[#071A16] p-6 text-white sm:p-8">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E5A823]">{{ $isEnglish ? 'NEXT STEP' : 'LANGKAH BERIKUTNYA' }}</p>
                    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{{ $isEnglish ? 'Tell us what you want to build together.' : 'Ceritakan hal yang ingin Anda bangun bersama.' }}</h2>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-300">{{ $isEnglish ? 'Share a project idea, question, or expertise. Our team will review your message and get in touch.' : 'Ceritakan gagasan proyek, persoalan, atau keahlian Anda. Tim kami akan meninjau pesan dan menghubungi Anda.' }}</p>
                    <ul class="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm text-neutral-300">
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Email</span><a href="mailto:hello@antrabumi.org" class="break-words hover:text-[#E5A823]">hello@antrabumi.org</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{{ $isEnglish ? 'Phone' : 'Telepon' }}</span><a href="tel:+6282330387505" class="hover:text-[#E5A823]">+62-823-3038-7505</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Instagram</span><a href="https://instagram.com/antrabumi_org" target="_blank" rel="noopener noreferrer" class="hover:text-[#E5A823]">@antrabumi_org</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">LinkedIn</span><a href="https://www.linkedin.com/company/antrabumi" target="_blank" rel="noopener noreferrer" class="hover:text-[#E5A823]">Antrabumi</a></li>
                    </ul>
                </div>

                <div id="formulir" class="scroll-mt-24 rounded-3xl border border-neutral-200 bg-[#FAF9F5] p-5 shadow-sm sm:p-8 lg:p-10">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? 'PROJECT OR NETWORK INQUIRY' : 'DISKUSI PROYEK ATAU JARINGAN' }}</p>
                    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Start a conversation with our team.' : 'Mulai percakapan dengan tim kami.' }}</h2>
                    <form method="POST" action="{{ route('contact.store') }}" class="mt-7 space-y-4">
                        @csrf
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-neutral-700" for="name">{{ $isEnglish ? 'Name' : 'Nama' }}</label>
                                <input id="name" name="name" type="text" value="{{ old('name') }}" autocomplete="name" class="w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                                @error('name')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                            </div>
                            <div>
                                <label class="mb-2 block text-sm font-medium text-neutral-700" for="email">Email</label>
                                <input id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" class="w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                                @error('email')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                            </div>
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-neutral-700" for="subject">{{ $isEnglish ? 'Subject' : 'Subjek' }}</label>
                            <input id="subject" name="subject" type="text" value="{{ old('subject') }}" class="w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" placeholder="{{ $isEnglish ? 'Project discussion or associate network' : 'Diskusi proyek atau jaringan associate' }}">
                            @error('subject')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-neutral-700" for="message">{{ $isEnglish ? 'Message' : 'Pesan' }}</label>
                            <textarea id="message" name="message" rows="5" class="w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>{{ old('message') }}</textarea>
                            @error('message')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                        </div>
                        <button type="submit" class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C4D] px-6 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#147A66] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5C4D] sm:w-auto">
                            {{ $isEnglish ? 'Send message' : 'Kirim pesan' }} <span aria-hidden="true">→</span>
                        </button>
                    </form>
                    <p class="mt-4 text-xs leading-relaxed text-neutral-500">{{ $isEnglish ? 'Your information will be shared with and reviewed by the ANTRABUMI administrator team.' : 'Informasi Anda akan tersimpan dan ditinjau oleh tim administrator ANTRABUMI.' }}</p>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection
