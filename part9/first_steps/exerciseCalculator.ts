const GOOD_RATING = "You did great!";
const OK_RATING = "You did okay, but you could do better";
const POOR_RATING = "You should try harder next time";

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(hours: Array<number>, target: number): ExerciseResult {
  const periodLength = hours.length;
  const trainingDays = hours.filter(h => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const half_target = target / 2;
  const rating = average < (target - half_target) ? 1 : average > (target + half_target) ? 3 : 2;
  const ratingDescription = rating === 1 ? POOR_RATING : rating === 2 ? OK_RATING : GOOD_RATING;

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

if (require.main === module) {
  if (process.argv.length < 4) {
    console.error("Not enough arguments");
    process.exit(2);
  }

  const target = Number(process.argv[2]);

  if (isNaN(target)) {
    console.error("Target must be a number");
    process.exit(2);
  }

  const hours = process.argv.slice(3).map(Number);

  if (hours.some(h => isNaN(h))) {
    console.error("Hours must be numbers");
    process.exit(2);
  }

  console.log(calculateExercises(hours, target));
}