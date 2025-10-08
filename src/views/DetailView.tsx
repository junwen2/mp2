import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPokemonByName } from '../api';
import { useBrowse } from '../BrowseContext';
import { PokemonDetail } from '../types';
import styles from './DetailView.module.css';

export default function DetailView() {
  const { name = '' } = useParams();
  const navigate = useNavigate();
  const { orderedNames } = useBrowse();
  const [data, setData] = React.useState<PokemonDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPokemonByName(name)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => !cancelled && setError(e.message || 'Failed to load'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [name]);

  const idx = orderedNames.indexOf(name);
  const prevName = idx > 0 ? orderedNames[idx - 1] : null;
  const nextName = idx >= 0 && idx < orderedNames.length - 1 ? orderedNames[idx + 1] : null;

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const image = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>
        <div className={styles.navigation}>
          <button className={styles.navButton} onClick={() => prevName && navigate(`/pokemon/${prevName}`)} disabled={!prevName}>
            ← Previous
          </button>
          <button className={styles.navButton} onClick={() => nextName && navigate(`/pokemon/${nextName}`)} disabled={!nextName}>
            Next →
          </button>
        </div>
      </div>
      <h2>
        <strong>#{data.id}</strong> {data.name}
      </h2>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {image ? <img src={image} alt={data.name} className={styles.image} /> : <span>No image</span>}
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}><strong>Types:</strong> {data.types.map((t) => t.type.name).join(', ')}</div>
          <div className={styles.detailItem}><strong>Height:</strong> {data.height}</div>
          <div className={styles.detailItem}><strong>Weight:</strong> {data.weight}</div>
        </div>
      </div>
    </div>
  );
}

