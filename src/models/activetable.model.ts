import {DataSource, Entity, model, property} from '@loopback/repository';
import {getDayOfYear} from 'date-fns';

@model()
export class Activetable extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    default: null
  })
  count: number;

  @property({
    type: 'date',
    default: new Date()
  })
  date: DataSource;

  @property({
    type: 'number',
    default: getDayOfYear(new Date())
  })
  dayOfYear: number;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Activetable>) {
    super(data);
  }
}

export interface ActivetableRelations {
  // describe navigational properties here
}

export type ActivetableWithRelations = Activetable & ActivetableRelations;
