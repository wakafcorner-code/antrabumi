<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Person;
use App\Services\PublicExperienceData;
use App\Services\PublicKnowledgeData;
use App\Services\PublicSiteData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class PublicPageController extends Controller
{
    public function home(PublicSiteData $siteData): View
    {
        $language = request()->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';

        return view('public.home', $siteData->homepage($language));
    }

    public function setLanguage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'language' => ['required', 'in:ID,EN'],
            'return_to' => ['nullable', 'string', 'max:2048'],
        ]);
        $returnTo = $validated['return_to'] ?? '/';

        if (! str_starts_with($returnTo, '/') || str_starts_with($returnTo, '//')) {
            $returnTo = '/';
        }

        return redirect()->to($returnTo)->withCookie(cookie(
            'antrabumi_lang',
            $validated['language'],
            60 * 24 * 365,
            '/',
            null,
            null,
            false,
            false,
            'lax'
        ));
    }
    public function about(Request $request, PublicSiteData $siteData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';

        return view('public.about.index', $siteData->about($language));
    }

    public function initiatives(Request $request, PublicExperienceData $experienceData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';
        $data = $experienceData->initiativeListing($language, $request->query('kategori'), $request->query('type'));

        return view('public.initiatives.index', $data);
    }

    public function initiative(Request $request, string $slug, PublicExperienceData $experienceData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';
        $data = $experienceData->detail($slug, $language, 'initiative');
        abort_if($data === null, 404);

        return view('public.initiatives.show', $data);
    }

    public function experiences(Request $request, PublicExperienceData $experienceData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';

        return view('public.experiences.index', $experienceData->experienceListing($language));
    }

    public function experience(Request $request, string $slug, PublicExperienceData $experienceData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';
        $data = $experienceData->detail($slug, $language, 'experience');
        abort_if($data === null, 404);

        return view('public.experiences.show', $data);
    }
    public function knowledge(Request $request, PublicKnowledgeData $knowledgeData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';

        return view('public.knowledge.index', $knowledgeData->listing(
            $language,
            $request->query('kategori'),
            $request->query('type')
        ));
    }

    public function knowledgeItem(Request $request, string $slug, PublicKnowledgeData $knowledgeData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';
        $data = $knowledgeData->detail($slug, $language);
        abort_if($data === null, 404);

        return view('public.knowledge.show', $data);
    }
    public function collaboration(Request $request, PublicSiteData $siteData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';

        return view('public.collaboration.index', $siteData->collaboration($language));
    }

    public function person(Request $request, string $slug, PublicSiteData $siteData): View
    {
        $language = $request->cookie('antrabumi_lang') === 'EN' ? 'EN' : 'ID';
        $data = $siteData->person($slug, $language);
        abort_if($data === null, 404);

        return view('public.people.show', $data);
    }

    public function robots(): Response
    {
        $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ".url('/sitemap.xml')."\n";

        return response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    public function sitemap(): Response
    {
        $urls = [url('/'), url('/tentang'), url('/inisiatif'), url('/pengalaman'), url('/pengetahuan'), url('/kolaborasi')];
        $publishedExperienceSlugs = Experience::where('status', ContentStatus::PUBLISHED->value)->pluck('slug')->all();
        $initiativeSlugs = array_unique(array_merge(
            $publishedExperienceSlugs,
            array_keys(config('public_experiences.initiative_fallback', [])),
        ));
        $experienceSlugs = array_unique(array_merge(
            $publishedExperienceSlugs,
            array_keys(config('public_experiences.detail_fallback', [])),
        ));

        foreach ($initiativeSlugs as $slug) {
            $urls[] = url('/inisiatif/'.$slug);
        }

        foreach ($experienceSlugs as $slug) {
            $urls[] = url('/pengalaman/'.$slug);
        }

        foreach (Knowledge::where('status', ContentStatus::PUBLISHED->value)->pluck('slug') as $slug) {
            $urls[] = url('/pengetahuan/'.$slug);
        }

        foreach (Person::where('status', ContentStatus::PUBLISHED->value)->pluck('slug') as $slug) {
            $urls[] = url('/tentang/tim/'.$slug);
        }

        $entries = collect($urls)->unique()->map(fn (string $location) => '<url><loc>'.e($location).'</loc></url>')->implode('');
        $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.$entries.'</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    private function pending(string $page, ?string $slug = null): View
    {
        return view('public.migration-placeholder', compact('page', 'slug'));
    }
}
