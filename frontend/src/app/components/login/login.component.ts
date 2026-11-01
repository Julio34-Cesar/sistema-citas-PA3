import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  aviso = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    if (this.route.snapshot.queryParamMap.get('motivo') === 'expirada') {
      this.aviso = 'Tu sesión expiró. Inicia sesión de nuevo.';
    }
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => {
        const destino = this.route.snapshot.queryParamMap.get('volver') || '/';
        this.router.navigateByUrl(destino);
      },
      error: (e) => {
        this.cargando = false;
        this.error = e.status === 0 ? 'No se pudo conectar con el servidor' : e.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}