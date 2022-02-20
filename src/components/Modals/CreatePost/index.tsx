import { useState } from 'react';

import Success from './Success';
import Create from './Create';

export default function CreatePost({ open, setOpen }) {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Create open={open} close={() => setOpen(false)} setSuccess={setSuccess} />
      <Success open={success} close={() => setSuccess(false)} />
    </>
  );
}
