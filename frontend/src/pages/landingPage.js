import Header from '../components/landingpage/header';
import HeroSection from '../components/landingpage/heroSection';
import WhySoftShares from '../components/landingpage/WhySoftShares';
import Statistics from '../components/landingpage/statistics';
import CallToAction from '../components/landingpage/callToAction';
import Footer from '../components/landingpage/footer';

function LandingPage() {
    return (
        <div>
            <Header />
            <HeroSection />
            <WhySoftShares />
            <Statistics />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default LandingPage;
