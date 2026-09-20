import WeCanLoading from "@/components/ui/WeCanLoading";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <WeCanLoading />
    </div>
  );
}
