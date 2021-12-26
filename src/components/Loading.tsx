import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image src="/images/insta-logo.png" alt="Instagram" width={80} height={80} />
    </div>
  );
}
