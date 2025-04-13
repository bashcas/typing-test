/**
 * Calculates a score based on typing metrics
 * @param wpm Words per minute
 * @param accuracy Overall accuracy (0-1)
 * @param firstStrikeAccuracy First strike accuracy (0-1)
 * @returns The calculated score
 */

interface CalculateScoreProps {
  wordsPerMinute: number;
  wordsTyped: number;
  accuracy: number;
  deletes: number;
}

const calculateScore = ({
  wordsPerMinute,
  wordsTyped,
  accuracy,
  deletes,
}: CalculateScoreProps): number => {
  return wordsPerMinute * wordsTyped * accuracy - deletes;
};

export default calculateScore;
