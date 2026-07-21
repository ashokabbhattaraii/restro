import ErrorBoundary from "@/components/shared/ErrorBoundary";
import CulturalSection from "@/components/sections/about/CulturalSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import StorySection from "@/components/sections/about/StorySection";
import TeamSection from "@/components/sections/about/TeamSection";

export default function AboutPage() {
  return (
    <main>
      <ErrorBoundary><StorySection /></ErrorBoundary>
      <ErrorBoundary><MissionVisionSection /></ErrorBoundary>
      <ErrorBoundary><TeamSection /></ErrorBoundary>
      <ErrorBoundary><CulturalSection /></ErrorBoundary>
    </main>
  );
}
