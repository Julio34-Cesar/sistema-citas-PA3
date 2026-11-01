import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { RespuestaAuth, Usuario } from '../models/usuario';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${API_URL}/auth`;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.leerUsuarioGuardado());
  // Los componentes se suscriben a este flujo para mostrar/ocultar opciones
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<RespuestaAuth> {
    return this.http
      .post<RespuestaAuth>(`${this.api}/login`, { email, password })
      .pipe(tap((r) => this.guardarSesion(r)));
  }

  registrar(nombre: string, email: string, password: string): Observable<RespuestaAuth> {
    return this.http
      .post<RespuestaAuth>(`${this.api}/register`, { nombre, email, password })
      .pipe(tap((r) => this.guardarSesion(r)));
  }

  logout(motivo?: 'expirada'): void {
    this.borrarSesion();
    this.router.navigate(['/login'], { queryParams: motivo ? { motivo } : {} });
  }

  get token(): string | null {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Hay sesión solo si existe token y todavía no venció
  estaLogueado(): boolean {
    const token = this.token;
    if (!token || !this.usuario) return false;
    if (this.tokenVencido(token)) {
      this.borrarSesion();
      return false;
    }
    return true;
  }

  esAdmin(): boolean {
    return this.usuario?.rol === 'admin';
  }

  // Lee la fecha de expiración (exp) que trae el JWT, sin necesidad de la clave secreta
  private tokenVencido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  private guardarSesion(r: RespuestaAuth): void {
    try {
      localStorage.setItem(CLAVE_TOKEN, r.token);
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(r.usuario));
    } catch {
      /* si el navegador bloquea el almacenamiento, la sesión dura solo en memoria */
    }
    this.usuarioSubject.next(r.usuario);
  }

  private borrarSesion(): void {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
    } catch {
      /* nada que borrar */
    }
    this.usuarioSubject.next(null);
  }

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const guardado = localStorage.getItem(CLAVE_USUARIO);
      return guardado ? (JSON.parse(guardado) as Usuario) : null;
    } catch {
      return null;
    }
  }
}