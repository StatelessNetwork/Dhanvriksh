import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeTabsPage } from './committee-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteeTabsPage,
    children: [
      // Tab 1: Home (Loan List)
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      // Tab 2: Manage Committee
      {
        path: 'committee-list',
        loadChildren: () => import('../committee/committee-list/committee-list.module').then(m => m.CommitteeListPageModule)
      },
      // Tab 3: Profile
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      // Tab 1: Home (Loan List)
      {
        path: 'loan-list',
        loadChildren: () => import('../loans/loan-list/loan-list.module').then(m => m.LoanListPageModule)
      },
      // Default route
      {
        path: '',
        redirectTo: '/committee-tabs/committee-list',
        pathMatch: 'full'
      }
    ]
  },
  // Fallback for any unmatched paths
  {
    path: '',
    redirectTo: '/committee-tabs/committee-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeTabsPageRoutingModule {}
