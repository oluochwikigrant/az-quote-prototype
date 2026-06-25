export default function GenerateRandomPassword(length = 10): string {
  // Character pools
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = uppercase + lowercase + numbers + special;

  // Pick one guaranteed from each category
  const getRandom = (pool: string) =>
    pool[Math.floor(Math.random() * pool.length)];
  const guaranteed = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(special),
  ];

  // Fill the rest
  const rest = Array.from({ length: length - guaranteed.length }, () =>
    getRandom(allChars)
  );

  // Combine and shuffle
  const passwordArray = [...guaranteed, ...rest];
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}
