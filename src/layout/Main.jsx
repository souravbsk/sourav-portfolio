import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className='bg-site bg-no-repeat bg-cover overflow-hidden h-[4000px]'>
            <Header></Header>
            <main className='mt-24'>
                <Outlet></Outlet>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default Main;