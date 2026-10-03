import './bootstrap';

document.querySelectorAll('[data-menu-toggle]').forEach((toggle) => {
	const panel = document.getElementById(toggle.dataset.menuTarget);
	if (!panel) return;

	const backdrop = document.querySelector(`[data-menu-backdrop="${panel.id}"]`);
	const setOpen = (open) => {
		toggle.setAttribute('aria-expanded', String(open));
		panel.classList.toggle('hidden', !open);
		backdrop?.classList.toggle('hidden', !open);
		toggle.querySelectorAll('[data-menu-icon-open]').forEach((icon) => icon.classList.toggle('hidden', open));
		toggle.querySelectorAll('[data-menu-icon-close]').forEach((icon) => icon.classList.toggle('hidden', !open));
	};

	toggle.addEventListener('click', () => {
		setOpen(toggle.getAttribute('aria-expanded') !== 'true');
	});

	panel.querySelectorAll('[data-menu-close], a').forEach((control) => {
		control.addEventListener('click', () => setOpen(false));
	});

	backdrop?.addEventListener('click', () => setOpen(false));
});

document.querySelectorAll('[data-nav-dropdown]').forEach((dropdown) => {
	const trigger = dropdown.querySelector('[data-nav-trigger]');
	const panel = dropdown.querySelector('[data-nav-panel]');
	if (!trigger || !panel) return;

	const setOpen = (open) => {
		trigger.setAttribute('aria-expanded', String(open));
		panel.hidden = !open;
	};
	trigger.addEventListener('click', () => setOpen(panel.hidden));
	dropdown.addEventListener('mouseenter', () => setOpen(true));
	dropdown.addEventListener('mouseleave', () => setOpen(false));
	document.addEventListener('click', (event) => {
		if (!dropdown.contains(event.target)) setOpen(false);
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') setOpen(false);
	});
});

document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
	const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
	if (slides.length === 0) return;
	const copies = Array.from(slider.querySelectorAll('[data-hero-copy]'));
	const indicators = Array.from(slider.querySelectorAll('[data-hero-indicator]'));
	const pauseButton = slider.querySelector('[data-hero-pause]');
	const autoplay = slider.dataset.autoplay === 'true';
	const pauseOnHover = slider.dataset.pauseOnHover === 'true';
	const interval = Math.max(2000, Math.min(30000, Number(slider.dataset.interval) || 6000));
	let activeIndex = 0;
	let paused = false;
	let timer;

	const show = (index) => {
		activeIndex = (index + slides.length) % slides.length;
		slides.forEach((slide, slideIndex) => {
			const active = slideIndex === activeIndex;
			slide.hidden = !active;
			slide.setAttribute('aria-hidden', String(!active));
		});
		copies.forEach((copy, copyIndex) => {
			const active = copyIndex === activeIndex;
			copy.hidden = !active;
			copy.setAttribute('aria-hidden', String(!active));
		});
		indicators.forEach((indicator, indicatorIndex) => {
			const active = indicatorIndex === activeIndex;
			indicator.setAttribute('aria-selected', String(active));
			indicator.classList.toggle('w-10', active);
			indicator.classList.toggle('bg-[#E5A823]', active);
			indicator.classList.toggle('w-2.5', !active);
			indicator.classList.toggle('bg-white/30', !active);
		});
		const count = slider.querySelector('[data-hero-count]');
		if (count) count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
	};
	const stop = () => window.clearInterval(timer);
	const start = () => {
		stop();
		if (autoplay && !paused && slides.length > 1) timer = window.setInterval(() => show(activeIndex + 1), interval);
	};

	slider.querySelector('[data-hero-next]')?.addEventListener('click', () => { show(activeIndex + 1); start(); });
	slider.querySelector('[data-hero-prev]')?.addEventListener('click', () => { show(activeIndex - 1); start(); });
	indicators.forEach((indicator, index) => indicator.addEventListener('click', () => { show(index); start(); }));
	pauseButton?.addEventListener('click', () => {
		paused = !paused;
		pauseButton.setAttribute('aria-label', paused ? 'Lanjutkan putar otomatis' : 'Jeda putar otomatis');
		pauseButton.textContent = paused ? '▶' : 'Ⅱ';
		start();
	});
	if (pauseOnHover) {
		slider.addEventListener('mouseenter', () => { paused = true; stop(); });
		slider.addEventListener('mouseleave', () => { paused = false; start(); });
		slider.addEventListener('focusin', () => { paused = true; stop(); });
		slider.addEventListener('focusout', (event) => { if (!slider.contains(event.relatedTarget)) { paused = false; start(); } });
	}
	show(0);
	start();
});

