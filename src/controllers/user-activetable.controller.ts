import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,

  param
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {getDayOfYear} from 'date-fns';
import {
  Activetable
} from '../models';
import {UserRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class UserActivetableController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @authenticate('jwt')
  @get('/users/{id}/activetable', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many Activetable',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Activetable)},
          },
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    user: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<Activetable[]> {
    return this.userRepository.activetables(user.id).find({
      where: {
        dayOfYear: getDayOfYear(new Date())
      }
    });

  }
}
