import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { BottomNav } from './bottom-nav';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Sidebar, Header, BottomNav],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {
  readonly layout = inject(LayoutService);
}
