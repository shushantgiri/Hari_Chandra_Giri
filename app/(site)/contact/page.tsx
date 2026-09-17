import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Hari Chandra Giri's team for media, events, brand partnerships, demonstrations, speaking and record enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <ContactForm />
    </div>
  );
}
