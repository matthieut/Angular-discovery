import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ScrollAreaModule],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly agapesReferences = ['Flunch', '3 Brasseurs', 'Salad&Co', 'Il Ristorante', 'Pizza Paï'];
  readonly effectReferences = ['EQUANS', 'Reilux', 'Satelec', 'Les Ateliers des Flandres'];
}
