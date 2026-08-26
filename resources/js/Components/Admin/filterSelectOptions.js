export function filterOptions(options, query) {
    const normalizedQuery = String(query ?? '').trim().toLocaleLowerCase();

    if (!normalizedQuery) {
        return options;
    }

    return options.filter((option) =>
        `${option.label} ${option.value}`.toLocaleLowerCase().includes(normalizedQuery),
    );
}
