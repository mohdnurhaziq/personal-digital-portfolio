<?php

namespace Tests\Feature\Admin;

use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * The resume PDF uploaded in site settings, and the public route that serves
 * it. Requests go through POST with a `_method` override rather than calling
 * put() directly, because that is what the browser form actually sends —
 * PHP does not parse multipart bodies on PUT, and a test that skipped the
 * override would pass while the real form was broken.
 */
class ResumeUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->seed(PortfolioContentSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_it_stores_an_uploaded_resume_and_serves_it_publicly(): void
    {
        $this->submit(['uploads' => ['resume_pdf' => $this->pdf('haziq-cv.pdf')]])
            ->assertRedirect();

        $setting = SiteSetting::resume();

        $this->assertNotNull($setting->file());
        // The original filename is kept for the admin list, but is not what
        // the file is stored as.
        $this->assertSame('haziq-cv.pdf', $setting->value);
        $this->assertNotSame('haziq-cv.pdf', $setting->file()->file_name);

        $response = $this->get('/resume');

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString(
            'inline; filename="mohd-nur-haziq-irsyamuddin-resume.pdf"',
            $response->headers->get('Content-Disposition'),
        );
    }

    public function test_the_resume_route_404s_when_nothing_is_uploaded(): void
    {
        $this->get('/resume')->assertNotFound();
    }

    public function test_re_uploading_replaces_the_previous_file(): void
    {
        $this->submit(['uploads' => ['resume_pdf' => $this->pdf('old.pdf')]]);
        $this->submit(['uploads' => ['resume_pdf' => $this->pdf('new.pdf')]]);

        $setting = SiteSetting::resume();

        // singleFile(): a second upload replaces rather than piling up.
        $this->assertCount(1, $setting->getMedia(SiteSetting::COLLECTION));
        $this->assertSame('new.pdf', $setting->value);
    }

    public function test_it_rejects_a_file_that_is_not_a_pdf(): void
    {
        $this->submit(['uploads' => ['resume_pdf' => UploadedFile::fake()->image('shot.jpg')]])
            ->assertSessionHasErrors('uploads.resume_pdf');

        $this->assertNull(SiteSetting::resume()->file());
    }

    public function test_removing_the_file_takes_the_public_route_back_down(): void
    {
        $this->submit(['uploads' => ['resume_pdf' => $this->pdf()]]);
        $this->get('/resume')->assertOk();

        $this->submit(['remove' => ['resume_pdf' => true]]);

        $this->assertNull(SiteSetting::resume()->file());
        $this->assertNull(SiteSetting::resume()->value);
        $this->get('/resume')->assertNotFound();
    }

    public function test_the_upload_replaces_the_resume_url_the_public_page_links_to(): void
    {
        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page->where('settings.resume_url', '#'),
        );

        $this->submit(['uploads' => ['resume_pdf' => $this->pdf()]]);

        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page->where('settings.resume_url', route('resume')),
        );
    }

    public function test_a_file_setting_cannot_be_overwritten_with_a_posted_value(): void
    {
        $this->submit(['settings' => ['resume_pdf' => 'https://evil.example/not-a-file']]);

        $this->assertNull(SiteSetting::get('resume_pdf'));
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function submit(array $payload): TestResponse
    {
        return $this->post('/admin/settings', array_replace_recursive([
            // The form always posts the text settings too, and the endpoint
            // requires at least one.
            'settings' => ['owner_name' => 'Mohd. Nur Haziq Irsyamuddin'],
            '_method' => 'put',
        ], $payload));
    }

    /**
     * A real PDF, rather than `UploadedFile::fake()->create(…, 'application/pdf')`.
     *
     * That helper only *claims* a mime type; the file itself is empty. The
     * media library sniffs the file on disk instead of trusting the claim, so
     * a fake is rejected as `application/x-empty` where a genuine upload is
     * accepted. Writing the real magic bytes exercises the path a browser
     * upload actually takes.
     */
    private function pdf(string $name = 'resume.pdf'): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'pdf');
        file_put_contents($path, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n");

        return new UploadedFile($path, $name, 'application/pdf', null, true);
    }
}
