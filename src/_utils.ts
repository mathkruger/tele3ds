function generateHash(text: string) {
  const hash = Bun.hash(text).toString();
  return hash;
}

function compareHash(text: string, hash: string) {
  const result = Bun.hash(text).toString() === hash;
  return result;
}

export { generateHash, compareHash };
