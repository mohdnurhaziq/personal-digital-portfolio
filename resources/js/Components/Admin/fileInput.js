/**
 * Styling for `<input type="file">`.
 *
 * A bare file input on a dark panel is a poor target: the browser draws a
 * small native button at the left and leaves the rest of the control inert
 * "No file chosen" text, so it reads as a text box and the actual button is
 * easy to miss entirely. The `file:` variants restyle the button part into
 * something that looks like the site's own buttons.
 *
 * Native `<input type="file">` is kept rather than hidden behind a prettier
 * one: it carries the label association, keyboard behaviour and the OS picker
 * for free, and every hand-rolled replacement gives one of those up.
 */
export const fileInputClass =
    'w-full cursor-pointer rounded border border-border bg-panel text-sm text-fg-dim ' +
    'file:mr-4 file:cursor-pointer file:rounded-l file:border-0 file:bg-fg file:px-4 file:py-2 ' +
    'file:text-sm file:font-medium file:text-base hover:border-dev';
