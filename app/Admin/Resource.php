<?php

namespace App\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Describes one manageable content type.
 *
 * The admin is entirely driven by these definitions: routes, validation, the
 * index table and the edit form all read from here, so adding a content type
 * means adding a definition rather than another near-identical controller.
 */
class Resource
{
    /**
     * @param  class-string<Model>  $model
     * @param  array<int, Field>  $fields
     * @param  array<int, string>  $columns  Field names shown in the index table.
     */
    public function __construct(
        public readonly string $key,
        public readonly string $model,
        public readonly string $singular,
        public readonly string $plural,
        public readonly array $fields,
        public readonly array $columns,
        public readonly bool $sortable = true,
        public readonly ?string $description = null,
        public readonly string $navSection = 'shared',
    ) {}

    public function newQuery()
    {
        $query = $this->model::query();

        return $this->sortable ? $query->ordered() : $query->orderBy('id');
    }

    public function newModel(): Model
    {
        return new $this->model;
    }

    public function find(int $id): Model
    {
        return $this->model::findOrFail($id);
    }

    /**
     * Validation rules, assembled from the field definitions.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [];

        foreach ($this->fields as $field) {
            $rules[$field->name] = $field->rules;

            // A multi-upload validates twice: the field itself as an array,
            // and every file in it. Without the second, one bad file in a
            // batch of ten would be stored unchecked.
            if ($field->itemRules !== []) {
                $rules["{$field->name}.*"] = $field->itemRules;
            }
        }

        if ($this->sortable) {
            $rules['sort_order'] = ['nullable', 'integer', 'min:0'];
        }

        return $rules;
    }

    /**
     * Human names for the validation messages.
     *
     * Without these a rejected file reads "The screenshots.1 field must be an
     * image", which exposes the array index to someone who never typed one.
     *
     * @return array<string, string>
     */
    public function validationAttributes(): array
    {
        $attributes = [];

        foreach ($this->fields as $field) {
            $label = Str::lower($field->label);

            $attributes[$field->name] = $label;

            if ($field->itemRules !== []) {
                $attributes["{$field->name}.*"] = Str::singular($label);
            }
        }

        return $attributes;
    }

    public function field(string $name): ?Field
    {
        foreach ($this->fields as $field) {
            if ($field->name === $name) {
                return $field;
            }
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'description' => $this->description,
            'nav_section' => $this->navSection,
            'sortable' => $this->sortable,
            'columns' => $this->columns,
            'fields' => array_map(fn (Field $f) => $f->toArray(), $this->fields),
        ];
    }
}
