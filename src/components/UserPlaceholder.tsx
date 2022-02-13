import Skeleton from 'react-loading-skeleton';

export default function UserPlaceholder({ width = 40, height = 40 }) {
  return (
    <div className={`flex items-center ${width === 56 && 'my-2'}`} style={{ height }}>
      <Skeleton width={width} height={height} borderRadius={999} />
      <div className="ml-4">
        <Skeleton width={120} height={14} />
        <Skeleton width={60} height={12} />
      </div>
    </div>
  );
}
