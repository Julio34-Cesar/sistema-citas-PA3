import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaCitasComponent } from './components/lista-citas/lista-citas.component';
import { FormularioCitaComponent } from './components/formulario-citas/formulario-citas.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { adminGuard, authGuard } from './guards/auth.guard';

const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas protegidas: requieren sesión iniciada
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'citas', component: ListaCitasComponent, canActivate: [authGuard] },
  { path: 'citas/nueva', component: FormularioCitaComponent, canActivate: [authGuard] },

  // Solo administrador
  { path: 'citas/editar/:id', component: FormularioCitaComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}