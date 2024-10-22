import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { LanguageGuard } from './guards/language.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    ,canLoad:[IntroGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard] 
  },
  {
    path: 'languages',
    loadChildren: () => import('./languages/languages.module').then( m => m.LanguagesPageModule),
    canLoad:[LanguageGuard]
  },
  {
    path: 'regsiter-by-mobile-number',
    loadChildren: () => import('./registration/regsiter-by-mobile-number/regsiter-by-mobile-number.module').then( m => m.RegsiterByMobileNumberPageModule)
  },
  {
    path: 'add-user-details',
    loadChildren: () => import('./registration/add-user-details/add-user-details.module').then( m => m.AddUserDetailsPageModule)
  },
  {
    path: 'add-user-details/:id',
    loadChildren: () => import('./registration/add-user-details/add-user-details.module').then( m => m.AddUserDetailsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'add-new-committee',
    loadChildren: () => import('./committee/add-new-committee/add-new-committee.module').then( m => m.AddNewCommitteePageModule)
  },
  {
    path: 'committee-list',
    loadChildren: () => import('./committee/committee-list/committee-list.module').then( m => m.CommitteeListPageModule)
  },
  {
    path: 'member-list',
    loadChildren: () => import('./committee/member-list/member-list.module').then( m => m.MemberListPageModule)
  },
  {
    path: 'member-details',
    loadChildren: () => import('./committee/member-details/member-details.module').then( m => m.MemberDetailsPageModule)
  },
  {
    path: 'add-member',
    loadChildren: () => import('./committee/add-member/add-member.module').then( m => m.AddMemberPageModule)
  },
  {
    path: 'committee-mapping-member',
    loadChildren: () => import('./committee/committee-mapping-member/committee-mapping-member.module').then( m => m.CommitteeMappingMemberPageModule)
  },
  {
    path: 'add-existing-member',
    loadChildren: () => import('./committee/add-existing-member/add-existing-member.module').then( m => m.AddExistingMemberPageModule)
  },
  {
    path: 'committee-monthly-breakup',
    loadChildren: () => import('./committee/committee-monthly-breakup/committee-monthly-breakup.module').then( m => m.CommitteeMonthlyBreakupPageModule)
  },
  {
    path: 'monthly-member-breakup',
    loadChildren: () => import('./committee/monthly-member-breakup/monthly-member-breakup.module').then( m => m.MonthlyMemberBreakupPageModule)
  },
  {
    path: 'monthly-member-payment-update',
    loadChildren: () => import('./committee/monthly-member-payment-update/monthly-member-payment-update.module').then( m => m.MonthlyMemberPaymentUpdatePageModule)
  },
  {
    path: 'monthly-committee-drawn-update',
    loadChildren: () => import('./committee/monthly-committee-drawn-update/monthly-committee-drawn-update.module').then( m => m.MonthlyCommitteeDrawnUpdatePageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./faqs/faqs.module').then( m => m.FaqsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'calculator',
    loadChildren: () => import('./committee/calculator/calculator.module').then( m => m.CalculatorPageModule)
  },
  {
    path: 'committee-tabs',
    loadChildren: () => import('./committee-tabs/committee-tabs.module').then( m => m.CommitteeTabsPageModule)
  },
  {
    path: 'create-new-loan',
    loadChildren: () => import('./loans/create-new-loan/create-new-loan.module').then( m => m.CreateNewLoanPageModule)
  },
  {
    path: 'form-wizard',
    loadChildren: () => import('./form-wizard/form-wizard.module').then( m => m.FormWizardPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./loans/documents-upload/documents-upload.module').then( m => m.DocumentsUploadPageModule)
  },
  {
    path: 'loan-detail-by-id',
    loadChildren: () => import('./loans/loan-detail-by-id/loan-detail-by-id.module').then( m => m.LoanDetailByIdPageModule)
  },
  {
    path: 'loan-list',
    loadChildren: () => import('./loans/loan-list/loan-list.module').then( m => m.LoanListPageModule)
  },
  {
    path: 'update-payment',
    loadChildren: () => import('./loans/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'payment-schedule-list',
    loadChildren: () => import('./loans/payment-schedule-list/payment-schedule-list.module').then( m => m.PaymentScheduleListPageModule)
  },
  {
    path: 'payment-history',
    loadChildren: () => import('./loans/payment-history/payment-history.module').then( m => m.PaymentHistoryPageModule)
  },
  {
    path: 'loan-tabs',
    loadChildren: () => import('./loan-tabs/loan-tabs.module').then( m => m.LoanTabsPageModule)
  },
  {
    path: 'recent-transaction',
    loadChildren: () => import('./recent-transaction/recent-transaction.module').then( m => m.RecentTransactionPageModule)
  },
  {
    path: 'recent-notification',
    loadChildren: () => import('./recent-notification/recent-notification.module').then( m => m.RecentNotificationPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'committee-details',
    loadChildren: () => import('./committee/committee-details/committee-details.module').then( m => m.CommitteeDetailsPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
