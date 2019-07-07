import { NestInterceptor, ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return next.handle().pipe(map(data => this.renderSuccess(data)));
  }

  private renderSuccess(data: any): any {
    return {
      data
    };
  }
}
