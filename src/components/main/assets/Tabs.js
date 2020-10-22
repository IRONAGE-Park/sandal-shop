import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import SwipeableTabs from 'react-swipeable-tabs';
import { ButtonBase } from '@material-ui/core';

import styles from './Tabs.module.scss';

const cn = classnames.bind(styles);

const Tabs = ({ idx, categories, onChange }) => {

    const [mobile, setMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        console.log(mobile);
    }, [mobile])

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [])

    const resize = () => {
        setMobile(window.innerWidth <= 768);
    };

    const pc_active = {
        border: "1px solid #DBDBDB",
        color: "#222",
    }
    const mobile_active = {
        color: "#222",
        fontWeight: "500"
    }
    return (
        <div className={cn('tab')}>
            <div className={styles['mobile']}>
            < SwipeableTabs
                noFirstLeftPadding={false}
                noLastRightPadding={false}
                fitItems={true}
                alignCenter={false}
                borderWidthRatio={1}
                activeItemIndex={idx}
                onItemClick={(item, index) => onChange(index)}
                items={categories.map((category) => (
                    <Tab ca_name={category.ca_name} />
                ))}
                borderPosition="bottom"
                borderThickness={4}
                itemClassName={styles['item']}
                borderColor={"#007246"}
                activeStyle={mobile_active}
            />
            </div>
            <div className={styles['pc']}>
            < SwipeableTabs
                noFirstLeftPadding={false}
                noLastRightPadding={false}
                fitItems={true}
                alignCenter={false}
                borderWidthRatio={1}
                activeItemIndex={idx}
                onItemClick={(item, index) => onChange(index)}
                items={categories.map((category) => (
                    <Tab ca_name={category.ca_name} />
                ))}
                borderPosition="bottom"
                borderThickness={1}
                itemClassName={styles['item']}
                borderColor={"transparent"}
                activeStyle={pc_active}
            />
            </div>
      

        </div>
    );
};

const Tab = ({ ca_name }) => (
    <ButtonBase className={styles['ca_name']}>{ca_name}</ButtonBase>
);

export default Tabs;
