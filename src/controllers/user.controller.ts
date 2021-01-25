import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compare, hash} from 'bcryptjs';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {JwtService} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.jwt')
    public jwtService: JwtService,
  ) { }


  @post('/users', {
    responses: {
      '204': {
        description: 'User created',
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'verified'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    const existingUser = await this.userRepository
      .find({where: {login: {eq: user.login}}})

    if (existingUser.length > 0) {
      throw new HttpErrors.BadRequest('User already exists')
    }

    // hard coded verification
    user.verified = true

    user.password = await hash(user.password + '', 10)
    return this.userRepository.create(user)

  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
                role: {
                  type: 'string'
                }
              },
            },
          }
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              login: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: Login,
  ): Promise<{token: string}> {

    const foundUser: Array<User> = await this.userRepository
      .find({
        where: {login: credentials.login},
      });
    if (foundUser.length < 1) {
      throw new HttpErrors.Unauthorized('User not found');
    }

    if (!foundUser[0].verified) {
      throw new HttpErrors.Unauthorized('Please verify your account');
    }

    const user = foundUser[0];

    const passwordMatch = await compare(credentials.password, user.password + '');

    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('Wrong password');
    }

    const userProfile = {
      [securityId]: user.password + '',
      id: user.id,
    };
    const token = await this.jwtService.generateToken(userProfile);

    return {token: token};
  }

  // @authenticate('jwt')
  // @get('/users/profile', {
  //   security: OPERATION_SECURITY_SPEC,
  //   responses: {
  //     '200': {
  //       description: 'User Profile',
  //     },
  //   },
  // })
  // async get(
  //   @inject(SecurityBindings.USER)
  //   currentUserProfile: UserProfile,
  // ): Promise<Patient | Doctor | null | Pharmacy> {
  //   if (currentUserProfile.role === 'client') {
  //     return this.userRepository.patient(currentUserProfile.id).get();
  //   }
  //   if (currentUserProfile.role === 'doctor') {
  //     return this.userRepository.doctor(currentUserProfile.id).get();
  //   }
  //   if (currentUserProfile.role === 'pharmacy') {
  //     return this.userRepository.pharmacy(currentUserProfile.id).get();
  //   }
  //   if (currentUserProfile.role === 'admin') {
  //     return null;
  //   }
  //   throw new HttpErrors.BadRequest('role not found')


  // }


  // change password
  @authenticate('jwt')
  @patch('/users/change_password', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    passwords: ChangePassword,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const {currentPassword, newPassword} = passwords;
    const user = await this.userRepository.findById(currentUserProfile.id);
    const passwordMatch = await compare(currentPassword, user.password + '');
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('Wrong password');
    }
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.updateById(currentUserProfile.id, user);
  }

  // reset password
  @patch('/users/reset_password', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    password: ResetPassword,
    @param.query.string('token') token: string,
  ): Promise<void> {
    const userProfile: UserProfile = await this.jwtService.verifyToken(token);
    let {newPassword} = password;
    const {id} = userProfile;
    const user = await this.userRepository.findById(id);
    newPassword = await hash(newPassword, 10);
    user.password = newPassword;
    await this.userRepository.updateById(id, user);
  }

  // reset token
  @post('/users/reset-token', {
    responses: {
      '200': {
        description: 'login sent',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async getToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              login: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    userlogin: Token,
  ): Promise<string> {
    const {login} = userlogin;
    const users = await this.userRepository.find({where: {login}, fields: {password: false}});

    if (users.length < 1) {
      throw new HttpErrors.Unauthorized('User not found');
    }

    // const user = users[0];

    // const userId: string = user.id ? user.id : '';
    // const userProfile= {
    //   [securityId]: userId,
    //   roles: user.role,
    //   id: userId,
    //   login: user.login,
    // };

    // // await this.emailing.sendToken(user.login, userProfile, 'password_reset');
    return 'login sent successfully';
  }
}


// interfaces

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

interface ResetPassword {
  newPassword: string;
}

interface Token {
  login: string
}

interface Login {
  login: string;
  password: string;

}
