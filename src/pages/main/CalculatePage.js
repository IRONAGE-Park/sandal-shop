import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CalculateContainer from '../../container/main/CalculateContainer';
import { useDialog } from '../../hooks/useDialog';
import Paths from '../../paths';

const CalculatePage = ({ match, history }) => {
    const user = useSelector(state => state.user);
    const openDialog = useDialog();

    useEffect(() => {
        if (user.confirm !== 1) {
            // 권한을 가지지 않은 유저는 접근할 수 없음.
            openDialog('사용 승인 후 이용하실 수 있습니다.', '');
            history.push(Paths.main.index);
        }
    }, []);
    const { mode } = match.params; // 일간, 월간, 연간 매출 리스트 선택

    return <CalculateContainer mode={mode} />;
};

export default CalculatePage;
