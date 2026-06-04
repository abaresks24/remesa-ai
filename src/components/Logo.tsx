export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative h-7 w-7">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_0_24px_rgba(16,185,129,0.45)]" />
        <div className="absolute inset-[5px] rounded-full bg-black/60 backdrop-blur" />
        <div className="absolute inset-[10px] rounded-full bg-gradient-to-tr from-amber-300 via-rose-400 to-emerald-300" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">
        Remesa<span className="text-emerald-400">.ai</span>
      </span>
    </div>
  );
}
