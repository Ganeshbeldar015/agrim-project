import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFDFB]">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {/* Added a subtle global fade-in effect for page transitions */}
        <div className="animate-in fade-in duration-700">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;