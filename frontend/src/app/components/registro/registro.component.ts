import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  form: FormGroup;
  error = '';
  cargando = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required]
    });
  }

  get noCoinciden(): boolean {
    const f = this.form;
    return !!f.get('confirmar')?.touched && f.get('password')?.value !== f.get('confirmar')?.value;
  }

  registrar(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmar) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';
    const { nombre, email, password } = this.form.value;
    this.auth.registrar(nombre, email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.cargando = false;
        this.error = e.status === 0 ? 'No se pudo conectar con el servidor' : e.error?.mensaje || 'Error al registrarse';
      }
    });
  }
}