export default function BrandLogo({ size = 'md', compact = false, className = '' }) {
  const sizes = {
    sm: {
      box: 'w-11 h-11',
      letter: 'text-5xl',
      name: 'text-xs',
      label: 'text-[10px]',
    },
    md: {
      box: 'w-14 h-14',
      letter: 'text-6xl',
      name: 'text-sm',
      label: 'text-xs',
    },
    lg: {
      box: 'w-24 h-24',
      letter: 'text-[7rem]',
      name: 'text-lg',
      label: 'text-base',
    },
  };

  const current = sizes[size] || sizes.md;
  const layoutClass = compact ? 'flex-row gap-3' : 'flex-col gap-3 text-center';

  return (
    <div className={`inline-flex ${layoutClass} items-center ${className}`} aria-label="Benítez Inmobiliaria">
      <div className={`${current.box} bg-brand flex items-center justify-center overflow-hidden shadow-lg shadow-brand/20`}>
        <span className={`${current.letter} leading-none font-serif text-white -mt-1 select-none`} aria-hidden="true">
          B
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${current.name} font-serif tracking-[0.2em] text-white uppercase`}>Benítez</span>
        <span className={`${current.label} mt-1 font-serif tracking-[0.18em] text-white/80 uppercase`}>Inmobiliaria</span>
      </div>
    </div>
  );
}
