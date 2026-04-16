import { useSearchParams } from 'react-router-dom';

interface FilterTab {
  label: string;
  value: string | undefined; // undefined = "Összes"
}

const TABS: FilterTab[] = [
  { label: 'Összes', value: undefined },
  { label: 'Piszkozat', value: 'Draft' },
  { label: 'Beküldve', value: 'Submitted' },
  { label: 'Gyártásban', value: 'InProduction' },
  { label: 'Kész', value: 'Completed' },
  { label: 'Törölve', value: 'Cancelled' },
];

export function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get('status') ?? undefined;

  const handleSelect = (value: string | undefined) => {
    if (value) {
      setSearchParams({ status: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div
      className="flex gap-1 flex-wrap"
      role="tablist"
      aria-label="Rendelés szűrés státusz szerint"
      data-testid="status-filter"
    >
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.label}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            data-testid={`filter-tab-${tab.value ?? 'all'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
