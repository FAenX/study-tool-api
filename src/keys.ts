import {BindingKey} from '@loopback/context';
import {JwtService} from './services';

export namespace JwtServiceBindings {
  export const JwtServiceInstance = BindingKey.create<JwtService>(
    'service.jwt',
  );
}

