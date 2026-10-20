import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationHistoryService } from './core/services/navigation-history.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TerminalOverlayComponent } from './layout/terminal-overlay/terminal-overlay.component';
import { SearchOverlayComponent } from './layout/search-overlay/search-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, TerminalOverlayComponent, SearchOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Created at startup so it counts every navigation, including the first.
  private readonly history = inject(NavigationHistoryService);

  constructor() {
    // Router anchor scrolling ignores CSS scroll-margin; keep targets clear of the fixed 56px navbar.
    inject(ViewportScroller).setOffset([0, 64]);
  }
}
