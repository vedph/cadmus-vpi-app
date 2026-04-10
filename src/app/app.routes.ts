import { Routes } from '@angular/router';

// myrmidon
import { jwtAdminGuard, jwtGuard } from '@myrmidon/auth-jwt-login';

// libraries in this workspace
import { editorGuard } from '@myrmidon/cadmus-api';
import { pendingChangesGuard } from '@myrmidon/cadmus-core';

// locals
import { HomeComponent } from './home/home.component';
import { ManageUsersPageComponent } from './manage-users-page/manage-users-page.component';
import { RegisterUserPageComponent } from './register-user-page/register-user-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { EditFrameStatsPageComponent } from './edit-frame-stats-page/edit-frame-stats-page.component';

export const routes: Routes = [
  // auth
  { path: 'login', component: LoginPageComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [jwtGuard],
  },
  {
    path: 'register-user',
    component: RegisterUserPageComponent,
    canActivate: [jwtAdminGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersPageComponent,
    canActivate: [jwtAdminGuard],
  },
  {
    path: 'stats',
    component: EditFrameStatsPageComponent,
    canActivate: [jwtGuard],
  },
  // cadmus - items
  {
    path: 'items/:id',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-editor').then(
        (module) => module.ItemEditorComponent,
      ),
    canActivate: [jwtGuard],
    canDeactivate: [pendingChangesGuard],
  },
  {
    path: 'items',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-list').then(
        (module) => module.ItemListComponent,
      ),
    canActivate: [jwtGuard],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('@myrmidon/cadmus-item-search').then(
        (module) => module.ItemSearchComponent,
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - thesauri
  {
    path: 'thesauri/:id',
    loadComponent: () =>
      import('@myrmidon/cadmus-thesaurus-editor').then(
        (module) => module.ThesaurusEditorFeatureComponent,
      ),
    canActivate: [editorGuard],
  },
  {
    path: 'thesauri',
    loadComponent: () =>
      import('@myrmidon/cadmus-thesaurus-list').then(
        (module) => module.ThesaurusListComponent,
      ),
    canActivate: [editorGuard],
  },
  // cadmus - parts
  {
    path: 'items/:iid/general',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-general-pg').then(
        (module) => module.CADMUS_PART_GENERAL_PG_ROUTES,
      ),
    canActivate: [jwtGuard],
  },
  // codicology
  {
    path: 'items/:iid/codicology',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-codicology-pg').then(
        (module) => module.CADMUS_PART_CODICOLOGY_PG_ROUTES,
      ),
    canActivate: [jwtGuard],
  },
  // ndp parts
  {
    path: 'items/:iid/ndp',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-ndp-pg').then(
        (module) => module.CADMUS_PART_NDP_PG_ROUTES,
      ),
    canActivate: [jwtGuard],
  },
  // ndp-books part
  {
    path: 'items/:iid/ndp-books',
    loadChildren: () =>
      import('@myrmidon/cadmus-part-ndpbooks-pg').then(
        (module) => module.CADMUS_PART_NDPBOOKS_PG_ROUTES,
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - graph
  {
    path: 'graph',
    loadComponent: () =>
      import('@myrmidon/cadmus-graph-pg-ex').then(
        (module) => module.GraphEditorExFeatureComponent,
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - preview
  {
    path: 'preview',
    loadChildren: () =>
      import('@myrmidon/cadmus-preview-pg').then(
        (module) => module.CADMUS_PART_PREVIEW_PG_ROUTES,
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - flags
  {
    path: 'flags',
    loadComponent: () =>
      import('@myrmidon/cadmus-flags-pg').then(
        (module) => module.FlagsEditorFeatureComponent,
      ),
    canActivate: [jwtGuard],
  },
  // cadmus - profile editor
  {
    path: 'profile',
    loadChildren: () =>
      import('@myrmidon/cadmus-profile-editor').then(
        (module) => module.CADMUS_PROFILE_EDIT_ROUTES,
      ),
    canActivate: [jwtAdminGuard],
  },
  // cadmus - profile import
  {
    path: 'profile/import',
    loadChildren: () =>
      import('@myrmidon/cadmus-profile-import').then(
        (module) => module.CADMUS_PROFILE_IMPORT_ROUTES,
      ),
    canActivate: [jwtAdminGuard],
  },
  // home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // fallback
  { path: '**', component: HomeComponent },
];
