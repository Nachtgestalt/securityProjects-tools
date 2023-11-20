import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulebaseCpComponent } from './features/rulebase-cp/rulebase-cp.component';

const routes: Routes = [
  {
    path: 'rulebase-cp',
    component: RulebaseCpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
