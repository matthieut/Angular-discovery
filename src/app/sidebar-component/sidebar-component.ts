import { Component, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Plus } from '@primeicons/angular/plus';
import { ChevronDown } from '@primeicons/angular/chevron-down';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { Sidebar } from '@primeicons/angular/sidebar';
import { PIcon } from '@primeicons/angular/p-icon';
import { RouterOutlet } from '@angular/router';

interface NavItem {
    icon: string;
    label: string;
    isActive?: boolean;
    badge?: string;
    subItems?: { label: string; isActive?: boolean }[];
}
interface NavGroup {
    label: string;
    action?: boolean;
    items: NavItem[];
}

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterOutlet, AvatarModule, SidebarModule, ButtonModule, Plus, ChevronDown, EllipsisV, Sidebar, PIcon],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent implements OnInit {
    isMobile = signal(false);
    open = signal(true);
    private mql?: MediaQueryList;
    private mqlListener?: (e: MediaQueryListEvent) => void;
    navGroups: NavGroup[] = [
        {
            label: 'RXJS',
            items: [
                { icon: 'command', label: 'To do', isActive: true }
            ]
        },
        {
            label: 'ANGULAR',
            action: true,
            items: [
                { icon: 'chart-bar', label: 'Command' },
                { icon: 'users', label: 'Installation' },
                { icon: 'calendar', label: 'Configuration' },
                { icon: 'calendar', label: 'Les composants' },
                { icon: 'calendar', label: 'Les templates' },
                { icon: 'calendar', label: 'Les directives' },
                { icon: 'calendar', label: 'L\'injection de dépendances' },
                { icon: 'calendar', label: 'La gestion des routes' },
                { icon: 'calendar', label: 'Les formulaires', subItems: [
                  { label: 'Les formulaires réactifs' },
                  { label: 'Les formulaires template-driven' },
                  { label: 'Les signals forms' }
                ]},
                { icon: 'calendar', label: 'Le HTTP client', subItems: [
                  { label: 'Fetch API' },
                  { label: 'XHR' }
                ]},
                { icon: 'calendar', label: 'Les modules' },
                { icon: 'calendar', label: 'Services worker et web workers' },
                { icon: 'calendar', label: 'Internationalisation' },
                { icon: 'calendar', label: 'Les providers, guards, interceptors, resolvers...' },
                { icon: 'calendar', label: 'Les tests' },
            ]
        }
    ];
    ngOnInit() {
        if (typeof window === 'undefined') return;
        this.mql = window.matchMedia('(max-width: 1023px)');
        this.isMobile.set(this.mql.matches);
        this.open.set(!this.mql.matches);
        this.mqlListener = (e) => {
            this.isMobile.set(e.matches);
            this.open.set(!e.matches);
        };
        this.mql.addEventListener('change', this.mqlListener);
    }
    ngOnDestroy() {
        this.mql?.removeEventListener('change', this.mqlListener!);
    }
    hasActiveSub(item: NavItem): boolean {
        return !!item.subItems?.some((s) => s.isActive);
    }
}