import type { PropsWithChildren, ReactNode } from 'react';

type SectionProps = PropsWithChildren<{
  title: string;
  headerRight?: ReactNode;
}>;

function Section({ title, headerRight, children }: SectionProps) {
  return (
    <section className="w-full px-5 py-10" aria-label={title}>
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {headerRight}
      </header>

      {children}
    </section>
  );
}

export default Section;
