import {DefaultCrudRepository} from '@loopback/repository';
import {Activetable, ActivetableRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ActivetableRepository extends DefaultCrudRepository<
  Activetable,
  typeof Activetable.prototype.id,
  ActivetableRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Activetable, dataSource);
  }
}
