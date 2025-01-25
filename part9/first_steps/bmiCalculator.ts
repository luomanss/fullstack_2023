export function calculateBmi(length: number, weight: number): string {
  const lengthMeters = length / 100;
  const bmi = weight / (lengthMeters * lengthMeters);

  if (bmi < 18.5) {
    return "Underweight range";
  }
  else if (bmi <= 24.9) {
    return "Normal range";
  }
  else if (bmi <= 29.9) {
    return "Overweight range";
  }
  else if (bmi <= 39.9) {
    return "Obese range";
  }
  else {
    return "Severe obese range";
  }
}

if (require.main === module) {
  if (process.argv.length < 4) {
    console.error("Not enough arguments");
    process.exit(2);
  }

  const length = Number(process.argv[2]);

  if (isNaN(length)) {
    console.error("Length must be a number");
    process.exit(2);
  }

  const weight = Number(process.argv[3]);

  if (isNaN(weight)) {
    console.error("Weight must be a number");
    process.exit(2);
  }

  console.log(calculateBmi(length, weight));
}