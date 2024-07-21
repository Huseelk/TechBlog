import { RouterModule, Routes } from '@angular/router';
import { FrontPageComponent } from './front-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PagesListComponent } from '../pages-list/pages-list.component';
import { PagesComponent } from './pages/pages.component';
import { SubscriberGuard } from 'src/app/guards/subscriber.guard';
import { NgModule } from '@angular/core';



const routes: Routes = [
  {
    path: "", 
    component: FrontPageComponent,
    children: [
      { path: 'home',  redirectTo: 'pages/angular-news', pathMatch: 'full'},
      { 
        path: "article", 
        component: PagesListComponent,
        canActivate: [SubscriberGuard]
      },
      { path: "pages/:url", component: PagesComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'pages/angular-news' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FrontRoutingModule {}
