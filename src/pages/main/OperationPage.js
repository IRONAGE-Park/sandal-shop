import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import OperationContainer from '../../container/main/OperationContainer';
import { useDialog } from '../../hooks/useDialog';
import Paths from '../../paths';


const OperationPage = ({ match, history }) => {
    const user = useSelector(state => state.user);
    const openDialog = useDialog();

    useEffect(() => {
        if (user.confirm !== 1) {
            // 권한을 가지지 않은 유저는 접근할 수 없음.
            openDialog('사용 승인 후 이용하실 수 있습니다.', '');
            history.push(Paths.main.index);
        }
    }, []);

    const { mode } = match.params; // 영업시간 / 휴무일 / 변경 상태 유무
    return (<OperationContainer mode={mode ? mode : "time"} />);
};

export default OperationPage;