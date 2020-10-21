import React from 'react';

const getDirectionAngle = (vector) => {
    switch (vector) {
        case "TOP": return 90;    
        case "RIGHT": return 180;
        case "BOTTOM": return 270;
        default: return 0;
    }
}

export default ({ vector, fill }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="9.477"
        height="17.711"
        viewBox="0 0 9.477 17.711"
        style={{
            transform: `rotate(${getDirectionAngle(vector)}deg)`,
            transition: 'all .3s ease-in-out'
        }}
    >
        <path
            d="M0-24.378l8.94-8.856.537.531-8.4,8.325,8.4,8.324-.537.531Z"
            transform="translate(0 33.234)"
            fill={fill}
        />
    </svg>
);
