import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { signal } from '@angular/core';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { CodeWalkthrough } from '../../shared/code-walkthrough/code-walkthrough';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import {
  CodeWalkthroughItem,
  ConceptComparisonItem,
  ConceptLearningContent,
} from '../../shared/concept.models';
@Component({
  selector: 'app-reactive-forms-concept',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './reactive-forms.html',
  styleUrl: './reactive-forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormsConcept {
  private readonly fb = inject(FormBuilder);
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly submitted = signal(false);
  readonly profileForm = this.fb.nonNullable.group({
    name: 'Matthieu',
    email: 'matthieu@example.fr',
    remote: true,
  });
  readonly code = `readonly profileForm = this.fb.nonNullable.group({
  name: '',
  email: '',
  remote: false
});

save(): void {
  const profile = this.profileForm.getRawValue();
}`;
  readonly templateCode = `<form [formGroup]="profileForm" (ngSubmit)="save()">
  <input formControlName="name" />
  <input formControlName="email" type="email" />
  <input formControlName="remote" type="checkbox" />
  <button type="submit">Enregistrer</button>
</form>`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Modèle explicite',
      title: 'Formulaires réactifs',
      description: 'La structure et les règles sont créées dans la classe TypeScript.',
      points: ['Testables sans DOM', 'Flux observable', 'Adaptés aux formulaires complexes'],
      recommended: true,
    },
    {
      badge: 'Template',
      title: 'Formulaires pilotés par le template',
      description: 'Angular construit le modèle à partir des directives HTML.',
      points: [
        'Peu de TypeScript',
        'Pratiques pour un formulaire simple',
        'Logique plus dispersée',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'Un formulaire réactif possède un modèle TypeScript composé de FormControl et FormGroup. Le template se relie à ce modèle mais ne possède pas lui-même les valeurs.',
    why: 'Quand un formulaire contient plusieurs champs, validations ou étapes, il faut pouvoir lire, tester et modifier son état sans manipuler directement le DOM.',
    steps: [
      'FormBuilder crée le FormGroup et ses contrôles.',
      'formGroup relie la balise form au groupe TypeScript.',
      'formControlName relie chaque champ à un contrôle du groupe.',
      'Une saisie modifie le contrôle et donc la valeur du groupe.',
      "ngSubmit déclenche l'action lorsque le formulaire est envoyé.",
    ],
    demoGuide: [
      "Modifie un champ et observe l'objet JSON en temps réel.",
      'La valeur appartient au FormGroup, pas aux éléments input.',
      'Le bouton Remettre réinitialise tous les contrôles ensemble.',
      "Enregistrer lit getRawValue et affiche l'état soumis.",
    ],
    useCases: [
      {
        title: 'Formulaire métier',
        description: 'Plusieurs champs, groupes imbriqués ou règles conditionnelles.',
      },
      {
        title: 'Formulaire dynamique',
        description: 'Ajouter ou retirer des contrôles selon le contexte.',
      },
    ],
    mistakes: [
      'Mélanger ngModel et formControlName dans le même formulaire.',
      'Lire les valeurs dans le DOM plutôt que dans le FormGroup.',
      'Oublier nonNullable puis gérer inutilement null partout.',
    ],
    takeaway:
      "Le FormGroup est la source de vérité ; le HTML ne fait que l'afficher et transmettre les saisies.",
    exercises: [
      'Ajoute un contrôle téléphone.',
      'Désactive le champ email depuis TypeScript.',
      'Écoute valueChanges et affiche les modifications.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'fb.nonNullable.group(...)',
      explanation:
        'Crée un groupe dont les contrôles ne produisent pas null lors de leur réinitialisation.',
    },
    {
      code: '[formGroup]="profileForm"',
      explanation: 'Relie la balise form à l’instance TypeScript.',
    },
    {
      code: 'formControlName="email"',
      explanation: 'Relie ce champ au contrôle nommé email dans le groupe parent.',
    },
    {
      code: 'getRawValue()',
      explanation:
        'Retourne une copie typée de toutes les valeurs, y compris celles des contrôles désactivés.',
    },
  ];
  reset(): void {
    this.profileForm.reset({ name: '', email: '', remote: false });
    this.submitted.set(false);
  }
  save(): void {
    this.submitted.set(true);
  }
}
