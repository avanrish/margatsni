import { InformationCircleIcon as Active } from '@heroicons/react/solid';
import { InformationCircleIcon as Inactive } from '@heroicons/react/outline';

export default function DetailsIcon({ selectedTab, setSelectedTab }) {
  return selectedTab === 1 ? (
    <Active className="w-6 cursor-pointer" onClick={() => setSelectedTab(0)} />
  ) : (
    <Inactive className="w-6 cursor-pointer" onClick={() => setSelectedTab(1)} />
  );
}
