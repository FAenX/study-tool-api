import {Entity, model, property} from '@loopback/repository';

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
    default: 0
  })
  count?: number;

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
