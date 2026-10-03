<?php

namespace App\Providers;

use App\Auth\LegacyCompatibleUserProvider;
use App\Services\PublicSiteData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(PublicSiteData::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Auth::provider('legacy-compatible-eloquent', function ($app, array $config) {
            return new LegacyCompatibleUserProvider($app['hash'], $config['model']);
        });

        View::composer('layouts.app', static function ($view): void {
            $view->with('siteSettings', app(PublicSiteData::class)->layoutSettings());
        });
    }
}
