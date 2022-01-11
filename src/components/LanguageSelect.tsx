import { useRouter } from 'next/router';

import locales from '../util/locales.json';

export default function LanguageSelect() {
  const router = useRouter();
  return (
    <div className="flex">
      <select
        value={router.locale}
        className="z-10 mx-auto my-5 py-0 text-xs border-0 focus:ring-0 text-gray-primary bg-gray-bg"
        onChange={({ target }) => router.push(router.asPath, null, { locale: target.value })}
      >
        {locales.map(({ locale, display }) => (
          <option key={locale} value={locale}>
            {display}
          </option>
        ))}
      </select>
    </div>
  );
}
