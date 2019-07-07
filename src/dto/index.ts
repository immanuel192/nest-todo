export * from './controllers';

export interface UserDto {
  id?: number;
  username: string;
  createdOn: Date;
}

export interface TodoDto {
  id?: number;
  title: string;
  userId: number;
  done?: boolean;
  createdOn: Date;
}
