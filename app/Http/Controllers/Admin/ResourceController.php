<?php

namespace App\Http\Controllers\Admin;

use App\Admin\AdminResources;
use App\Admin\Field;
use App\Admin\Resource;
use App\Http\Controllers\Controller;
use App\Models\TestimonialInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One controller for every content type, driven by the definitions in
 * AdminResources. Adding a content type needs no code here.
 */
class ResourceController extends Controller
{
    public function index(string $resource): Response
    {
        $definition = $this->resolve($resource);
        $invitationToken = $definition->key === 'testimonials'
            ? TestimonialInvitation::available()->latest()->value('token')
            : null;

        return Inertia::render('Admin/Resource/Index', [
            'resource' => $definition->toArray(),
            'records' => $definition->newQuery()->get()->map(
                fn ($record) => $this->present($record, $definition),
            ),
            'testimonialInvitationUrl' => $invitationToken
                ? route('testimonial-invitations.show', $invitationToken)
                : null,
        ]);
    }

    public function create(string $resource): Response
    {
        $definition = $this->resolve($resource);

        return Inertia::render('Admin/Resource/Form', [
            'resource' => $definition->toArray(),
            'record' => null,
        ]);
    }

    public function store(Request $request, string $resource): RedirectResponse
    {
        $definition = $this->resolve($resource);
        $data = $request->validate($definition->rules(), [], $definition->validationAttributes());

        $record = $definition->newModel();
        $this->fill($record, $data, $definition);

        if ($definition->sortable && ! isset($data['sort_order'])) {
            // New rows land at the end rather than silently jumping to the top.
            $record->sort_order = (int) $definition->model::max('sort_order') + 1;
        }

        $record->save();
        $this->syncMedia($request, $record, $definition);

        return redirect()
            ->route('admin.resource.index', $definition->key)
            ->with('status', "{$definition->singular} created.");
    }

    public function edit(string $resource, int $id): Response
    {
        $definition = $this->resolve($resource);

        return Inertia::render('Admin/Resource/Form', [
            'resource' => $definition->toArray(),
            'record' => $this->present($definition->find($id), $definition),
        ]);
    }

    public function update(Request $request, string $resource, int $id): RedirectResponse
    {
        $definition = $this->resolve($resource);
        $data = $request->validate($definition->rules(), [], $definition->validationAttributes());

        $record = $definition->find($id);
        $this->fill($record, $data, $definition);
        $record->save();

        $this->syncMedia($request, $record, $definition);

        return redirect()
            ->route('admin.resource.index', $definition->key)
            ->with('status', "{$definition->singular} updated.");
    }

    public function destroy(string $resource, int $id): RedirectResponse
    {
        $definition = $this->resolve($resource);
        $definition->find($id)->delete();

        return redirect()
            ->route('admin.resource.index', $definition->key)
            ->with('status', "{$definition->singular} deleted.");
    }

    /**
     * Persist a new manual ordering.
     */
    public function reorder(Request $request, string $resource): RedirectResponse
    {
        $definition = $this->resolve($resource);

        abort_unless($definition->sortable, 404);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        foreach ($validated['ids'] as $position => $id) {
            $definition->model::whereKey($id)->update(['sort_order' => $position]);
        }

        return back()->with('status', "{$definition->plural} reordered.");
    }

    private function resolve(string $key): Resource
    {
        return AdminResources::find($key)
            ?? throw new NotFoundHttpException("Unknown admin resource [{$key}].");
    }

    /**
     * Copy validated input onto the model, translating field types that don't
     * map straight across.
     *
     * @param  array<string, mixed>  $data
     */
    private function fill($record, array $data, Resource $definition): void
    {
        foreach ($definition->fields as $field) {
            if ($field->isMedia()) {
                continue; // Handled by the media library, not a column.
            }

            if (! array_key_exists($field->name, $data)) {
                continue;
            }

            // Lists are typed one item per line and stored as a JSON array.
            $record->{$field->name} = $field->type === Field::LIST
                ? Str::of((string) ($data[$field->name] ?? ''))
                    ->explode("\n")
                    ->map(fn (string $line) => trim($line))
                    ->filter()
                    ->values()
                    ->all()
                : $data[$field->name];
        }

        if ($definition->sortable && isset($data['sort_order'])) {
            $record->sort_order = $data['sort_order'];
        }
    }

    /**
     * Attach uploaded files to the collection the field names.
     *
     * The collection comes from the field rather than being hard-coded: this
     * used to always write to the gallery's, so a second model with an image
     * would have filled a collection it never registered — no conversions, and
     * nothing raised to say so.
     */
    private function syncMedia(Request $request, $record, Resource $definition): void
    {
        foreach ($definition->fields as $field) {
            if (! $field->isMedia() || ! $request->hasFile($field->name)) {
                continue;
            }

            // IMAGE is a single-file collection, so this replaces. IMAGES
            // appends, and new files land after the ones already there.
            $files = $field->type === Field::IMAGES
                ? $request->file($field->name)
                : [$request->file($field->name)];

            foreach ($files as $file) {
                $record->addMedia($file)->toMediaCollection($field->collection);
            }
        }
    }

    /**
     * Delete one uploaded file.
     */
    public function destroyMedia(string $resource, int $id, int $media): RedirectResponse
    {
        $definition = $this->resolve($resource);
        $record = $definition->find($id);

        // Scoped through the record, so an id belonging to another model's
        // collection cannot be deleted by guessing the number.
        $record->media()->whereKey($media)->firstOrFail()->delete();

        return back()->with('status', 'Image deleted.');
    }

    /**
     * Persist a new order for a record's uploaded files.
     */
    public function reorderMedia(Request $request, string $resource, int $id): RedirectResponse
    {
        $definition = $this->resolve($resource);
        $record = $definition->find($id);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        // Only ids that belong to this record, for the same reason as above.
        $owned = $record->media()->pluck('id')->all();
        $ids = array_values(array_intersect($validated['ids'], $owned));

        Media::setNewOrder($ids);

        return back()->with('status', 'Images reordered.');
    }

    /**
     * Shape a record for the admin UI.
     *
     * @return array<string, mixed>
     */
    private function present($record, Resource $definition): array
    {
        $data = ['id' => $record->id];

        if ($definition->sortable) {
            $data['sort_order'] = $record->sort_order;
        }

        foreach ($definition->fields as $field) {
            $data[$field->name] = match ($field->type) {
                // The form edits lists as one item per line.
                Field::LIST => collect($record->{$field->name} ?? [])->implode("\n"),
                Field::IMAGE => $record->thumb_url ?? null,
                Field::IMAGES => $record->presentMedia($field->collection),
                default => $record->{$field->name},
            };
        }

        if ($definition->key === 'testimonials') {
            $data['status'] = $record->status;
        }

        return $data;
    }
}
