import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularSvgIconModule } from "angular-svg-icon";
import { NgModule } from "@angular/core";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { LazyLoadImageModule } from "ng-lazyload-image";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HighlightPipe } from "./pipes/highlight.pipe";
import { InputsModule } from "./inputs/inputs.module";
import { PipesModule } from "./pipes/pipes.module";
import { FilterComponent } from "./filter/filter.component";
import { NgbModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { ItemComponent } from "./item/item.component";

@NgModule({
  declarations: [AppComponent, FilterComponent, HighlightPipe, ItemComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LazyLoadImageModule,
    InfiniteScrollModule,
    AngularSvgIconModule.forRoot(),
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
