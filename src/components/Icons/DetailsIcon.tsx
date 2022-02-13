import { InformationCircleIcon as Active } from '@heroicons/react/outline';
import { InformationCircleIcon as Inactive } from '@heroicons/react/solid';

export default function DetailsIcon({ selectedTab, setSelectedTab }) {
  return selectedTab === 0 ? (
    <Active className="w-6 cursor-pointer" onClick={() => setSelectedTab(1)} />
  ) : (
    <Inactive className="w-6 cursor-pointer" onClick={() => setSelectedTab(0)} />
  );
}
