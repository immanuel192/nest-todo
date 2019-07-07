import { CreateTodoRequestDto, TodoDto } from '../dto';

/**
 * Todo service
 */
export abstract class ITodoService {
  /**
   * Create new dto for current user
   */
  abstract create(inp: CreateTodoRequestDto, userId: number): Promise<TodoDto>;
}
