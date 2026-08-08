<x-mail::message>
# New {{ $contactMessage->path === 'photo' ? 'photography enquiry' : 'enquiry' }}

**From:** {{ $contactMessage->name }} ({{ $contactMessage->email }})
**Received:** {{ $contactMessage->created_at->toDayDateTimeString() }}

{{ $contactMessage->message }}

<x-mail::button :url="'mailto:'.$contactMessage->email">
Reply to {{ $contactMessage->name }}
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
