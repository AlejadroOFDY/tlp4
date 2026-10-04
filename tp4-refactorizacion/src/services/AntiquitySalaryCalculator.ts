import type { ISalaryCalculator } from './ISalaryCalculator.js';

export class AntiquitySalaryCalculator implements ISalaryCalculator {
  private readonly ratePerYear: number;

  constructor(ratePerYear: number = 0.02) {
    this.ratePerYear = ratePerYear;
  }

  calculate(baseSalary: number, yearsOfService: number): number {
    return baseSalary + baseSalary * this.ratePerYear * yearsOfService;
  }
}
