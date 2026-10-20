import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TerminalOverlayComponent } from './layout/terminal-overlay/terminal-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, TerminalOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
