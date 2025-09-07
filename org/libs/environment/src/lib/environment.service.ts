import { Injectable, inject } from '@angular/core';
import { ENV } from './environment.tokens';
import { Context, Contexts, Environment } from './environment.types';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env = inject<Environment>(ENV);

  getContext(name: string): Context | undefined {
    return this.env.contexts[name];
  }

  getContexts(): Contexts {
    return this.env.contexts;
  }

  isProduction(): boolean {
    return this.env.production;
  }

  getHost(): string {
    return this.env.host;
  }
}
