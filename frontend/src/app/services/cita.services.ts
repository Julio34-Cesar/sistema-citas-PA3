import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';
import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private api = `${API_URL}/citas`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Cita[]> { return this.http.get<Cita[]>(this.api); }
  obtener(id: string): Observable<Cita> { return this.http.get<Cita>(`${this.api}/${id}`); }
  crear(c: Cita): Observable<Cita> { return this.http.post<Cita>(this.api, c); }
  actualizar(id: string, c: Cita): Observable<Cita> { return this.http.put<Cita>(`${this.api}/${id}`, c); }
  eliminar(id: string): Observable<{ mensaje: string }> { return this.http.delete<{ mensaje: string }>(`${this.api}/${id}`); }
}