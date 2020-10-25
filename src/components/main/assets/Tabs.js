import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import styles from './Tabs.module.scss';


const CustomTabs = ({ idx, categories, onChange }) => {

    const tabList = categories.map((category) => (
        <Tab
            label={category.ca_name}
            key={category.ca_name}
            className={styles['tab-item']}
        />
    ));

    return (
        <Tabs
            value={idx}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="auto"
            className={styles['tabs']}
        >
            {tabList}
        </Tabs>

    );
};

export default CustomTabs;
