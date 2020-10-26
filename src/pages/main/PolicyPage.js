import React from 'react';
import PolicyContainer from '../../container/main/PolicyContainer';

const PolicyPage = ({ match}) => {

    const { mode } = match.params; // 신규/처리중, 완료, 취소 리스트 선택

    return <PolicyContainer  mode={mode ? mode :'privacy'}/>
};

export default PolicyPage;