<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A message left through the contact form.
 *
 * These are stored as well as emailed on purpose: if SMTP is misconfigured or
 * the provider drops the message, the enquiry is still recoverable rather than
 * silently lost — which for a job-hunting portfolio is the worst failure mode.
 */
class ContactMessage extends Model
{
    protected $guarded = [];
}
