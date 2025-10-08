import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonList } from '../api';
import { BrowseContext } from '../BrowseContext';
import { PokemonListItem } from '../types';
import styles from './ListView.module.css';

type SortKey = 'name' | 'id';
type SortOrder = 'asc' | 'desc';

export default function ListView() {
  const navigate = useNavigate();
  const browse = React.useContext(BrowseContext)!;
  const [query, setQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState<SortKey>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');
  const [items, setItems] = React.useState<Array<PokemonListItem & { id?: number }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPokemonList(300)
      .then(async (res) => {
        const enriched = res.results.map((p) => {
          const match = p.url.match(/\/pokemon\/(\d+)\//);
          const id = match ? Number(match[1]) : undefined;
          return { ...p, id };
        });
        if (!cancelled) setItems(enriched);
      })
      .catch((e) => !cancelled && setError(e.message || 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items.filter((p) => p.name.toLowerCase().includes(q) || String(p.id || '').includes(q))
      : items;
    const sorted = [...base].sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      return ((a.id || 0) - (b.id || 0)) * dir;
    });
    return sorted;
  }, [items, query, sortKey, sortOrder]);

  React.useEffect(() => {
    browse.setOrderedNames(filtered.map((p) => p.name));
  }, [filtered, browse]);

  function handleOpen(name: string) {
    navigate(`/pokemon/${name}`);
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Pokémon List</h2>
      <div className={styles.controls}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or id…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={styles.select} value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
        <button className={styles.sortButton} onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}>
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      <ul className={styles.list}>
        {filtered.map((p) => (
          <li key={p.name} className={styles.listItem} onClick={() => handleOpen(p.name)}>
            <strong>#{p.id ?? '—'}</strong> {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

