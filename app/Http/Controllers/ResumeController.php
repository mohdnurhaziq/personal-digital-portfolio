<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Serves the resume PDF uploaded in site settings.
 *
 * A route rather than a direct link to the file so the URL survives a
 * re-upload, the filename people end up with is the owner's name rather than
 * a media library hash, and nothing depends on APP_URL being right.
 */
class ResumeController extends Controller
{
    public function __invoke(): BinaryFileResponse
    {
        $media = SiteSetting::resume()?->file();

        abort_if($media === null, 404);

        // Inline: a resume is meant to be read in the browser tab, and the
        // filename below is still what a save from there produces.
        return response()->file($media->getPath(), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$this->filename().'"',
        ]);
    }

    private function filename(): string
    {
        $name = SiteSetting::get('owner_name', 'resume');

        return Str::slug($name).'-resume.pdf';
    }
}
