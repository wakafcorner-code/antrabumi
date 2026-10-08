<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\HomeContentController;
use App\Http\Controllers\Admin\InitiativeController;
use App\Http\Controllers\Admin\KnowledgeController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\PageImageController;
use App\Http\Controllers\Admin\PersonController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Public\PublicPageController;
use App\Http\Controllers\Public\StoredMediaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicPageController::class, 'home'])->name('home');
Route::get('/tentang', [PublicPageController::class, 'about'])->name('about');
Route::get('/tentang/tim/{slug}', [PublicPageController::class, 'person'])->name('team.show');
Route::get('/inisiatif', [PublicPageController::class, 'initiatives'])->name('initiatives.index');
Route::get('/inisiatif/{slug}', [PublicPageController::class, 'initiative'])->name('initiatives.show');
Route::get('/pengalaman', [PublicPageController::class, 'experiences'])->name('experiences.index');
Route::get('/pengalaman/{slug}', [PublicPageController::class, 'experience'])->name('experiences.show');
Route::get('/experience', [PublicPageController::class, 'experiences'])->name('legacy.experience.index');
Route::get('/experience/{slug}', [PublicPageController::class, 'experience'])->name('legacy.experience.show');
Route::get('/pengetahuan', [PublicPageController::class, 'knowledge'])->name('knowledge.index');
Route::get('/pengetahuan/{slug}', [PublicPageController::class, 'knowledgeItem'])->name('knowledge.show');
Route::get('/kolaborasi', [PublicPageController::class, 'collaboration'])->name('collaboration');
Route::post('/language', [PublicPageController::class, 'setLanguage'])->name('language.update');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/sitemap.xml', [PublicPageController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [PublicPageController::class, 'robots'])->name('robots');
Route::get('/uploads/{path}', [StoredMediaController::class, 'showLegacy'])->where('path', '.*')->name('storage.media.legacy');
Route::get('/media-file/{path}', [StoredMediaController::class, 'show'])->where('path', '.*')->name('storage.media');

Route::middleware('guest')->group(function (): void {
    Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/admin/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:5,1')->name('login.store');
});

Route::prefix('api/v1/auth')->name('api.auth.')->group(function (): void {
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:5,1')->name('login');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/me', [AuthenticatedSessionController::class, 'me'])->middleware(['auth', 'active'])->name('me');
});

