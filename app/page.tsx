import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Residences } from "@/components/sections/Residences";
import { Amenities } from "@/components/sections/Amenities";
import { Tower } from "@/components/sections/Tower";
import { Location } from "@/components/sections/Location";
import { Gallery } from "@/components/sections/Gallery";
import { Enquire } from "@/components/sections/Enquire";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Residences />
        <Amenities />
        <Tower />
        <Location />
        <Gallery />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
