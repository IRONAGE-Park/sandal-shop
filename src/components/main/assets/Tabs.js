import React from 'react';
import classnames from 'classnames/bind';

import SwipeableTabs from 'react-swipeable-tabs';
import { ButtonBase } from '@material-ui/core';

import styles from './Tabs.module.scss';

const cn = classnames.bind(styles);

const Tabs = ({ idx, categories, onChange }) => {
    return (
        <div className={cn('tab')}>
            <SwipeableTabs
                noFirstLeftPadding={false}
                noLastRightPadding={false}
                fitItems={true}
                borderWidthRatio={1}
                activeItemIndex={idx}
                onItemClick={(item, index) => onChange(index)}
                items={categories.map((category) => (
                    <Tab ca_name={category.ca_name} />
                ))}
                borderPosition="bottom"
                borderThickness={4}
                itemClassName={styles['item']}
                borderColor="#007246"
                activeStyle={{color: '#007246'}}
            />
        </div>
    );
};

const Tab = ({ ca_name }) => (
    <ButtonBase className={styles['ca_name']}>{ca_name}</ButtonBase>
);

export default Tabs;
