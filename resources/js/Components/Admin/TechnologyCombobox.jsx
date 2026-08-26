import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { useMemo, useState } from 'react';
import { FiCheck, FiChevronDown, FiSearch } from 'react-icons/fi';
import { filterOptions } from './filterSelectOptions';

export default function TechnologyCombobox({ field, value, onChange, className }) {
    const [query, setQuery] = useState('');
    const selectedOption = field.options.find((option) => option.value === value);
    const filteredOptions = useMemo(
        () => filterOptions(field.options, query),
        [field.options, query],
    );

    return (
        <Combobox
            value={value || null}
            onChange={(nextValue) => onChange(nextValue ?? '')}
            onClose={() => setQuery('')}
        >
            <div className="relative">
                <FiSearch
                    className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-fg-dim"
                    aria-hidden="true"
                />
                <ComboboxInput
                    id={field.name}
                    name={field.name}
                    className={`${className} pl-9 pr-10`}
                    aria-describedby={field.help ? `${field.name}-help` : undefined}
                    aria-label={`Search ${field.label.toLowerCase()}`}
                    displayValue={() => selectedOption?.label ?? ''}
                    placeholder="Search technologies…"
                    autoComplete="off"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <ComboboxButton
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-fg-dim transition-colors hover:text-fg"
                    aria-label="Show all technologies"
                >
                    <FiChevronDown className="size-4" aria-hidden="true" />
                </ComboboxButton>

                <ComboboxOptions
                    transition
                    modal={false}
                    className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded border border-border bg-panel py-1 shadow-xl outline-none transition duration-100 ease-out data-closed:-translate-y-1 data-closed:opacity-0"
                >
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-3 text-sm text-fg-dim">No technologies found.</div>
                    ) : (
                        filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.value}
                                value={option.value}
                                className="group flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-fg outline-none data-focus:bg-dev/10 data-focus:text-dev-bright"
                            >
                                <span className="truncate">{option.label}</span>
                                <FiCheck
                                    className="hidden size-4 shrink-0 text-dev-bright group-data-selected:block"
                                    aria-hidden="true"
                                />
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
}
