import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CustomTabs from '../../components/main/assets/Tabs';
import MenuList from '../../components/main/menu/MenuList';
import Paths from '../../paths';
import { getCategories, getMenuList, updateMenu } from '../../store/menu';

import styles from './MenuContainer.module.scss';

const cn = classnames.bind(styles);

const MenuContainer = ({ tab }) => {
    const history = useHistory();
    const { categories, menus } = useSelector(state => state.menu);
    const { close } = useSelector(state => state.header); // 헤더를 열고 닫기 위한 객체.
    const reduxDispatch = useDispatch();

    const handleChangeItemState = useCallback(id => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토근이 존재함 => 로그인 된 상태. */
            reduxDispatch(updateMenu({ JWT_TOKEN, item_id: id, ca_index: tab }));
        }
    }, [reduxDispatch, tab]);

    useEffect(() => {
        if (menus[tab] === undefined) {
            if (categories) {
                const JWT_TOKEN = localStorage.getItem('user_token');
                if (JWT_TOKEN) {
                    reduxDispatch(getMenuList({ JWT_TOKEN, ca_id: categories[tab].ca_id, index: tab }));
                }
            }
        }
    }, [tab, menus, categories, reduxDispatch])

    useEffect(() => {
        if (categories === null) {
            const JWT_TOKEN = localStorage.getItem('user_token');
            if (JWT_TOKEN) {
                /* 토근이 존재함 => 로그인 된 상태. */
                reduxDispatch(getCategories(JWT_TOKEN));
            }
        }
    }, [categories, reduxDispatch]);

    return (
        <div className={styles['container']}>
            <div className={cn('tab', { close })}>
                {categories !== null &&
                categories.length &&
                <CustomTabs
                    idx={tab}
                    categories={categories}
                    onChange={(e,path) => history.push(Paths.main.menu + '?tab=' + path)}
                />}
            </div>
            <div className={styles['content']}>
                {menus[tab] && <MenuList list={menus[tab]} handleChange={handleChangeItemState} />}
            </div>
        </div>
    );
};

export default MenuContainer;