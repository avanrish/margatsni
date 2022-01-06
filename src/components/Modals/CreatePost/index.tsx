import { useState } from 'react';

import SuccessModal from './SuccessModal';
import CreateModal from './CreateModal';

export default function CreatePost({ open, setOpen }) {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <CreateModal open={open} close={() => setOpen(false)} setSuccess={setSuccess} />
      <SuccessModal open={success} close={() => setSuccess(false)} />
    </>
  );
}
