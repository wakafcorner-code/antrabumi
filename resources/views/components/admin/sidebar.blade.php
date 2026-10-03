<aside id="admin-navigation" data-menu-panel class="fixed inset-y-0 left-0 z-50 hidden w-72 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white shadow-xl lg:static lg:z-auto lg:block lg:w-60 lg:shadow-none">
    <div class="flex items-center justify-between border-b border-neutral-200 px-5 py-5">
        <a href="{{ route('admin.dashboard') }}" class="font-heading text-sm font-extrabold tracking-widest">ANTRABUMI <span class="text-brand-teal">CMS</span></a>
        <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden" aria-label="Tutup navigasi admin" data-menu-close>
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
    </div>
    <nav aria-label="Navigasi admin" class="space-y-4 p-3 text-sm">
        <a @class(['admin-nav-link', 'bg-neutral-900 text-white' => request()->routeIs('admin.dashboard')]) href="{{ route('admin.dashboard') }}" @if(request()->routeIs('admin.dashboard')) aria-current="page" @endif>Dashboard</a>
        <section aria-labelledby="admin-content-heading">
            <h2 id="admin-content-heading" class="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Konten</h2>
            <div class="space-y-1">
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.hero.*')]) href="{{ route('admin.hero.index') }}" @if(request()->routeIs('admin.hero.*')) aria-current="page" @endif>Hero Slider</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.home-content.*')]) href="{{ route('admin.home-content.index') }}" @if(request()->routeIs('admin.home-content.*')) aria-current="page" @endif>Konten Beranda</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.initiatives.*', 'admin.experiences.*')]) href="{{ route('admin.initiatives.index') }}" @if(request()->routeIs('admin.initiatives.*', 'admin.experiences.*')) aria-current="page" @endif>Inisiatif</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.knowledge.*')]) href="{{ route('admin.knowledge.index') }}" @if(request()->routeIs('admin.knowledge.*')) aria-current="page" @endif>Pengetahuan</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.people.*')]) href="{{ route('admin.people.index') }}" @if(request()->routeIs('admin.people.*')) aria-current="page" @endif>Tim</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.partners.*')]) href="{{ route('admin.partners.index') }}" @if(request()->routeIs('admin.partners.*')) aria-current="page" @endif>Mitra</a>
                <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.media.*')]) href="{{ route('admin.media.index') }}" @if(request()->routeIs('admin.media.*')) aria-current="page" @endif>Media</a>
            </div>
        </section>
        <section aria-labelledby="admin-communication-heading">
            <h2 id="admin-communication-heading" class="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Komunikasi</h2>
            <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.messages.*')]) href="{{ route('admin.messages.index') }}" @if(request()->routeIs('admin.messages.*')) aria-current="page" @endif>Pesan Masuk</a>
        </section>
        @if(in_array(auth()->user()?->role?->value, ['ADMIN', 'SUPER_ADMIN'], true))
            <section aria-labelledby="admin-system-heading">
                <h2 id="admin-system-heading" class="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Sistem</h2>
                <div class="space-y-1">
                    @if(auth()->user()?->role?->value === 'SUPER_ADMIN')
                        <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.users.*')]) href="{{ route('admin.users.index') }}" @if(request()->routeIs('admin.users.*')) aria-current="page" @endif>Pengguna</a>
                    @endif
                    <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.logs.*')]) href="{{ route('admin.logs.index') }}" @if(request()->routeIs('admin.logs.*')) aria-current="page" @endif>Audit Log</a>
                    <a @class(['admin-nav-link', 'bg-neutral-100 text-neutral-950' => request()->routeIs('admin.settings.*')]) href="{{ route('admin.settings.index') }}" @if(request()->routeIs('admin.settings.*')) aria-current="page" @endif>Pengaturan</a>
                </div>
            </section>
        @endif
    </nav>
    <div class="border-t border-neutral-200 px-5 py-4">
        <a href="{{ route('home') }}" class="text-xs text-neutral-500 hover:text-neutral-900">← Lihat Website Publik</a>
    </div>
</aside>
