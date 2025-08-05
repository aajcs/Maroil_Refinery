// utils/swrLocalStorageProvider.ts
export function localStorageProvider() {
  // Inicializa el cache desde localStorage
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem("swr-cache") || "[]")
  );

  // Guarda el cache en localStorage cada vez que cambie
  window.addEventListener("beforeunload", () => {
    const arr = Array.from(map.entries());
    localStorage.setItem("swr-cache", JSON.stringify(arr));
  });

  return map;
}