const publicHeader = document.querySelector('[data-public-header]');
const scrollControls = document.querySelector('[data-floating-cta]');
const scrollTopButton = document.querySelector('[data-scroll-top]');
const updateScrollState = () => {
	const y = window.scrollY;
	publicHeader?.classList.toggle('is-scrolled', y > 8);
	if (scrollControls) {
		scrollControls.classList.toggle('opacity-0', y <= 200);
		scrollControls.classList.toggle('translate-y-5', y <= 200);
		scrollControls.classList.toggle('pointer-events-none', y <= 200);
	}
	if (scrollTopButton) scrollTopButton.classList.toggle('hidden', y <= 600);
};
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();
scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('[data-knowledge-archive]').forEach((archive) => {
	const cards = Array.from(archive.querySelectorAll('[data-knowledge-card]'));
	const filterButtons = Array.from(archive.querySelectorAll('[data-knowledge-filter]'));
	const searchInput = archive.querySelector('[data-knowledge-search]');
	const clearSearch = archive.querySelector('[data-knowledge-clear]');
	const emptyState = archive.querySelector('[data-knowledge-empty]');
	let selectedType = archive.dataset.initialType || 'ALL';

	const update = () => {
		const query = (searchInput?.value || '').trim().toLocaleLowerCase();
		let visibleCount = 0;
		cards.forEach((card) => {
			const matchesType = selectedType === 'ALL' || card.dataset.type === selectedType;
			const searchableText = `${card.dataset.title || ''} ${card.dataset.excerpt || ''}`.toLocaleLowerCase();
			const visible = matchesType && (!query || searchableText.includes(query));
			card.hidden = !visible;
			if (visible) visibleCount += 1;
		});
		if (emptyState) emptyState.hidden = visibleCount > 0;
		if (clearSearch) clearSearch.hidden = !query;
		filterButtons.forEach((button) => {
			const active = button.dataset.knowledgeFilter === selectedType;
			button.setAttribute('aria-pressed', String(active));
			button.classList.toggle('bg-[#0D5C4D]', active);
			button.classList.toggle('text-white', active);
			button.classList.toggle('font-semibold', active);
			button.classList.toggle('shadow-sm', active);
			button.classList.toggle('bg-neutral-100', !active);
			button.classList.toggle('text-neutral-600', !active);
		});
	};
	const setType = (type) => {
		selectedType = type || 'ALL';
		update();
	};

	filterButtons.forEach((button) => button.addEventListener('click', () => setType(button.dataset.knowledgeFilter)));
	document.querySelectorAll('[data-knowledge-select]').forEach((control) => control.addEventListener('click', () => setType(control.dataset.knowledgeSelect)));
	searchInput?.addEventListener('input', update);
	clearSearch?.addEventListener('click', () => { if (searchInput) searchInput.value = ''; update(); searchInput?.focus(); });
	archive.querySelector('[data-knowledge-reset]')?.addEventListener('click', () => {
		setType('ALL');
		if (searchInput) searchInput.value = '';
		update();
	});
	update();
	if (selectedType !== 'ALL') window.requestAnimationFrame(() => archive.scrollIntoView({ behavior: 'smooth' }));
});

