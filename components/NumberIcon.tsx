export function NumberIcon({ label }: { label: number }) {
  return (
    <div className="bg-black text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
      {label}
    </div>
  );
}
