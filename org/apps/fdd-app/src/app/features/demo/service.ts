/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@angular/core";
import { APIRepository, ApiResponse } from "@org/data-access-layer";

@Injectable({ providedIn: 'root' })
export class Repository extends APIRepository<any> {
  protected readonly name = 'user';

  parse(response: ApiResponse<any>): any[] {
    return response.data.map(d => ({ ...d } as any));
  }
}
