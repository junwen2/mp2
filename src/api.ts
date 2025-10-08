import axios from 'axios';
import { PokemonDetail, PokemonListResponse } from './types';

const client = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});

export async function fetchPokemonList(limit = 200, offset = 0) {
  const { data } = await client.get<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return data;
}

export async function fetchPokemonByName(name: string) {
  const { data } = await client.get<PokemonDetail>(`/pokemon/${name}`);
  return data;
}

export async function fetchPokemonTypes() {
  const { data } = await client.get<{ results: { name: string; url: string }[] }>(
    `/type`
  );
  return data.results.map((t) => t.name);
}

