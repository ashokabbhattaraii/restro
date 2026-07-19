import ErrorBoundary from "@/components/shared/ErrorBoundary";
import CulturalSection from "@/components/sections/about/CulturalSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import OwnerMessageSection from "@/components/sections/about/OwnerMessageSection";
import StorySection from "@/components/sections/about/StorySection";
import TeamSection from "@/components/sections/about/TeamSection";

export default function AboutPage() {
  return (
    <main>
      <ErrorBoundary><StorySection /></ErrorBoundary>
      <ErrorBoundary><MissionVisionSection /></ErrorBoundary>
      <ErrorBoundary><OwnerMessageSection /></ErrorBoundary>
      <ErrorBoundary><TeamSection /></ErrorBoundary>
      <ErrorBoundary><CulturalSection /></ErrorBoundary>
    </main>
  );
}
