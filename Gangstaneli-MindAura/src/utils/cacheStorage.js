import { useEffect, useState } from "react";

const CACHE_PREFIX = "mindaura_cache";

function cacheKey(key) {
  return `${CACHE_PREFIX}:${key}`;
}

function trimValue(value, maxItems, keep = "first") {
  if (Array.isArray(value)) {
    return keep === "last" ? value.slice(-maxItems) : value.slice(0, maxItems);
  }

  return value;
}

export function getCachedValue(key, fallbackValue) {
  try {
    const savedValue = localStorage.getItem(cacheKey(key));
    return savedValue ? JSON.parse(savedValue) : fallbackValue;
  } catch (error) {
    console.warn(`MindAura cache read failed for ${key}`, error);
    return fallbackValue;
  }
}

export function setCachedValue(key, value, options = {}) {
  const maxItems = options.maxItems || 50;
  const keep = options.keep || "first";
  let valueToSave = trimValue(value, maxItems, keep);

  try {
    localStorage.setItem(cacheKey(key), JSON.stringify(valueToSave));
  } catch (error) {
    console.warn(`MindAura cache full for ${key}. Trimming saved data.`, error);

    if (Array.isArray(valueToSave)) {
      valueToSave =
        keep === "last"
          ? valueToSave.slice(-Math.max(5, Math.floor(maxItems / 2)))
          : valueToSave.slice(0, Math.max(5, Math.floor(maxItems / 2)));

      try {
        localStorage.setItem(cacheKey(key), JSON.stringify(valueToSave));
      } catch (retryError) {
        console.warn(`MindAura cache retry failed for ${key}`, retryError);
      }
    }
  }

  return valueToSave;
}

export function useCachedState(key, fallbackValue, options = {}) {
  const maxItems = options.maxItems || 50;
  const keep = options.keep || "first";
  const [value, setValue] = useState(() => getCachedValue(key, fallbackValue));

  useEffect(() => {
    setCachedValue(key, value, { maxItems, keep });
  }, [key, value, maxItems, keep]);

  return [value, setValue];
}
