export function hashSeed(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function randomFromSeed(seed: number) {
  let value = seed || 1;
  return () => {
    value = Math.imul(1664525, value) + 1013904223;
    return ((value >>> 0) % 100000) / 100000;
  };
}

export function pickSeeded<T>(items: T[], seed: number, salt: string) {
  if (items.length === 0) return undefined;
  const random = randomFromSeed(hashSeed(`${seed}:${salt}`));
  return items[Math.floor(random() * items.length)];
}

export function pickManySeeded<T>(items: T[], count: number, seed: number, salt: string) {
  const pool = [...items];
  const picked: T[] = [];
  const random = randomFromSeed(hashSeed(`${seed}:${salt}`));
  while (pool.length > 0 && picked.length < count) {
    picked.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return picked;
}
