import { Component, OnInit, Inject, OnDestroy, computed } from '@angular/core';
import { Thesaurus, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// myrmidon
import { EnvService, RamStorageService } from '@myrmidon/ngx-tools';
import { AuthJwtService, GravatarPipe, User } from '@myrmidon/auth-jwt-login';
import { ThemeToggleComponent } from '@myrmidon/ngx-mat-tools';

// bricks
import {
  LOOKUP_CONFIGS_KEY,
  RefLookupConfig,
} from '@myrmidon/cadmus-refs-lookup';
import { ViafRefLookupService } from '@myrmidon/cadmus-refs-viaf-lookup';
import { ZoteroRefLookupService } from '@myrmidon/cadmus-refs-zotero-lookup';

// cadmus
import { AppRepository } from '@myrmidon/cadmus-state';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatButtonModule,
    MatDivider,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    GravatarPipe,
    ThemeToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly _subs: Subscription[] = [];

  public user?: User;
  public logged?: boolean;
  public itemBrowsers?: ThesaurusEntry[];
  public version: string;

  readonly branding = computed(() => {
    switch (this._env.get('branding')) {
      case 'staging':
        return {
          bg: 'var(--mat-sys-tertiary)',
          text: 'var(--mat-sys-on-tertiary)',
        };
      case 'dev':
        return {
          bg: 'var(--mat-sys-error)',
          text: 'var(--mat-sys-on-error)',
        };
      default: // Production
        return {
          bg: 'var(--mat-sys-primary)',
          text: 'var(--mat-sys-on-primary)',
        };
    }
  });

  constructor(
    @Inject('itemBrowserKeys')
    private _itemBrowserKeys: { [key: string]: string },
    private _authService: AuthJwtService,
    private _appRepository: AppRepository,
    private _router: Router,
    private _env: EnvService,
    storage: RamStorageService,
    viaf: ViafRefLookupService,
    zotero: ZoteroRefLookupService,
  ) {
    this.version = this._env.get('version') || '';

    // configure external lookup for asserted composite IDs
    storage.store(LOOKUP_CONFIGS_KEY, [
      // Zotero
      {
        name: 'Zotero',
        iconUrl: '/img/zotero128.png',
        description: 'Zotero bibliography',
        label: 'ID',
        service: zotero,
        itemIdGetter: (item: any) =>
          item ? `${item.library?.id}/${item.key}` : '',
        itemLabelGetter: (item: any) => {
          if (!item) {
            return '';
          }
          const sb: string[] = [];
          if (item.data?.creators && Array.isArray(item.data.creators)) {
            const creators = item.data.creators;
            for (let i = 0; i < creators.length; i++) {
              const c = creators[i];
              if (i > 0) {
                sb.push('; ');
              }
              if (c.lastName) {
                sb.push(c.lastName);
              }
              if (c.firstName) {
                sb.push(' ' + c.firstName.charAt(0) + '.');
              }
            }
          }
          sb.push(': ');
          if (item.title) {
            sb.push(item.title);
          } else if (item.data?.title) {
            sb.push(item.data?.title);
          }
          return sb.join('');
        },
      },
      // VIAF
      {
        name: 'VIAF',
        iconUrl: '/img/viaf128.png',
        description: 'Virtual International Authority File',
        label: 'ID',
        service: viaf,
        itemIdGetter: (item: any) => item?.viafid,
        itemLabelGetter: (item: any) => item?.term,
      },
    ] as RefLookupConfig[]);
  }

  public ngOnInit(): void {
    this.user = this._authService.currentUserValue || undefined;
    this.logged = this.user !== null;

    // when the user logs in or out, reload the app data
    this._subs.push(
      this._authService.currentUser$.subscribe((user: User | null) => {
        this.logged = this._authService.isAuthenticated(true);
        this.user = user || undefined;
        if (user) {
          console.log('User logged in: ', user);
          this._appRepository.load();
        } else {
          console.log('User logged out');
        }
      }),
    );

    // when the thesaurus is loaded, get the item browsers
    this._subs.push(
      this._appRepository.itemBrowserThesaurus$.subscribe(
        (thesaurus: Thesaurus | undefined) => {
          this.itemBrowsers = thesaurus ? thesaurus.entries : undefined;
        },
      ),
    );
  }

  public ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  public getItemBrowserRoute(id: string): string {
    return this._itemBrowserKeys[id] || id;
  }

  public logout(): void {
    if (!this.logged) {
      return;
    }
    this._authService
      .logout()
      .pipe(take(1))
      .subscribe((_) => {
        this._router.navigate(['/home']);
      });
  }
}
