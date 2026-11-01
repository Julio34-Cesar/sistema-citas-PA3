import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../services/cita.services';

@Component({
  selector: 'app-formulario-cita',
  templateUrl: './formulario-citas.component.html'
})
export class FormularioCitaComponent implements OnInit {
  form: FormGroup;
  id: string | null = null;
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private citaService: CitaService,
              private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.citaService.obtener(this.id).subscribe(c => this.form.patchValue(c));
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.id
      ? this.citaService.actualizar(this.id, this.form.value)
      : this.citaService.crear(this.form.value);
    op.subscribe({
      next: () => { this.mensaje = 'Cita guardada correctamente'; setTimeout(() => this.router.navigate(['/citas']), 800); },
      error: e => this.error = e.error?.mensaje || 'Error al guardar'
    });
  }
}