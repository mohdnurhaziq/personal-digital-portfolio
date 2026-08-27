<?php

namespace App\Admin;

/**
 * One editable field on an admin form.
 *
 * `type` drives both the input the React form renders and how the value is
 * read back, so a field is declared once rather than in a controller, a form
 * request, and a component separately.
 */
class Field
{
    public const TEXT = 'text';

    public const TEXTAREA = 'textarea';

    public const NUMBER = 'number';

    public const URL = 'url';

    public const EMAIL = 'email';

    public const SELECT = 'select';

    /** Newline-separated input stored as a JSON array. */
    public const LIST = 'list';

    /** One uploaded image, replaced on re-upload. */
    public const IMAGE = 'image';

    /** One uploaded document or image, replaced on re-upload. */
    public const FILE = 'file';

    /** Many uploaded images, hand-ordered, deleted individually. */
    public const IMAGES = 'images';

    /**
     * @param  array<int, string>  $rules
     * @param  array<int, array<string, mixed>>  $options
     * @param  array<int, string>  $itemRules  Per-file rules for IMAGES, applied to `name.*`.
     */
    public function __construct(
        public readonly string $name,
        public readonly string $label,
        public readonly string $type = self::TEXT,
        public readonly array $rules = ['nullable', 'string'],
        public readonly array $options = [],
        public readonly ?string $help = null,
        // Named explicitly rather than inferred from the model. The controller
        // used to hard-code the gallery's collection for every image field, so
        // a second model with an image would have written into a collection it
        // had never registered — no conversions, and no error to say so.
        public readonly ?string $collection = null,
        public readonly array $itemRules = [],
        public readonly bool $searchable = false,
        public readonly ?string $accept = null,
    ) {}

    /**
     * @param  array<int, string>  $rules
     * @param  array<int, array<string, mixed>>  $options
     * @param  array<int, string>  $itemRules
     */
    public static function make(
        string $name,
        string $label,
        string $type = self::TEXT,
        array $rules = ['nullable', 'string'],
        array $options = [],
        ?string $help = null,
        ?string $collection = null,
        array $itemRules = [],
        bool $searchable = false,
        ?string $accept = null,
    ): self {
        return new self($name, $label, $type, $rules, $options, $help, $collection, $itemRules, $searchable, $accept);
    }

    public function isMedia(): bool
    {
        return in_array($this->type, [self::IMAGE, self::IMAGES, self::FILE], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'label' => $this->label,
            'type' => $this->type,
            'options' => $this->options,
            'help' => $this->help,
            'required' => in_array('required', $this->rules, true),
            'searchable' => $this->searchable,
            'accept' => $this->accept,
        ];
    }
}
