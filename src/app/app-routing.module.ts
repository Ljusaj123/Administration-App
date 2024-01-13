import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "**", redirectTo: "home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
