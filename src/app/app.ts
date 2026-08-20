import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DockModule } from 'primeng/dock';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, DockModule, RadioButtonModule, TooltipModule, FormsModule, CardModule],
  templateUrl: './app.html',
  //changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss'
})
export class App implements OnInit {
    items: MenuItem[] | null = null;
  protected readonly title = signal('Angular-discovery');
    
    ngOnInit() {
        this.items = [
            {
                label: 'Moi',
                icon: '/me-icon.png',
                url:'/home',
                routerLink: '/home'
            },{
                label: 'Angular',
                icon: '/angular-icon.webp',
                url:'/angular',
                routerLink: '/angular'
            },{
                label: 'Portfolio',
                icon: '/portfolio-icon.png',
                url:'/portfolio',
                routerLink: '/portfolio'
            }
        ];
    }
}
