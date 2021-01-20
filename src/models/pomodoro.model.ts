import {Entity, model, property} from '@loopback/repository';

@model()
export class Pomodoro extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  day: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  data: number[];


  constructor(data?: Partial<Pomodoro>) {
    super(data);
  }
}

export interface PomodoroRelations {
  // describe navigational properties here
}

export type PomodoroWithRelations = Pomodoro & PomodoroRelations;
