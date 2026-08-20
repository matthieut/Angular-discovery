import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-validation-concept',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './validation.html',
  styleUrl: './validation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationConcept {
  private readonly fb = inject(FormBuilder);
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  readonly code = `readonly form = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});

submit(): void {
  this.form.markAllAsTouched();
  if (this.form.invalid) return;
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Immédiat',
      title: 'Validateur synchrone',
      description: 'Renvoie immédiatement une erreur ou null.',
      points: [
        'required, email, minLength',
        'Validateur personnalisé simple',
        'Sans appel externe',
      ],
      recommended: true,
    },
    {
      badge: 'Asynchrone',
      title: 'Validateur asynchrone',
      description: 'Renvoie un Observable ou une Promise lorsque la vérification prend du temps.',
      points: ['Unicité côté serveur', 'État pending', 'Éviter un appel à chaque frappe'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "La validation associe des règles à un contrôle de formulaire. Un contrôle valide n'a aucune erreur ; un contrôle invalide possède un objet errors décrivant les règles non respectées.",
    why: "Le navigateur reçoit des saisies incomplètes ou incorrectes. Le modèle doit pouvoir empêcher l'envoi et expliquer précisément à l'utilisateur ce qu'il doit corriger.",
    steps: [
      'Les validateurs sont attachés lors de la création du contrôle.',
      'Chaque changement relance les validateurs concernés.',
      'Le contrôle calcule valid, invalid et errors.',
      "touched indique que l'utilisateur a quitté le champ ; dirty qu'il a modifié sa valeur.",
      "La soumission vérifie l'état global avant de traiter les données.",
    ],
    demoGuide: [
      'Clique directement sur Valider pour marquer tous les champs comme touched.',
      "Saisis un email incorrect et observe l'erreur email.",
      'Saisis un mot de passe court et observe minlength.',
      'Le bouton métier ne traite les données que lorsque form.valid vaut true.',
    ],
    useCases: [
      { title: 'Règle locale', description: 'Champ obligatoire, format ou longueur.' },
      {
        title: 'Règle serveur',
        description: 'Vérifier l’unicité d’un email ou la validité d’un code.',
      },
    ],
    mistakes: [
      'Afficher les erreurs avant toute interaction utilisateur.',
      'Considérer la validation front comme une protection suffisante côté serveur.',
      'Créer un validateur asynchrone sans debounce ni cache.',
    ],
    takeaway:
      "La validation améliore l'expérience ; le serveur doit toujours valider à nouveau les données reçues.",
    exercises: [
      'Ajoute une règle avec une expression régulière.',
      'Crée un validateur confirmPassword.',
      "Affiche l'état pending d'un validateur asynchrone.",
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'Validators.required',
      explanation: 'Produit l’erreur required lorsque la valeur est vide.',
    },
    {
      code: 'Validators.email',
      explanation: 'Vérifie que la chaîne respecte la forme générale d’une adresse email.',
    },
    {
      code: "control.errors?.['minlength']",
      explanation:
        'Lit les informations de l’erreur minlength, notamment les longueurs attendue et réelle.',
    },
    {
      code: 'markAllAsTouched()',
      explanation:
        'Marque tous les contrôles afin que leurs messages deviennent visibles après une tentative d’envoi.',
    },
    {
      code: 'if (form.invalid) return',
      explanation: 'Arrête la logique métier tant qu’au moins un contrôle est invalide.',
    },
  ];
  submit(): void {
    this.form.markAllAsTouched();
  }
}
