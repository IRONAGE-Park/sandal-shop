import React from 'react';
import styled from 'styled-components';
/* Library */

const SVG = styled.svg`
    width: 32px; height: 32px;
    vertical-align: middle;
    .group {
        circle {
            fill: #DBDBDB;
            transition: fill .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        path {
            stroke: #fff;
            transition: stroke .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @media screen and (max-width: 768px) {
            circle {
                fill: transparent;
            }
            path {
                stroke: #DBDBDB;
            }
        }
        &.checked {
            circle {
                fill: #008762;
            }
            @media screen and (max-width: 768px) {
                circle {
                    fill: transparent;
                }
                path {
                    stroke: #008762;
                }
            }
        }
    }
`;

export default ({ checked, size = 32 }) => (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ width: size, height: size }}>
        <g transform="translate(-430 -571)">
            <g className={"group " + (checked ? "checked" : "")}>
                <circle
                    cx="16" cy="16" r="16"
                    transform="translate(430 571)"
                />
                <path
                    d="M-2253.518-19278.807l4.73,4.537,9.305-10.486"
                    transform="translate(2692.018 19866.256)"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </g>
        </g>
    </SVG>
);
