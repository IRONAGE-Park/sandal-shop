import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Tabs from '../../components/main/assets/Tabs';
import MenuList from '../../components/main/menu/MenuList';
import Paths from '../../paths';
import { getCategories, getMenuList, updateMenu } from '../../store/menu';

import styles from './MenuContainer.module.scss';

const MenuContainer = ({ tab }) => {
    const history = useHistory();
    const { categories, menus } = useSelector(state => state.menu);
    const reduxDispatch = useDispatch();

    const handleChangeItemState = useCallback(id => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토근이 존재함 => 로그인 된 상태. */
            reduxDispatch(updateMenu({ JWT_TOKEN, item_id: id, ca_index: tab }));
        }
    }, [reduxDispatch, tab]);

    useEffect(() => {
        if (menus[tab] === undefined) {
            if (categories) {
                const JWT_TOKEN = sessionStorage.getItem('user_token');
                if (JWT_TOKEN) {
                    reduxDispatch(getMenuList({ JWT_TOKEN, ca_id: categories[tab].ca_id, index: tab }));
                }
            }
        }
    }, [tab, menus, categories, reduxDispatch])

    useEffect(() => {
        if (categories === null) {
            const JWT_TOKEN = sessionStorage.getItem('user_token');
            if (JWT_TOKEN) {
                /* 토근이 존재함 => 로그인 된 상태. */
                reduxDispatch(getCategories(JWT_TOKEN));
            }
        }
    }, [categories, reduxDispatch]);

    return (
        <div className={styles['container']}>
            <div className={styles['tab']}>
                {categories !== null && categories.length &&
                <Tabs
                    idx={tab}
                    categories={categories}
                    onChange={path => history.push(Paths.main.menu + '?tab=' + path)}
                />}
            </div>
            <div className={styles['content']}>
                {menus[tab] && <MenuList list={menus[tab]} handleChange={handleChangeItemState} />}
            </div>
        </div>
    );
};

export default MenuContainer;