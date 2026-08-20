import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ConceptTab = 'demo' | 'code' | 'comparison';
type Environment = 'development' | 'production';


@Component({
  selector: 'app-standalone-bootstrap-concept',
  standalone: true,
  templateUrl: './standalone-bootstrap-concept.html',
  styleUrl: './standalone-bootstrap-concept.scss',
})
export class StandaloneBootstrapConcept {
readonly iconPath = 'icons';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly environment = signal<Environment>('development');
  readonly routerEnabled = signal(true);
  readonly httpEnabled = signal(true);
  readonly interceptorEnabled = signal(true);

  readonly providerCount = computed(() =>
    [this.routerEnabled(), this.httpEnabled(), this.interceptorEnabled()].filter(Boolean).length,
  );

  readonly bootstrapCode = computed(() => {
    const providers = [
      this.routerEnabled() ? '    provideRouter(routes)' : null,
      this.httpEnabled()
        ? `    provideHttpClient(${this.interceptorEnabled() ? 'withInterceptors([authInterceptor])' : ''})`
        : null,
      `    { provide: APP_ENV, useValue: '${this.environment()}' }`,
    ].filter(Boolean).join(',\n');

    return `bootstrapApplication(AppComponent, {\n  providers: [\n${providers}\n  ]\n}).catch(console.error);`;
  });

  selectTab(tab: ConceptTab): void {
    this.activeTab.set(tab);
  }

  setEnvironment(environment: Environment): void {
    this.environment.set(environment);
  }

  toggleProvider(provider: 'router' | 'http' | 'interceptor'): void {
    if (provider === 'router') this.routerEnabled.update(value => !value);
    if (provider === 'http') {
      this.httpEnabled.update(value => !value);
      if (!this.httpEnabled()) this.interceptorEnabled.set(false);
    }
    if (provider === 'interceptor' && this.httpEnabled()) {
      this.interceptorEnabled.update(value => !value);
    }
  }
}
