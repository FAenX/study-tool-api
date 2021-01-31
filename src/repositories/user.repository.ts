import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Activetable, User, UserRelations} from '../models';
import {ActivetableRepository} from './activetable.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly activetable: HasOneRepositoryFactory<Activetable, typeof User.prototype.id>;

  public readonly activetables: HasManyRepositoryFactory<Activetable, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('ActivetableRepository')
    protected activetableRepositoryGetter: Getter<ActivetableRepository>,
  ) {
    super(User, dataSource);
    this.activetables = this.createHasManyRepositoryFactoryFor(
      'activetables', activetableRepositoryGetter,);
    this.registerInclusionResolver('activetables', this.activetables.inclusionResolver);
  }
}
