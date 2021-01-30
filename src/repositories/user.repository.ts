import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Activetable} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ActivetableRepository} from './activetable.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly activetable: HasOneRepositoryFactory<Activetable, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ActivetableRepository') protected activetableRepositoryGetter: Getter<ActivetableRepository>,
  ) {
    super(User, dataSource);
    this.activetable = this.createHasOneRepositoryFactoryFor('activetable', activetableRepositoryGetter);
    this.registerInclusionResolver('activetable', this.activetable.inclusionResolver);
  }
}
