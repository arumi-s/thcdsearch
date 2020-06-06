import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HighlightPipe } from "./pipes/highlight.pipe";
import { InputsModule } from "./inputs/inputs.module";
import { PipesModule } from "./pipes/pipes.module";
import { FilterComponent } from "./filter/filter.component";
import { NgbModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [AppComponent, FilterComponent, HighlightPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbRatingModule,
    InputsModule,
    PipesModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
