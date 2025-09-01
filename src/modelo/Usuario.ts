export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  roles: { id: string; nombre: string }[];
}