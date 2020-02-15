import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagInputModule } from "ngx-chips";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { InputBaseComponent } from "./input.component";
import { RangeComponent } from "./range/range.component";
import { Ng5SliderModule } from "ng5-slider";
import { ChecklistComponent } from "./checklist/checklist.component";
import { TaglistComponent } from "./taglist/taglist.component";
import { PipesModule } from "../pipes/pipes.module";

export const InputList = [InputBaseComponent, RangeComponent, ChecklistComponent, TaglistComponent];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    Ng5SliderModule,
    NgbModule,
    PipesModule
  ],
  declarations: [InputList],
  exports: [InputList],
  providers: []
})
export class InputsModule {}
