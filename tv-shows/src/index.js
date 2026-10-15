import { getShowData, getEpisodeList } from "./services/tvmaze.js";

const DEFAULT_ID = "2993";

const $form = document.querySelector("#show-form");
const $input = document.querySelector("#show-id");
const $button = document.querySelector("#search-button");
const $feedback = document.querySelector("#feedback");
const $results = document.querySelector("#results");
const $header = document.querySelector("#show-header");
const $episodes = document.querySelector("#episodes");
const $episodeCount = document.querySelector("#episode-count");

const formatRating = (rating) =>
  Number.isFinite(rating) ? `${rating}/10` : "Sin calificación";

const showFeedback = (message, state = "info") => {
  $feedback.textContent = message;
  $feedback.dataset.state = state;
  $feedback.hidden = !message;
};

const setLoading = (isLoading) => {
  $button.disabled = isLoading;
  $button.textContent = isLoading ? "Cargando..." : "Consultar serie";
};

// Utilizamos createElement y textContent para insertar datos externos de forma segura.
const createShowHeader = (show, totalSeasons, totalEpisodes) => {
  const $poster = document.createElement("img");
  $poster.className = "poster";
  $poster.src = show.image;
  $poster.alt = `Póster de ${show.name}`;
  $poster.width = 210;
  $poster.height = 295;

  const $details = document.createElement("div");
  $details.className = "show-details";

  const $label = document.createElement("p");
  $label.className = "eyebrow";
  $label.textContent = "Serie de televisión";

  const $title = document.createElement("h2");
  $title.textContent = show.name;

  const $rating = document.createElement("p");
  $rating.className = "show-rating";
  $rating.textContent = `★ ${formatRating(show.rating)}`;

  const $summary = document.createElement("p");
  $summary.className = "show-summary";
  $summary.textContent = `${totalSeasons} temporada(s) · ${totalEpisodes} episodio(s)`;

  $details.append($label, $title, $rating, $summary);
  return [$poster, $details];
};

const createEpisodeElement = (episode, seasonNumber) => {
  const $episode = document.createElement("div");
  const rating = episode.rating;
  const ratingClass = Number.isFinite(rating)
    ? `rating-${Math.max(0, Math.min(10, Math.round(rating)))}`
    : "rating-none";

  $episode.className = `episode ${ratingClass}`;
  $episode.textContent = episode.number ?? "–";

  const description = `Temporada ${seasonNumber}, episodio ${episode.number ?? "sin número"}: ${episode.name}. Valoración: ${formatRating(rating)}.`;
  $episode.title = description;
  $episode.setAttribute("role", "img");
  $episode.setAttribute("aria-label", description);

  return $episode;
};

const createSeasonElement = (episodes, seasonNumber) => {
  const $season = document.createElement("article");
  $season.className = "season";

  const $title = document.createElement("h3");
  $title.className = "season-header";
  $title.textContent = `T${seasonNumber}`;
  $title.title = `Temporada ${seasonNumber}`;

  const $list = document.createElement("div");
  $list.className = "episode-list";
  $list.append(...episodes.map((episode) => createEpisodeElement(episode, seasonNumber)));

  $season.append($title, $list);
  return $season;
};

const renderShow = (show, seasons) => {
  const sortedSeasons = Object.entries(seasons)
    .sort(([a], [b]) => Number(a) - Number(b));
  const totalEpisodes = sortedSeasons.reduce((total, [, list]) => total + list.length, 0);

  $header.replaceChildren(...createShowHeader(show, sortedSeasons.length, totalEpisodes));
  $episodeCount.textContent = `${totalEpisodes} episodios · ${sortedSeasons.length} temporadas`;

  $episodes.replaceChildren(
    ...sortedSeasons.map(([seasonNumber, list]) => createSeasonElement(list, seasonNumber))
  );

  if (sortedSeasons.length === 0) {
    const $empty = document.createElement("p");
    $empty.className = "empty-message";
    $empty.textContent = "Todavía no hay episodios registrados para esta serie.";
    $episodes.replaceChildren($empty);
  }

  $results.hidden = false;
};

const loadShow = async (id) => {
  setLoading(true);
  $results.hidden = true;
  showFeedback("Consultando TVMaze...");

  try {
    // Ambas peticiones son independientes: se ejecutan en paralelo.
    const [show, seasons] = await Promise.all([
      getShowData(id),
      getEpisodeList(id)
    ]);

    renderShow(show, seasons);
    showFeedback("");
  } catch (error) {
    console.error("Error al consultar TVMaze:", error);
    const message = error.name === "TimeoutError"
      ? "La consulta tardó demasiado. Intentá de nuevo."
      : error instanceof TypeError
        ? "No se pudo conectar con TVMaze. Revisá tu conexión."
        : error.message;
    showFeedback(message, "error");
  } finally {
    setLoading(false);
  }
};

$form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $input.value.trim();

  if (!/^[1-9]\d*$/.test(id)) {
    showFeedback("Ingresá un ID numérico mayor que cero.", "error");
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("id", id);
  window.history.replaceState(null, "", url);
  loadShow(id);
});

const initialId = new URLSearchParams(window.location.search).get("id");
$input.value = initialId && /^[1-9]\d*$/.test(initialId) ? initialId : DEFAULT_ID;
loadShow($input.value);
