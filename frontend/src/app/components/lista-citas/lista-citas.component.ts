import { Component, OnInit } from '@angular/core';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita.services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html'
})
export class ListaCitasComponent implements OnInit {
  citas: Cita[] = [];
  mensaje = '';
  error = '';
  // `auth` es público para usar auth.esAdmin() en la plantilla
  constructor(private citaService: CitaService, public auth: AuthService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.citaService.listar().subscribe({
      next: d => this.citas = d,
      error: e => this.error = e.status === 0 ? 'No se pudo conectar con el servidor' : e.error?.mensaje || 'No se pudo cargar la lista'
    });
  }

  eliminar(c: Cita): void {
    if (!c._id) return;
    if (!confirm(`¿Eliminar la cita de ${c.cliente}?`)) return;
    this.citaService.eliminar(c._id).subscribe({
      next: r => { this.mensaje = r.mensaje; this.error = ''; this.cargar(); },
      error: e => this.error = e.error?.mensaje || 'No se pudo eliminar'
    });
  }
}