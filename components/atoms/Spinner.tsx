export default function Spinner() {
  return (
    <div className="flex justify-center h-screen w-full items-center">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
