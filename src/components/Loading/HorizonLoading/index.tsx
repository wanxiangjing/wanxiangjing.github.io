// DotsLoader.tsx
import React from 'react';
import styles from './index.module.scss';

interface DotsLoaderProps {
  speed?: number; // 动画速度（秒）
  color?: string; // 圆点颜色
  size?: number; // 圆点大小（px）
}

const DotsLoader: React.FC<DotsLoaderProps> = ({
  speed = 0.5,
  color = '#ffffffff',
  size = 6,
}) => {
  return (
    <div className={styles.container}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={styles.dot}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDelay: `${(index * (speed / 6)).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default DotsLoader;