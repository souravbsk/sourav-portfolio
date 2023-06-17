import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import About from '../About/About';
import WorkOverView from '../WorkOverView/WorkOverView';
import Skilles from '../Skilles/Skilles';
import Projects from '../Projects/Projects';
import Contact from '../Contact/Contact';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <About></About>
            <WorkOverView></WorkOverView>
            <Skilles></Skilles>
            <Projects></Projects>
            <Contact></Contact>
        </div>
    );
};

export default Home;