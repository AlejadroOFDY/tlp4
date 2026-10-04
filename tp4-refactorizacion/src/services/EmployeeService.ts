import type { IEmployeeService, CreateEmployeeDTO } from './IEmployeeService.js';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository.js';
import type { ISalaryCalculator } from './ISalaryCalculator.js';
import type { IEmployeeDocument } from '../models/Employee.js';
import { AppError } from '../errors/AppError.js';

export class EmployeeService implements IEmployeeService {
  private readonly employeeRepository: IEmployeeRepository;
  private readonly salaryCalculator: ISalaryCalculator;

  constructor(employeeRepository: IEmployeeRepository, salaryCalculator: ISalaryCalculator) {
    this.employeeRepository = employeeRepository;
    this.salaryCalculator = salaryCalculator;
  }

  async createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeDocument> {
    const { name, position, baseSalary, yearsOfService } = data;

    if (!name || !position) {
      throw new AppError('Nombre y puesto son obligatorios', 400);
    }

    if (typeof baseSalary !== 'number' || baseSalary <= 0) {
      throw new AppError('El salario base debe ser mayor a 0', 400);
    }

    if (
      typeof yearsOfService !== 'number' ||
      yearsOfService < 0 ||
      !Number.isInteger(yearsOfService)
    ) {
      throw new AppError('La antigüedad debe ser un entero mayor o igual a 0', 400);
    }

    const finalSalary = this.salaryCalculator.calculate(baseSalary, yearsOfService);

    const employee = await this.employeeRepository.create({
      name,
      position,
      baseSalary,
      yearsOfService,
      finalSalary
    });

    console.log(`Empleado creado: ${employee.name} - salario final: ${employee.finalSalary}`);
    return employee;
  }

  async getAllEmployees(): Promise<IEmployeeDocument[]> {
    return this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<IEmployeeDocument> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new AppError('Empleado no encontrado', 404);
    }

    return employee;
  }
}
