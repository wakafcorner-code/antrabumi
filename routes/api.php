<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\KnowledgeController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\PersonController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'show'])->name('api.health');

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::get('/experiences', [ExperienceController::class, 'index'])->name('experiences.index');
    Route::get('/experiences/{slug}', [ExperienceController::class, 'show'])->name('experiences.show');
    Route::get('/knowledge', [KnowledgeController::class, 'index'])->name('knowledge.index');
    Route::get('/knowledge/{slug}', [KnowledgeController::class, 'show'])->name('knowledge.show');
    Route::get('/people', [PersonController::class, 'index'])->name('people.index');
    Route::get('/partners', [PartnerController::class, 'index'])->name('partners.index');
    Route::get('/search', [\App\Http\Controllers\Api\SearchController::class, 'index'])->name('search');
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1')->name('contact.store');
});