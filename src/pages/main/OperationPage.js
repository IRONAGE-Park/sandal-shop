import React from 'react';
import OperationContainer from '../../container/main/OperationContainer';


const OperationPage = ({ match }) => {
    const { mode } = match.params; // 영업시간 / 휴무일 / 변경 상태 유무
    return (<OperationContainer mode={mode ? mode : "time"} />);
};

export default OperationPage;