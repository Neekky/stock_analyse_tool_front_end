export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};
import "aos/dist/aos.css";
import AOS from "aos";

import Hero from "./components/hero-home";
import BusinessCategories from "./components/business-categories";
import FeaturesPlanet from "./components/features-planet";
import LargeTestimonial from "./components/large-testimonial";
import Cta from "./components/cta";
import { useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });
  return (
    <>
      <Header />
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      <Cta />
      <Footer />
    </>
  );
}
