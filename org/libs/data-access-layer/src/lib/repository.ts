import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, EntityID } from './types';
import { EnvironmentService } from '@org/environment';

export type Segment = number | string;

@Injectable()
export abstract class APIRepository<T> {

  protected readonly envService = inject(EnvironmentService);
  protected readonly http = inject(HttpClient);

  protected abstract readonly name: string;

  abstract parse(response: ApiResponse<T>): T[];

  context = this.envService.getContexts()['api'] ?? { name: '', port: 8000 };
  host = this.envService.getHost();

  buildEndpoint(segments?: Segment[]): string {
    return segments
      ? segments.join('/')
      : `${this.host}:${this.context.port}/${this.context.name}/${this.name}`;
  }

  findAll(): Observable<T[]> {
    return this.http
      .get<ApiResponse<T>>(this.buildEndpoint())
      .pipe(map(this.parse));
  }

  save<S extends T>(entity: T): Observable<S> {
    return this.http.post<S>(this.buildEndpoint() + '/', entity);
  }

  update<S extends T>(id: string, entity: T): Observable<S> {
    return this.http.put<S>(this.buildEndpoint() + `/${id}`, entity);
  }

  findById(id: EntityID): Observable<T> {
    return this.http.get<T>(this.buildEndpoint() + `/${id}`);
  }

  deleteById(id: string): Observable<unknown> {
    return this.http.delete<unknown>(this.buildEndpoint() + `/` + id, {});
  }
}
