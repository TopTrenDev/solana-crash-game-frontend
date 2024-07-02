import Header from '@/pages/layout/header';
import Footer from '@/pages/layout/footer';
import Slider from './slider';
import Description from './description';
import Feature from './feature';
import Prove from './prove';
import LearnMore from './learnMore';
import BiggistWinner from './biggistWinner';

export default function Home() {
  return (
    <>
      {/* <Header isApp={false} /> */}
      <div className="mt-[50px]">
        {/* <div className="bg-[url('/src/assets/img/mid-cloud.svg')] bg-bottom"> */}
        <Slider />
        <Description />
      </div>
      <Feature />
      <Prove />
      <div className="bg-[url('/src/assets/img/starry-sky.svg')]">
        <BiggistWinner />
        <LearnMore />
      </div>
      <Footer />
    </>
  );
}
