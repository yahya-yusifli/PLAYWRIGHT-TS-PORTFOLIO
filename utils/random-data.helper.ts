export function randomEmail() {
  return `user_${Date.now()}@test.com`;
}

export function randomString(length: number) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}