import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('All Produce');
    const [triggerSearch, setTriggerSearch] = useState(0); // Used to signal Home.jsx to scroll and filter

    const performSearch = () => {
        setTriggerSearch(prev => prev + 1);
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchCategory,
            setSearchCategory,
            triggerSearch,
            performSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
