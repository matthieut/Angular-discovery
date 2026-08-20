import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SiteNavigationItem {
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  readonly menuOpen = signal(false);
  readonly navigation: readonly SiteNavigationItem[] = [
    { label: 'Accueil', route: '/home', exact: true },
    //{ label: 'CV', route: '/cv', exact: true },
    { label: 'Portfolio', route: '/portfolio' },
    { label: 'Angular Lab', route: '/lab' },
  ];

  toggleMenu(): void { this.menuOpen.update((open) => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
}
