import React from 'react';
import CalculateContainer from '../../container/main/CalculateContainer';

const CalculatePage = ({ match }) => {
    const { mode } = match.params; // 일간, 월간, 연간 매출 리스트 선택

    return <CalculateContainer mode={mode} />;
};

export default CalculatePage;
