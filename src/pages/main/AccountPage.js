import React from 'react';
import qs from 'qs';
import AccountContainer from '../../container/main/AccountContainer';

const AccountPage = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    
    return <AccountContainer query={query} />;
};

export default AccountPage;
