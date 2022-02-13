import { PlusCircleIcon as Active } from '@heroicons/react/solid';
import { PlusCircleIcon as Inactive } from '@heroicons/react/outline';

export default function CreateIcon({ open, setOpen, mobile }) {
  return !open ? (
    <Inactive onClick={() => setOpen(true)} className={`navBtn order-2 ${mobile && '!order-3'}`} />
  ) : (
    <Active className={`navBtn order-2 ${mobile && '!order-3'}`} />
  );
}
