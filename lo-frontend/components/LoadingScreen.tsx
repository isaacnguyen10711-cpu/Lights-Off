import { Loader } from "lucide-react";

// full screen spinner while a page waits for its data
const LoadingScreen = () => {
  return (
    <div role="status" className="flex min-h-screen items-center justify-center">
      <Loader className="size-8 md:size-10 animate-spin text-muted" />
      {/* the icon means nothing to a screen reader, so say it in words too */}
      <div className="sr-only">Loading</div>
    </div>
  );
}

export default LoadingScreen;
