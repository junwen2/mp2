export interface PokemonListItem {
  name: string;
  url: string; // URL to detail from PokéAPI
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeRef {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: { front_default: string | null };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeRef[];
  sprites: PokemonSprites;
}

