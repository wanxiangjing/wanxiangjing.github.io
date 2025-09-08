import React from 'react';
interface SvgIconProps {
    name: typeof import('virtual:svg-icons-names')['iconNames'][number];
    className?: string;
    style?: React.CSSProperties;
}
export declare const SvgIcon: React.FC<SvgIconProps>;
export {};
