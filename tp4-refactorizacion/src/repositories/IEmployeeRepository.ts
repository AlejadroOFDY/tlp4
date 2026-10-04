import type { IEmployee, IEmployeeDocument } from '../models/Employee.js';

export interface IEmployeeRepository {
  create(data: IEmployee): Promise<IEmployeeDocument>;
  findAll(): Promise<IEmployeeDocument[]>;
  findById(id: string): Promise<IEmployeeDocument | null>;
}
