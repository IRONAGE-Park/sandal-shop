import React from 'react';
import PolicyContainer from '../container/PolicyContainer';

const PolicyPage = ({ match }) => {
    const { mode } = match.params; // 개인정보 처리방침, 이용약관
    return <PolicyContainer mode={mode ? mode : 'privacy'} url={match.path.split(':')[0]} />;
};

export default PolicyPage;
