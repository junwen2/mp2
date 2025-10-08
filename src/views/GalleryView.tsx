import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonByName, fetchPokemonList, fetchPokemonTypes } from '../api';
import { BrowseContext } from '../BrowseContext';
import styles from './GalleryView.module.css';

interface GalleryItem {
  name: string;
  id: number;
  image: string | null;
  types: string[];
}

export default function GalleryView() {
  const navigate = useNavigate();
  const browse = React.useContext(BrowseContext)!;
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [types, setTypes] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [list, allTypes] = await Promise.all([
          fetchPokemonList(60),
          fetchPokemonTypes(),
        ]);
        const names = list.results.map((r) => r.name);
        const details = await Promise.all(
          names.map(async (name) => {
            try {
              const d = await fetchPokemonByName(name);
              const image = d.sprites.other?.['official-artwork']?.front_default || d.sprites.front_default || null;
              return {
                name: d.name,
                id: d.id,
                image,
                types: d.types.map((t) => t.type.name),
              } as GalleryItem;
            } catch {
              return null;
            }
          })
        );
        const filtered = details.filter(Boolean) as GalleryItem[];
        if (!cancelled) {
          setItems(filtered);
          setTypes(allTypes);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    if (selected.length === 0) return items;
    return items.filter((it) => selected.every((t) => it.types.includes(t)));
  }, [items, selected]);

  React.useEffect(() => {
    browse.setOrderedNames(filtered.map((i) => i.name));
  }, [filtered, browse]);

  function toggleType(t: string) {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Pokémon Gallery</h2>
      <div className={styles.filters}>
        {types.map((t) => (
          <button
            key={t}
            className={`${styles.filterButton} ${selected.includes(t) ? styles.selected : ''}`}
            onClick={() => toggleType(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className={styles.gallery}>
        {filtered.map((it) => (
          <div key={it.name} className={styles.card} onClick={() => navigate(`/pokemon/${it.name}`)}>
            <div className={styles.imageContainer}>
              {it.image ? (
                <img src={it.image} alt={it.name} className={styles.image} />
              ) : (
                <span>No image</span>
              )}
            </div>
            <div className={styles.cardInfo}>
              <strong>#{it.id}</strong> {it.name}
            </div>
            <div className={styles.cardTypes}>{it.types.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

