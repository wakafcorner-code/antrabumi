<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\AuditLog;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Media;
use App\Models\Partner;
use App\Models\Person;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('admin.dashboard', [
            'stats' => [
                'experiences' => [
                    'total' => Experience::count(),
                    'published' => Experience::where('status', 'PUBLISHED')->count(),
                ],
                'knowledge' => [
                    'total' => Knowledge::count(),
                    'published' => Knowledge::where('status', 'PUBLISHED')->count(),
                ],
                'people' => [
                    'total' => Person::count(),
                    'published' => Person::where('status', 'PUBLISHED')->count(),
                ],
                'partners' => Partner::count(),
                'media' => [
                    'total' => Media::count(),
                    'documents' => Media::where('type', 'DOCUMENT')->count(),
                ],
                'messages' => [
                    'total' => ContactMessage::count(),
                    'new' => ContactMessage::where('status', 'NEW')->count(),
                ],
                'users' => User::count(),
            ],
            'recentMessages' => ContactMessage::query()->latest('createdAt')->take(5)->get([
                'id', 'name', 'email', 'organization', 'subject', 'status', 'createdAt',
            ]),
            'recentLogs' => AuditLog::query()->with('user:id,name,email')->latest('createdAt')->take(5)->get(),
        ]);
    }
}
