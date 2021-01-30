import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,

  param,

  post,
  requestBody
} from '@loopback/rest';
import {
  Activetable, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserActivetableController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/activetable', {
    responses: {
      '200': {
        description: 'User has one Activetable',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Activetable),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Activetable>,
  ): Promise<Activetable> {
    return this.userRepository.activetable(id).get(filter);
  }

  @post('/users/{id}/activetable', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Activetable)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Activetable, {
            title: 'NewActivetableInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) activetable: Omit<Activetable, 'id'>,
  ): Promise<Activetable> {
    return this.userRepository.activetable(id).create(activetable);
  }
}
