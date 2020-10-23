import React from 'react';
import AccountContainer from '../../container/main/AccountContainer';

const AccountPage = ({ match }) => {
    
    const { modal } = match.params
    return <AccountContainer modal={modal} />;
};

export default AccountPage;
