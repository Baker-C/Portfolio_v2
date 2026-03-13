export interface SegmentedArrowProps {
  color?: string;
  size?: number | string;
  className?: string;
}

const defaultSize = 256;

export function SegmentedArrow({
  color = 'currentColor',
  size = defaultSize,
  className,
}: SegmentedArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
      className={className}
      style={{ display: 'block' }}
    >
      <g
        style={{
          stroke: 'none',
          strokeWidth: 0,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
          fill: 'inherit',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
      >
        <rect
          x="79.35"
          y="0"
          rx="0"
          ry="0"
          width="4.03"
          height="5.15"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
        />
        <path
          d="M 79.146 53.745 l -3.57 -1.863 c 0.877 -1.68 1.614 -3.445 2.19 -5.247 l 3.836 1.227 C 80.954 49.883 80.128 51.862 79.146 53.745 z"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 71.45 63.847 C 64.49 70.336 55.413 73.91 45.893 73.91 H 14.329 l 13.243 13.243 L 24.726 90 L 6.622 71.897 l 18.104 -18.104 l 2.847 2.847 L 14.329 69.884 h 31.563 c 8.498 0 16.599 -3.19 22.811 -8.981 c 1.385 -1.291 2.671 -2.711 3.82 -4.219 l 3.202 2.441 C 74.438 60.812 73 62.401 71.45 63.847 z"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <rect
          x="79.35"
          y="11.19"
          rx="0"
          ry="0"
          width="4.03"
          height="6.04"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
        />
        <path
          d="M 83.017 41.648 l -3.987 -0.556 c 0.214 -1.537 0.322 -3.108 0.322 -4.668 v -1.077 h 4.026 v 1.077 C 83.378 38.168 83.256 39.926 83.017 41.648 z"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <rect
          x="79.35"
          y="23.27"
          rx="0"
          ry="0"
          width="4.03"
          height="6.04"
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: 'inherit',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
        />
      </g>
    </svg>
  );
}
