export const CACHE_TIMES = {
  STATIC_DATA: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  },
  SEMI_STATIC_DATA: {
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },
  DYNAMIC_DATA: {
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  },
  USER_DATA: {
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  REAL_TIME_DATA: {
    staleTime: 0,
    gcTime: 2 * 60 * 1000,
  }
};

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FILTER: 250,
  INPUT: 400,
  AUTOCOMPLETE: 200,
};