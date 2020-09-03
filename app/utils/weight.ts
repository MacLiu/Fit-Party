import assertNever from "./assertNever";

export type Weight = {
  amount: number;
  units: WeightUnit;
};

export enum WeightUnit {
  Pounds = 'Pounds',
  Kilos = 'Kilos',
};

export function getWeightInPounds(weight: Weight): string {
  switch (weight.units) {
  case WeightUnit.Pounds:
    return weight.amount + ' lbs';
  case WeightUnit.Kilos:
    return Math.round(weight.amount / 2.2 * 100) / 100 + ' kg';
  default:
    assertNever(weight.units);
  }
}