import type { IEmployeeDocument } from '../models/Employee.js';

export interface CreateEmployeeDTO {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
}

export interface IEmployeeService {
  createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeDocument>;
  getAllEmployees(): Promise<IEmployeeDocument[]>;
  getEmployeeById(id: string): Promise<IEmployeeDocument>;
}
