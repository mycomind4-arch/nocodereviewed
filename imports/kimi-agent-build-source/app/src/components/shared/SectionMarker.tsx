interface SectionMarkerProps {
  number: string;
  label: string;
}

export default function SectionMarker({ number, label }: SectionMarkerProps) {
  return (
    <div className="relative mb-8">
      <span className="depth-marker block">{number}</span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 leading-tight">
        {label}
      </h2>
    </div>
  );
}
