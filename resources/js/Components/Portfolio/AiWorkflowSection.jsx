import Reveal from './Reveal';
import Section from './Section';

const workflowStages = (settings) => [
    {
        title: 'Frame the work',
        body: settings.dev_ai_discovery,
    },
    {
        title: 'Build with context',
        body: settings.dev_ai_delivery,
    },
    {
        title: 'Verify and own it',
        body: settings.dev_ai_verification,
    },
];

export default function AiWorkflowSection({ settings, theme }) {
    const tools = (settings.dev_ai_tools ?? '')
        .split('\n')
        .map((tool) => tool.trim())
        .filter(Boolean);

    return (
        <Section title={settings.dev_ai_title} theme={theme}>
            <Reveal className="overflow-hidden rounded-[10px] border border-border bg-panel-glass backdrop-blur-[6px]">
                <div className="grid gap-8 border-b border-border p-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)] lg:p-10">
                    <p className="max-w-2xl font-display text-xl leading-relaxed font-medium text-fg sm:text-2xl">
                        {settings.dev_ai_intro}
                    </p>

                    {tools.length > 0 && (
                        <div className="lg:justify-self-end">
                            <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-dev-bright uppercase">
                                Tools in the loop
                            </p>
                            <ul className="flex max-w-sm flex-wrap gap-2">
                                {tools.map((tool) => (
                                    <li
                                        key={tool}
                                        className="rounded-full border border-dev/30 bg-dev/10 px-3 py-1.5 font-mono text-xs text-fg"
                                    >
                                        {tool}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <ol className="grid md:grid-cols-3">
                    {workflowStages(settings).map((stage, index) => (
                        <li
                            key={stage.title}
                            className="border-t border-border p-7 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0 lg:p-9"
                        >
                            <span
                                aria-hidden="true"
                                className="font-mono text-xs tracking-[0.12em] text-dev-bright"
                            >
                                0{index + 1}
                            </span>
                            <h3 className="mt-4 font-display text-xl font-semibold text-fg">
                                {stage.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-fg-dim">{stage.body}</p>
                        </li>
                    ))}
                </ol>

                <div className="flex flex-col gap-2 border-t border-dev/30 bg-dev/10 px-7 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <p className="font-mono text-[11px] tracking-[0.14em] text-dev-bright uppercase">
                        Human-owned output
                    </p>
                    <p className="text-sm font-medium text-fg">
                        AI accelerates the loop. I decide what ships.
                    </p>
                </div>
            </Reveal>
        </Section>
    );
}
