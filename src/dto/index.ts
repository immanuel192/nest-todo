export * from './user.controller.dto';
export * from './todo.controller.dto';

export interface UserDto {
  id?: number;
  username: string;
  createdOn: Date;
}

export enum ETodoStatus {
  Active = 'Active',
  Completed = 'Completed'
}

export interface TodoDto {
  id?: number;
  title: string;
  userId: number;
  /**
   * =0: done; =1: Active;
   */
  status: ETodoStatus;
  createdOn: Date;
}
