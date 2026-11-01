import { Component, OnInit } from '@angular/core';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  total = 0;
  hoy = 0;
  proximas: Cita[] = [];
  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.citaService.listar().subscribe(citas => {
      this.total = citas.length;
      this.hoy = citas.filter(c => c.fecha === hoyStr).length;
      this.proximas = citas.filter(c => c.fecha >= hoyStr).slice(0, 5);
    });
  }
}