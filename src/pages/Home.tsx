import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Showcase } from '../components/Showcase';
import { Download } from '../components/Download';

export const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Showcase />
      <Download />
    </main>
  );
};
