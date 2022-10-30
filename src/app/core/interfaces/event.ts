export interface EventResponse {
  message: string;
  data: Event[];
}

export interface Event {
  id: number;
  category: string;
  description: string;
  process_id: number | null;
  event_id_ref: number | null;
  createdAt: string;
}

export enum Category {
  COMPLETADO = 'COMPLETADO',
  INCOMPLETO = 'INCOMPLETO',
}
