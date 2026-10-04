import type { IEmployeeRepository } from './IEmployeeRepository.js';
import { EmployeeModel } from '../models/Employee.js';
import type { IEmployee, IEmployeeDocument } from '../models/Employee.js';

export class EmployeeRepository implements IEmployeeRepository {
  async create(data: IEmployee): Promise<IEmployeeDocument> {
    return EmployeeModel.create(data);
  }

  async findAll(): Promise<IEmployeeDocument[]> {
    return EmployeeModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IEmployeeDocument | null> {
    return EmployeeModel.findById(id);
  }
}
