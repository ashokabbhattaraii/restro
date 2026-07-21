import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span>404</span>
      <h1>Lost in the Mountains</h1>
      <p>The page you are looking for is not on tonight&apos;s menu.</p>
      <Button href="/">Return Home</Button>
    </main>
  );
}
