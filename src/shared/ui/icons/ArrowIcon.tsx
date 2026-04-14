import type { SVGProps } from 'react';

interface ArrowIconProps extends SVGProps<SVGSVGElement> {
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionClassMap = {
  right: 'rotate-0',
  down: 'rotate-90',
  left: 'rotate-180',
  up: '-rotate-90',
};

function ArrowIcon({ direction = 'right', className = '', ...props }: ArrowIconProps) {
  return (
    <svg
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-200 ${directionClassMap[direction]} ${className}`}
      {...props}
    >
      <path
        d="M0.000815392 1.05973L1.06182 -0.000272751L6.84082 5.77673C6.93397 5.86929 7.0079 5.97937 7.05835 6.10062C7.10879 6.22187 7.13477 6.3519 7.13477 6.48323C7.13477 6.61455 7.10879 6.74458 7.05835 6.86583C7.0079 6.98708 6.93397 7.09716 6.84082 7.18973L1.06182 12.9697L0.00181532 11.9097L5.42582 6.48473L0.000815392 1.05973Z"
        fill="#696969"
      />
    </svg>
  );
}

export default ArrowIcon;
