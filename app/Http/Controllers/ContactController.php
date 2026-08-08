<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $message = ContactMessage::create($request->safe()->only([
            'name', 'email', 'message', 'path',
        ]));

        $recipient = SiteSetting::get('contact_email') ?: config('mail.from.address');

        try {
            Mail::to($recipient)->send(new ContactMessageReceived($message));
        } catch (\Throwable $e) {
            // The message is already stored, so a mail outage loses nothing —
            // don't show the sender an error for a problem on our side.
            Log::error('Contact message stored but not emailed.', [
                'contact_message_id' => $message->id,
                'exception' => $e->getMessage(),
            ]);
        }

        return back()->with('contact', 'Thanks — your message is on its way.');
    }
}
