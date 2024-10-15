const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTMzOWYyMjU2MDlmOGZiYjI4YWQ3YzZlYjBmMTczYSIsIm5iZiI6MTcyNzgwNzE2OC43NTgxMjcsInN1YiI6IjY2ZjMwODE3YTk3ODgwMTQ4ZjNiOWI2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9cnPkFkVJkVcbK0fQBfh3eMYQNV9NB_4kmrJWQG5tm8",
  },
};

export async function fetchPopularMovies(page = 1) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
    options,
  );
  if (!response.ok) throw new Error("Failed to fetch popular movies");
  return response.json();
}

export async function fetchTopRatedMovies(page = 1) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
    options,
  );
  if (!response.ok) throw new Error("Failed to fetch top rated movies");
  return response.json();
}

export async function fetchMovie(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options,
  );
  if (!response.ok) throw new Error("Failed to fetch the movie");
  return response.json();
}
export async function fetchRecommendations(genreId, page = 1) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=vote_count.desc&with_genres=${genreId}`,
    options,
  );
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return response.json();
}

export async function fetchProviders(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?language=en-US`,
    options,
  );
  if (!response.ok) throw new Error("Failed to fetch the provider");
  return response.json();
}
