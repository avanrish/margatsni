import { PlusCircleIcon as PlusCircleActive } from '@heroicons/react/solid';
import { PlusCircleIcon as PlusCircleInactive } from '@heroicons/react/outline';

export default function CreateIcon({ open, setOpen, mobile }) {
  return !open ? (
    <PlusCircleInactive
      onClick={() => setOpen(true)}
      className={`navBtn order-2 ${mobile && '!order-3'}`}
    />
  ) : (
    <PlusCircleActive className={`navBtn order-2 ${mobile && '!order-3'}`} />
  );
}
