import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {JwtServiceBindings} from './keys';
import {MySequence} from './sequence';
import {JwtService} from './services';

export {ApplicationConfig};

export class StudyToolApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // authentication component
    this.component(AuthenticationComponent);
    // Register the strategy
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.setupBinding();
  }
  setupBinding(): void {
    // bind keys
    this.bind(JwtServiceBindings.JwtServiceInstance)
      .toClass(JwtService)

    // //authorization
    // this
    //   .bind('authorizationProviders.my-authorizer-provider')
    //   .toProvider(AuthorizationProvider)
    //   .tag(AuthorizationTags.AUTHORIZER);


  };
}
