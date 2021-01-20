import {DefaultCrudRepository} from '@loopback/repository';
import {Pomodoro, PomodoroRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PomodoroRepository extends DefaultCrudRepository<
  Pomodoro,
  typeof Pomodoro.prototype.id,
  PomodoroRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Pomodoro, dataSource);
  }
}
