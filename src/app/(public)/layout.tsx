import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ScrollToTop from "@/components/layout/ScrollToTop";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <ScrollToTop />
    </>
  );
}
