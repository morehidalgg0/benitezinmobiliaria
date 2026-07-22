export default function BrandLogo({ size = 'md', compact = false, className = '' }) {
  const sizes = {
    sm: {
      box: 'w-11 h-11',
      letter: 'text-5xl',
      name: 'text-[10px]',
      label: 'text-[9px]',
      gap: 'space-y-0.5',
    },
    md: {
      box: 'w-14 h-14',
      letter: 'text-6xl',
      name: 'text-xs',
      label: 'text-[10px]',
      gap: 'space-y-1',
    },
    lg: {
      box: 'w-24 h-24',
      letter: 'text-[7rem]',
      name: 'text-base',
      label: 'text-sm',
      gap: 'space-y-1.5',
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${compact ? 'gap-3' : 'gap-4'} ${className}`}>
      <div className={`${current.box} bg-brand flex items-center justify-center overflow-hidden shadow-lg shadow-brand/20`}>
        <span className={`${current.letter} leading-none font-serif text-white -mt-1`} aria-hidden="true">
          B
        </span>
      </div>
      <div className={`flex flex-col ${current.gap} leading-none`}>
        <span className={`${current.name} font-serif tracking-[0.2em] text-white uppercase`}>
          Benítez
        </span>
        <span className={`${current.label} font-serif tracking-[0.18em] text-white/80 uppercase`}>
          Inmobiliaria
        </span>
      </div>
    </div>
  );
}
