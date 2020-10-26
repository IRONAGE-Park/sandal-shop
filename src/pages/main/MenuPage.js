import React, { useEffect } from 'react';
import qs from 'qs';
import MenuContainer from '../../container/main/MenuContainer';
import Paths from '../../paths';
import { useDialog } from '../../hooks/useDialog';
import { useSelector } from 'react-redux';

const MenuPage = ({ location, history }) => {
    const user = useSelector(state => state.user);
    const openDialog = useDialog();

    useEffect(() => {
        if (user.confirm !== 1) {
            // 권한을 가지지 않은 유저는 접근할 수 없음.
            openDialog('사용 승인 후 이용하실 수 있습니다.', '');
            history.push(Paths.main.index);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const tab = query.tab ? query.tab : "0";
    const index = parseInt(tab);
    return <MenuContainer tab={index < 0 ? -index : index} />;
};

export default MenuPage;
