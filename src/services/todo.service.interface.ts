import { CreateTodoRequestDto, TodoDto } from '../dto';

/**
 * Todo service
 */
export abstract class ITodoService {
  /**
   * Create new dto for current user
   */
  abstract create(inp: CreateTodoRequestDto, userId: number): Promise<TodoDto>;

  /**
   * Complete a todo
   */
  abstract complete(id: number, userId: number): Promise<void>;
}
