export default function BrandLogo({ size = 'md', compact = false, className = '' }) {
  const sizes = {
    sm: {
      box: 'w-14 h-14',
      letter: 'text-[4.6rem]',
      name: 'text-[8px]',
      label: 'text-[8px]',
      nameTop: 'top-[45%]',
      labelBottom: 'bottom-1.5',
    },
    md: {
      box: 'w-20 h-20',
      letter: 'text-[6.8rem]',
      name: 'text-[11px]',
      label: 'text-[11px]',
      nameTop: 'top-[45%]',
      labelBottom: 'bottom-2.5',
    },
    lg: {
      box: 'w-36 h-36',
      letter: 'text-[12rem]',
      name: 'text-xl',
      label: 'text-xl',
      nameTop: 'top-[44%]',
      labelBottom: 'bottom-5',
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${className}`} aria-label="Benítez Inmobiliaria">
      <div className={`${current.box} relative bg-brand overflow-hidden shadow-lg shadow-brand/20`}>
        <span
          className={`absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 ${current.letter} leading-none font-serif text-white select-none`}
          aria-hidden="true"
        >
          B
        </span>
        <span className={`absolute left-1/2 ${current.nameTop} -translate-x-1/2 -translate-y-1/2 ${current.name} font-serif tracking-[0.12em] text-white uppercase leading-none`}>
          Benitez
        </span>
        <span className={`absolute left-1/2 ${current.labelBottom} -translate-x-1/2 ${current.label} font-serif tracking-[0.11em] text-white uppercase leading-none`}>
          Inmobiliaria
        </span>
      </div>
    </div>
  );
}
