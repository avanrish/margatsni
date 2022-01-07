import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';
import { EmojiHappyIcon } from '@heroicons/react/outline';

import useTranslation from 'next-translate/useTranslation';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';

export default function Loading() {
  const mobile = useRecoilValue(mobileDeviceState);
  const { t } = useTranslation('common');

  return (
    <div
      className={`max-w-6xl mx-auto flex h-[600px] bg-white my-7 border rounded-sm ${
        mobile ? 'flex-col mx-10' : 'flex-row'
      }`}
    >
      {mobile && (
        <div className="px-5 py-3 border-b flex items-center space-x-3">
          <Skeleton width={48} height={48} borderRadius={999} />
          <Skeleton width={100} />
          <Skeleton width={80} />
        </div>
      )}
      <div className={`w-full flex flex-col ${!mobile && 'max-w-[calc(100%-360px)]'}`}>
        <Skeleton className="h-[600px] -top-1" count={1} />
      </div>
      <div className="flex flex-col min-w-[360px]">
        {!mobile && (
          <div className="px-5 py-3 border-b flex items-center space-x-3">
            <Skeleton width={48} height={48} borderRadius={999} />
            <Skeleton width={100} />
            <Skeleton width={80} />
          </div>
        )}
        <div className={!mobile ? 'mt-auto' : undefined}>
          <div className="flex items-center p-4">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              className="border-none flex-1 focus:ring-0"
              placeholder={t('addComment')}
            />
            <button
              type="submit"
              disabled={true}
              className={`font-semibold text-blue-400 opacity-50 cursor-default`}
            >
              {t('post')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
