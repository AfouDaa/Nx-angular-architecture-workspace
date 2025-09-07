import { Environment } from './environment.types';
import { ENV } from './environment.tokens';
import { EnvironmentService } from './environment.service';
import { Provider } from '@angular/core';

export function provideEnvironment(config: Environment): Provider[] {
  return [
    { provide: ENV, useValue: config },
    EnvironmentService
  ];
}
