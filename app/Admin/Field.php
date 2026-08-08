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

    public const IMAGE = 'image';

    public function __construct(
        public readonly string $name,
        public readonly string $label,
        public readonly string $type = self::TEXT,
        public readonly array $rules = ['nullable', 'string'],
        public readonly array $options = [],
        public readonly ?string $help = null,
    ) {}

    public static function make(string $name, string $label, string $type = self::TEXT, array $rules = ['nullable', 'string'], array $options = [], ?string $help = null): self
    {
        return new self($name, $label, $type, $rules, $options, $help);
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
        ];
    }
}
