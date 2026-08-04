export default function generateMongoId(): string {
  // 4-byte timestamp
  const timestamp = Math.floor(Date.now() / 1000).toString(16);

  // 5-byte random value
  const random = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"),
  ).join("");

  // 3-byte counter (randomized for simplicity)
  const counter = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"),
  ).join("");

  return (timestamp + random + counter).padEnd(24, "0"); // ensure length = 24
}
