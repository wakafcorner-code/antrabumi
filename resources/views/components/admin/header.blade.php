<header class="flex min-h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
    <div class="flex items-center gap-3">
        <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 lg:hidden" aria-label="Buka navigasi admin" aria-controls="admin-navigation" aria-expanded="false" data-menu-toggle data-menu-target="admin-navigation">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span class="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-400">ANTRABUMI / CMS</span>
    </div>
    <div class="flex items-center gap-4 text-sm">
        <span class="hidden text-neutral-600 sm:inline">{{ auth()->user()->name ?? '' }} · {{ auth()->user()->role?->value ?? '' }}</span>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button class="rounded-md border border-neutral-200 px-3 py-2 text-xs font-semibold hover:bg-neutral-50">Keluar</button>
        </form>
    </div>
</header>
