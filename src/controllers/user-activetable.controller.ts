import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,

  param,
  patch,
  requestBody
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
  ): Promise<Activetable> {
    const dayOfYear = getDayOfYear(new Date())
    const active = await this.userRepository.activetables(user.id).find({
      where: {
        dayOfYear
      }
    });
    console.log(active)
    if (active.length < 1){
     return this.userRepository.activetables(user.id).create({
        count: 0,
      })

    }
    return active[0]

  }
  @authenticate('jwt')
  @patch('/users/{id}/activetable', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many Activetable',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Activetable),
          },
        },
      },
    },
  })
  async update(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Activetable, {
            title: 'update active table',
            exclude: ['id', 'dayOfYear', 'userId'],
          }),
        },
      },
    })
    table: Partial<Activetable>,
    @inject(SecurityBindings.USER)
    user: UserProfile,

  ): Promise<void> {
    const dayOfYear = getDayOfYear(new Date())
    await this.userRepository.activetables(user.id).patch({count: table.count},
      {dayOfYear: dayOfYear}
    )
  }
}
