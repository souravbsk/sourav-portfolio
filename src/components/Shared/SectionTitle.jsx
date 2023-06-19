import React from 'react';

const SectionTitle = ({title}) => {
    return (
        <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">{title}</h2>
      </div>
    );
};

export default SectionTitle;