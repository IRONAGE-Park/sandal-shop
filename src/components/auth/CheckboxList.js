import React from 'react';
/* Library */

import Checkbox from './Checkbox';
/* Components */

export default ({ checkedList, handleListToggle }) => {
    const renderCheckedList = checkedList.map(
        ({ id, checked, title, detail, text }) => (
            <Checkbox
                key={id}
                checked={checked}
                title={title}
                detail={detail}
                text={text}
                handleToggle={() => handleListToggle(id)}
            />
        ),
    );
    return renderCheckedList;
};
