import React from 'react';
import qs from 'qs';
import SupportContainer from '../../container/main/support/SupportContainer';

const SupportPage = ({ match, location }) => {
    const { mode, modal } = match.params;

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true
    });
    const { id } = query;

    return <SupportContainer mode={mode ? mode : 'notice'} modal={modal} id={id} />;
};

export default SupportPage;
