export * from './controllers';

export interface UserDto {
  id?: number;
  username: string;
  createdOn: Date;
}
