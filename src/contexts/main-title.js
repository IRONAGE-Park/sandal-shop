import React, { createContext, useState } from 'react';

const TitleContext = createContext({
    title: '에러 페이지',
    setTitle: () => {}
});

const TitleProvider = ({ children }) => {
    const [title, setTitle] = useState('에러 페이지');

    const value = {
        title,
        setTitle
    };

    return <TitleContext.Provider value={value}>{children}</TitleContext.Provider>;
};

const { Consumer: TitleConsumer } = TitleContext;
export { TitleProvider, TitleConsumer };

export default TitleContext;