document.querySelectorAll('[data-image-slider]').forEach((slider) => {
	const images = Array.from(slider.querySelectorAll('[data-image-slide]'));
	const indicators = Array.from(slider.querySelectorAll('[data-image-indicator]'));
	if (images.length === 0) return;
	let index = 0;
	let paused = false;
	let timer;
	const show = (nextIndex) => {
		index = (nextIndex + images.length) % images.length;
		images.forEach((image, imageIndex) => {
			const active = imageIndex === index;
			image.setAttribute('aria-hidden', String(!active));
			image.classList.toggle('opacity-100', active);
			image.classList.toggle('opacity-0', !active);
			image.classList.toggle('pointer-events-none', !active);
		});
		indicators.forEach((indicator, indicatorIndex) => {
			const active = indicatorIndex === index;
			indicator.setAttribute('aria-current', String(active));
			indicator.classList.toggle('w-6', active);
			indicator.classList.toggle('bg-[#0D5C4D]', active);
			indicator.classList.toggle('w-1.5', !active);
			indicator.classList.toggle('bg-neutral-300', !active);
		});
		const count = slider.querySelector('[data-image-count]');
		if (count) count.textContent = `${index + 1} / ${images.length}`;
	};
	const stop = () => window.clearInterval(timer);
	const start = () => {
		stop();
		if (!paused && images.length > 1) timer = window.setInterval(() => show(index + 1), 4500);
	};
	slider.querySelector('[data-image-next]')?.addEventListener('click', () => { show(index + 1); start(); });
	slider.querySelector('[data-image-prev]')?.addEventListener('click', () => { show(index - 1); start(); });
	indicators.forEach((indicator, indicatorIndex) => indicator.addEventListener('click', () => { show(indicatorIndex); start(); }));
	slider.addEventListener('mouseenter', () => { paused = true; stop(); });
	slider.addEventListener('mouseleave', () => { paused = false; start(); });
	slider.addEventListener('focusin', () => { paused = true; stop(); });
	slider.addEventListener('focusout', (event) => { if (!slider.contains(event.relatedTarget)) { paused = false; start(); } });
	show(0);
	start();
});

const pdfModal = document.querySelector('[data-pdf-modal]');
if (pdfModal instanceof HTMLDialogElement) {
	const frame = pdfModal.querySelector('[data-pdf-modal-frame]');
	const title = pdfModal.querySelector('[data-pdf-modal-title]');
	const category = pdfModal.querySelector('[data-pdf-modal-category]');
	const links = pdfModal.querySelectorAll('[data-pdf-modal-open], [data-pdf-modal-download], [data-pdf-modal-direct]');
	document.querySelectorAll('[data-pdf-open]').forEach((button) => button.addEventListener('click', () => {
		const url = button.dataset.pdfUrl || '';
		if (frame) frame.src = `${url}#toolbar=1&navpanes=0`;
		if (title) title.textContent = button.dataset.pdfTitle || 'PDF';
		if (category) category.textContent = button.dataset.pdfCategory || '';
		links.forEach((link) => { link.href = url; });
		pdfModal.showModal();
	}));
	pdfModal.querySelector('[data-pdf-modal-close]')?.addEventListener('click', () => pdfModal.close());
	pdfModal.addEventListener('click', (event) => { if (event.target === pdfModal) pdfModal.close(); });
	pdfModal.addEventListener('close', () => { if (frame) frame.src = ''; });
}

document.querySelectorAll('[data-share-copy], [data-share-instagram]').forEach((button) => button.addEventListener('click', async () => {
	const url = button.dataset.shareUrl || window.location.href;
	const feedback = button.closest('section')?.querySelector('[data-share-feedback]');
	try {
		await navigator.clipboard.writeText(url);
		if (feedback) feedback.textContent = 'Link tersalin';
	} catch {
		if (feedback) feedback.textContent = 'Salin link dari alamat browser';
	}
	if (button.hasAttribute('data-share-instagram')) window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
	window.setTimeout(() => { if (feedback) feedback.textContent = ''; }, 2200);
}));

