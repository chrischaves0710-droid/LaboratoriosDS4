const API_BASE = "https://api.tvmaze.com";
const PLACEHOLDER_IMAGE = new URL("../assets/placeholder.svg", import.meta.url).href;
const TIMEOUT_MS = 12000;

// Centraliza las peticiones y evita repetir el manejo de errores.
const fetchJSON = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No se encontró una serie con ese ID.");
    }
    if (response.status === 429) {
      throw new Error("Hay demasiadas solicitudes. Intentá nuevamente en unos segundos.");
    }
    throw new Error(`La API respondió con el código HTTP ${response.status}.`);
  }

  return response.json();
};

// Obtiene la información que se utilizará en la cabecera.
export const getShowData = async (id) => {
  const data = await fetchJSON(`${API_BASE}/shows/${id}`);

  return {
    name: data.name,
    rating: data.rating?.average ?? null,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

// Obtiene, simplifica y agrupa los episodios por temporada.
export const getEpisodeList = async (id) => {
  const episodes = await fetchJSON(`${API_BASE}/shows/${id}/episodes`);

  if (!Array.isArray(episodes)) {
    throw new Error("La API devolvió una lista de episodios no válida.");
  }

  const episodeList = episodes
    .filter((episode) => Number.isInteger(episode.season))
    .map((episode) => ({
      number: episode.number,
      season: episode.season,
      name: episode.name ?? "Sin título",
      rating: episode.rating?.average ?? null
    }));

  return Object.groupBy(episodeList, (episode) => episode.season);
};
