import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMillisecondsShort = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const shortMilliseconds = Math.floor((ms % 1000) / 10);
  const formattedMilliseconds = shortMilliseconds.toString().padStart(2, '0');
  return `${totalSeconds}:${formattedMilliseconds}`;
};

export const probabilityXOrMoreHeads = async (
  x: number,
  n: number
): Promise<number> => {
  const factorial = (n: number): number => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };
  const binomialCoefficient = (n: number, k: number): number => {
    return factorial(n) / (factorial(k) * factorial(n - k));
  };
  const binomialProbability = (n: number, k: number, p: number): number => {
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };
  let probability = 0;
  for (let k = x; k <= n; k++) {
    probability += binomialProbability(n, k, 0.5);
  }
  return probability;
};

// Calculate winner from random data
const feePercentage = 0.05;
export const calculateMiningProbabilities = (x: number, n: number) => {
  try {
    let probabilities: number[] = [];
    let out: number[] = [];
    let remainingSafeSpots = n - x; // Total non-mine spots
    for (let i = 0; i < n - x; i++) {
      // Probability of hitting a safe spot in the current step
      let probabilityOfSafeStep = remainingSafeSpots / (n - i);
      if (!i) {
        probabilities.push(1 / probabilityOfSafeStep);
      } else {
        probabilities.push(probabilities[i - 1] / probabilityOfSafeStep);
      }
      out[i] = Math.floor((probabilities[i] * (1 - feePercentage)) * 100) / 100;
      remainingSafeSpots--; // Reduce the number of safe spots as they are discovered
    }
    return out;
  } catch (error) {
    return error;
  }
};