Route::middleware(['auth', 'active'])->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::redirect('/admin/dashboard', '/admin', 301)->name('admin.dashboard.legacy');
    Route::get('/admin', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::middleware('role:EDITOR|ADMIN|SUPER_ADMIN')->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('/initiatives/images', [PageImageController::class, 'initiatives'])->name('initiatives.images');
        Route::post('/initiatives/images', [PageImageController::class, 'updateInitiatives'])->name('initiatives.images.update');
        Route::get('/initiatives/new', [InitiativeController::class, 'create'])->name('initiatives.new');
        Route::resource('initiatives', InitiativeController::class)->except(['show', 'destroy']);
        Route::patch('/initiatives/{initiative}/status', [InitiativeController::class, 'updateStatus'])->name('initiatives.status');
        Route::get('/experiences', fn () => redirect()->route('admin.initiatives.index', ['type' => 'EXPERIENCE']))->name('experiences.index');
        Route::get('/experiences/new', [ExperienceController::class, 'create'])->name('experiences.new');
        Route::resource('experiences', ExperienceController::class)->except(['index', 'show', 'destroy']);
        Route::patch('/experiences/{experience}/status', [ExperienceController::class, 'updateStatus'])->name('experiences.status');
        Route::post('/experiences/{experience}/media/pdf', [ExperienceController::class, 'storePdf'])->name('experiences.media.pdf.store');
        Route::delete('/experiences/{experience}/media/pdf/{media}', [ExperienceController::class, 'destroyPdf'])->name('experiences.media.pdf.destroy');
        Route::post('/experiences/{experience}/media/gallery', [ExperienceController::class, 'storeGalleryImage'])->name('experiences.media.gallery.store');
        Route::delete('/experiences/{experience}/media/gallery/{media}', [ExperienceController::class, 'destroyGalleryImage'])->name('experiences.media.gallery.destroy');
        Route::get('/knowledge/new', [KnowledgeController::class, 'create'])->name('knowledge.new');
        Route::get('/knowledge/images', [PageImageController::class, 'knowledge'])->name('knowledge.images');
        Route::post('/knowledge/images', [PageImageController::class, 'updateKnowledge'])->name('knowledge.images.update');
        Route::resource('knowledge', KnowledgeController::class)->except(['show', 'destroy']);
        Route::patch('/knowledge/{knowledge}/status', [KnowledgeController::class, 'updateStatus'])->name('knowledge.status');
        Route::delete('/knowledge/{knowledge}/downloads/{download}', [KnowledgeController::class, 'destroyDownload'])->name('knowledge.downloads.destroy');
        Route::post('/knowledge/{knowledge}/gallery', [KnowledgeController::class, 'storeGalleryImage'])->name('knowledge.gallery.store');
        Route::delete('/knowledge/{knowledge}/gallery/{media}', [KnowledgeController::class, 'destroyGalleryImage'])->name('knowledge.gallery.destroy');
        Route::get('/people/new', [PersonController::class, 'create'])->name('people.new');
        Route::resource('people', PersonController::class)->except(['show', 'destroy']);
        Route::patch('/people/{person}/status', [PersonController::class, 'updateStatus'])->name('people.status');
        Route::get('/partners/new', [PartnerController::class, 'create'])->name('partners.new');
        Route::resource('partners', PartnerController::class)->except(['show', 'destroy']);
        Route::patch('/partners/{partner}/status', [PartnerController::class, 'updateStatus'])->name('partners.status');
        Route::get('/media', [MediaController::class, 'index'])->name('media.index');
        Route::patch('/media/{media}', [MediaController::class, 'update'])->name('media.update');
        Route::post('/messages/{message}/status', [ContactMessageController::class, 'updateStatus'])->name('messages.status');
        Route::get('/messages', [ContactMessageController::class, 'index'])->name('messages.index');
        Route::get('/messages/{message}', [ContactMessageController::class, 'show'])->name('messages.show');
        Route::get('/hero', [HeroController::class, 'index'])->name('hero.index');
        Route::put('/hero', [HeroController::class, 'update'])->name('hero.update');
        Route::get('/beranda', [HomeContentController::class, 'index'])->name('home-content.index');
        Route::put('/beranda', [HomeContentController::class, 'update'])->name('home-content.update');
    });

    Route::post('/api/v1/media/upload', [MediaController::class, 'store'])->middleware('role:EDITOR|ADMIN|SUPER_ADMIN')->name('api.media.upload');
    Route::patch('/api/v1/media/{media}', [MediaController::class, 'update'])->middleware('role:EDITOR|ADMIN|SUPER_ADMIN')->name('api.media.update');
    Route::delete('/api/v1/media/{media}', [MediaController::class, 'destroy'])->middleware('role:ADMIN|SUPER_ADMIN')->name('api.media.destroy');

    Route::middleware('role:ADMIN|SUPER_ADMIN')->prefix('admin')->name('admin.')->group(function (): void {
        Route::delete('/initiatives/{initiative}', [InitiativeController::class, 'destroy'])->name('initiatives.destroy');
        Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');
        Route::delete('/knowledge/{knowledge}', [KnowledgeController::class, 'destroy'])->name('knowledge.destroy');
        Route::delete('/people/{person}', [PersonController::class, 'destroy'])->name('people.destroy');
        Route::delete('/partners/{partner}', [PartnerController::class, 'destroy'])->name('partners.destroy');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::get('/logs', [AuditLogController::class, 'index'])->name('logs.index');
        Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
    });

    Route::middleware('role:SUPER_ADMIN')->prefix('admin')->name('admin.')->group(function (): void {
        Route::resource('users', UserController::class)->except(['show', 'destroy']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
        Route::patch('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password');
    });
});
