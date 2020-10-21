import React from 'react';
import qs from 'qs';
import MenuContainer from '../../container/main/MenuContainer';

const MenuPage = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const tab = query.tab ? query.tab : "0";
    const index = parseInt(tab);
    return <MenuContainer tab={index < 0 ? -index : index} />;
};

export default MenuPage;
