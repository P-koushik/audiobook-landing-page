import { Evening, Night } from "@/components/landing/Evening";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingRoot } from "@/components/landing/LandingRoot";
import { Listen } from "@/components/landing/Listen";
import { Nav } from "@/components/landing/Nav";
import { Notes } from "@/components/landing/Notes";
import { Ticker } from "@/components/landing/Ticker";
import "./landing.css";

export default function Home() {
  return (
    <LandingRoot>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Listen />
        <HowItWorks />
        <Notes />
        <Evening />
        <Night />
      </main>
    </LandingRoot>
  );
}
