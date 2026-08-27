export default function CertificationPreview({ attachment, name }) {
    if (!attachment) return null;

    const openLabel = `Open ${name} certificate`;

    return (
        <div className="group relative mb-4 aspect-4/3 overflow-hidden rounded-md border border-border bg-base/70">
            {attachment.kind === 'image' ? (
                <img
                    src={attachment.preview_url}
                    alt={`${name} certificate`}
                    loading="lazy"
                    className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.015]"
                />
            ) : (
                <>
                    <object
                        data={`${attachment.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        type="application/pdf"
                        aria-label={`${name} PDF preview`}
                        className="pointer-events-none size-full bg-white"
                    >
                        <div className="flex size-full flex-col items-center justify-center gap-2 text-fg-dim">
                            <span className="rounded border border-red-400/30 bg-red-400/10 px-3 py-2 font-mono text-xs text-red-300">
                                PDF
                            </span>
                            <span className="text-xs">Preview unavailable</span>
                        </div>
                    </object>
                </>
            )}

            <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                aria-label={openLabel}
                className="absolute inset-0 flex items-end justify-end p-2 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-dev-bright"
            >
                <span className="rounded bg-base/85 px-2 py-1 font-mono text-[10px] text-fg shadow backdrop-blur-sm transition-colors group-hover:text-dev-bright">
                    Open {attachment.kind === 'pdf' ? 'PDF' : 'image'} ↗
                </span>
            </a>
        </div>
    );
}
