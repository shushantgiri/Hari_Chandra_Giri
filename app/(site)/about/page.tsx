import type { Metadata } from "next";
import { About } from "@/components/about/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hari Chandra Giri is a Nepalese hand-walking athlete and seven-time Guinness World Records title holder, based at the Nepal Army Sports Centre.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <About />
    </div>
  );
}
