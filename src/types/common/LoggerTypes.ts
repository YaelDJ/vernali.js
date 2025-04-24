
export interface LogEntry {
  nivel: string;
  modulo: string;
  localizacion?: string;
  mensaje: object;
}

export interface LogOptions {
  nivelesMinimos: Record<string, string>
}
