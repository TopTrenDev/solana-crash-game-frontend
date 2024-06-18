export const truncateString = (
  address: string,
  startCharacters: number = 6,
  endCharacters: number = 4
) => {
  if (!address || address.length <= startCharacters + endCharacters) {
    return address; // Return the original string if it has 10 or fewer characters
  }

  const firstSixLetters = address.slice(0, startCharacters);
  const lastFourLetters = address.slice(-endCharacters);

  return `${firstSixLetters}...${lastFourLetters}`;
};

export const isEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};
