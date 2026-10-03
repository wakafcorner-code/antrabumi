<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\MessageStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ContactMessageController extends Controller
{
    protected string $resourceTitle = 'Pesan Masuk';

    public function index(Request $request): View
    {
        $status = $request->query('status');
        $messages = ContactMessage::query()
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['status' => $status]);

        return view('admin.messages.index', compact('messages', 'status'));
    }

    public function show(ContactMessage $message): View
    {
        $message->load(['assignedTo']);

        return view('admin.messages.show', compact('message'));
    }

    public function updateStatus(Request $request, ContactMessage $message, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:NEW,READ,IN_PROGRESS,RESOLVED,ARCHIVED'],
        ]);

        $status = MessageStatus::from($validated['status']);
        $message->update(['status' => $status]);

        $audit->record($request->user(), AuditAction::UPDATE, 'ContactMessage', $message->id, ['status' => $status->value]);

        return redirect()->route('admin.messages.show', $message)->with('success', 'Status pesan berhasil diperbarui.');
    }
}
