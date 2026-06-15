import Head from 'next/head';
import Banner from '@/components/home/Banner';
import TrendingIdeas from '@/components/home/TrendingIdeas';
import { HowItWorks, CategoriesSection } from '@/components/home/HomeExtras';

export default function Home() {
  return (
    <>
      <Head>
        <title>IdeaVault | Share & Validate Startup Ideas</title>
        <meta
          name="description"
          content="IdeaVault is a community-driven platform to share startup ideas, get feedback, and discover trending innovations."
        />
      </Head>
      <Banner />
      <TrendingIdeas />
      <HowItWorks />
      <CategoriesSection />
    </>
  );
}
