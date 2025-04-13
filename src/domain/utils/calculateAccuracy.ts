interface CalculateAccuracyProps {
  originalLines: string[][];
  enteredLines: string[];
}

const calculateAccuracy = ({
  originalLines,
  enteredLines,
}: CalculateAccuracyProps): number => {
  // Convert originalLines to strings with spaces between words
  const originalLinesWithSpaces = originalLines.map((line) => line.join(" "));

  // Calculate total characters (including spaces)
  const totalCharacters = originalLinesWithSpaces.reduce(
    (sum, line) => sum + line.length,
    0
  );

  // Compare character by character
  let correctCharacters = 0;
  for (
    let i = 0;
    i < Math.min(enteredLines.length, originalLinesWithSpaces.length);
    i++
  ) {
    const original = originalLinesWithSpaces[i];
    const entered = enteredLines[i];

    for (let j = 0; j < Math.min(entered.length, original.length); j++) {
      if (entered[j] === original[j]) {
        correctCharacters++;
      }
    }
  }

  return totalCharacters > 0 ? correctCharacters / totalCharacters : 1;
};

export default calculateAccuracy;
