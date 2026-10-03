<?php

namespace App\Http\Controllers\Admin;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AuditLogController extends \App\Http\Controllers\Controller
{
    public function index(Request $request): View
    {
        $action = $request->query('action');
        $entity = trim((string) $request->query('entity', ''));

        $logs = AuditLog::query()
            ->when($action !== null && $action !== '', fn ($query) => $query->where('action', $action))
            ->when($entity !== '', fn ($query) => $query->where('entity', 'like', '%'.$entity.'%'))
            ->with('user:id,name,email,role')
            ->orderByDesc('createdAt')
            ->paginate(50)
            ->appends(['action' => $action, 'entity' => $entity]);

        return view('admin.logs.index', compact('logs', 'action', 'entity'));
    }
}