document.querySelectorAll('[data-experience-archive]').forEach((archive) => {
	const cards = Array.from(archive.querySelectorAll('[data-experience-card]'));
	const yearButtons = Array.from(document.querySelectorAll('[data-exp-year]'));
	const categorySelect = document.querySelector('[data-exp-category]');
	const search = document.querySelector('[data-exp-search]');
	const clear = document.querySelector('[data-exp-clear]');
	const empty = archive.querySelector('[data-exp-empty]');
	const count = archive.querySelector('[data-exp-count]');
	let selectedYear = 'ALL';
	let selectedCategory = 'ALL';

	const update = () => {
		const query = (search?.value || '').trim().toLocaleLowerCase();
		let visible = 0;
		cards.forEach((card) => {
			const matchesYear = selectedYear === 'ALL' || card.dataset.year === selectedYear;
			const matchesCategory = selectedCategory === 'ALL' || (card.dataset.category || '').toLocaleLowerCase() === selectedCategory.toLocaleLowerCase();
			const matchesSearch = !query || (card.dataset.search || '').toLocaleLowerCase().includes(query);
			const showCard = matchesYear && matchesCategory && matchesSearch;
			card.hidden = !showCard;
			if (showCard) visible += 1;
		});
		if (empty) empty.hidden = visible > 0;
		if (count) count.textContent = document.documentElement.lang === 'en' ? `Showing ${visible} experience${visible === 1 ? '' : 's'}` : `Menampilkan ${visible} pengalaman`;
		if (clear) clear.hidden = !query;
		yearButtons.forEach((button) => {
			const active = button.dataset.expYear === selectedYear;
			button.classList.toggle('bg-[#0D5C4D]', active);
			button.classList.toggle('text-white', active);
			button.classList.toggle('shadow-sm', active);
			button.classList.toggle('bg-neutral-100', !active);
			button.classList.toggle('text-neutral-600', !active);
		});
	};
	yearButtons.forEach((button) => button.addEventListener('click', () => { selectedYear = button.dataset.expYear || 'ALL'; update(); }));
	categorySelect?.addEventListener('change', () => { selectedCategory = categorySelect.value; update(); });
	search?.addEventListener('input', update);
	clear?.addEventListener('click', () => { if (search) search.value = ''; update(); search?.focus(); });
	empty?.querySelector('[data-exp-reset]')?.addEventListener('click', () => {
		selectedYear = 'ALL';
		selectedCategory = 'ALL';
		if (categorySelect) categorySelect.value = 'ALL';
		if (search) search.value = '';
		update();
	});
	update();
});

document.querySelectorAll('[data-initiative-archive]').forEach((archive) => {
	const buttons = Array.from(document.querySelectorAll('[data-initiative-filter]'));
	const cards = Array.from(archive.querySelectorAll('[data-initiative-card]'));
	const empty = archive.querySelector('[data-initiative-empty]');
	const heading = archive.querySelector('[data-initiative-heading]');
	let selected = archive.dataset.initialCategory || 'ALL';
	const update = () => {
		let visible = 0;
		cards.forEach((card) => {
			const showCard = selected === 'ALL' || card.dataset.category === selected;
			card.hidden = !showCard;
			if (showCard) visible += 1;
		});
		if (empty) empty.hidden = visible > 0;
		if (heading) heading.textContent = heading.dataset[`heading${selected.charAt(0)}${selected.slice(1).toLowerCase()}`] || heading.dataset.headingAll;
		buttons.forEach((button) => {
			const active = button.dataset.initiativeFilter === selected;
			button.setAttribute('aria-pressed', String(active));
			button.classList.toggle('bg-[#0D5C4D]', active);
			button.classList.toggle('text-white', active);
			button.classList.toggle('shadow-sm', active);
			button.classList.toggle('bg-white', !active);
		});
	};
	buttons.forEach((button) => button.addEventListener('click', () => {
		selected = button.dataset.initiativeFilter || 'ALL';
		update();
		if (selected !== 'ALL') archive.scrollIntoView({ behavior: 'smooth' });
	}));
	update();
	if (selected !== 'ALL') window.requestAnimationFrame(() => archive.scrollIntoView({ behavior: 'smooth' }));
});
