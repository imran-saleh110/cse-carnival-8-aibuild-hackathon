import { AssignmentModel } from '../models/Assignment';
import { CreateAssignmentInput, UpdateAssignmentInput, AssignmentFilters } from '../types/assignment.types';
import { AppError } from '../middleware/error.middleware';

export class AssignmentService {
  static async list(filters: AssignmentFilters) {
    return AssignmentModel.findAll(filters);
  }

  static async getById(id: string) {
    const asgn = await AssignmentModel.findById(id);
    if (!asgn) throw new AppError('Assignment not found', 404);
    return asgn;
  }

  static async create(data: CreateAssignmentInput) {
    return AssignmentModel.create(data);
  }

  static async update(id: string, data: UpdateAssignmentInput) {
    const asgn = await AssignmentModel.update(id, data);
    if (!asgn) throw new AppError('Assignment not found', 404);
    return asgn;
  }

  static async delete(id: string) {
    const asgn = await AssignmentModel.delete(id);
    if (!asgn) throw new AppError('Assignment not found', 404);
    return asgn;
  }
}
