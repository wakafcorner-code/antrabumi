<?php

namespace App\Http\Controllers\Api;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactMessageRequest;
use App\Models\ContactMessage;
use App\Services\AuditLogService;

class ContactController extends Controller
{
    public function store(ContactMessageRequest $request, AuditLogService $audit)
    {
        $data = $request->validated();
        $message = ContactMessage::create([
            ...$data,
            'subject' => ($data['subject'] ?? null) ?: 'Kolaborasi',
        ]);
        $audit->record(null, AuditAction::CREATE, 'ContactMessage', $message->id);

        $successMessage = 'Pesan berhasil dikirim.';

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => $successMessage], 201);
        }

        return redirect()->route('collaboration')
            ->with('sent', true)
            ->with('success', $successMessage);
    }
}
