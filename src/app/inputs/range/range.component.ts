import { Component } from "@angular/core";
import { InputBaseComponent } from "../input.component";
import { Options } from "ng5-slider";

@Component({
  selector: "input-range",
  templateUrl: "./range.component.html",
  styleUrls: ["./range.component.less"]
})
export class RangeComponent extends InputBaseComponent {
  _value: [number, number] = [null, null];
  sliderOptions: Options = { animate: false, hideLimitLabels: true };

  onInit() {
    this.sliderOptions.floor = this.option.content.min;
    this.sliderOptions.ceil = this.option.content.max;
    if (this.option.content.sliderOptions) {
      this.sliderOptions = {
        ...this.sliderOptions,
        ...this.option.content.sliderOptions
      };
    }
    if (this._value[0] == null) this._value[0] = this.option.content.min;
    if (this._value[1] == null) this._value[1] = this.option.content.max;
  }

  valueToCriteria(value: [number, number]) {
    const [start, end] = value;
    if (start === this.option.content.min && end === this.option.content.max) return null;
    if (start === end) {
      return start === 0 ? ["=", start.toString()] : [start.toString()];
    } else {
      return [">=" + start, "<=" + end];
    }
  }

  valueToRoute(value: [number, number]): string {
    return value[0] === this.option.content.min && value[1] === this.option.content.max ? null : value.join(":");
  }

  routeToValue(route: string) {
    if (route == null) return [this.option.content.min, this.option.content.max];
    const array = route.split(":");
    return [this.getInt(array[0]), this.getInt(array[1])];
  }

  set minValue(value: number) {
    this._value[0] = this.getInt(value);
  }
  get minValue(): number {
    return this._value[0];
  }

  set maxValue(value: number) {
    this._value[1] = this.getInt(value);
  }
  get maxValue(): number {
    return this._value[1];
  }

  update() {
    this.value = this._value;
  }

  getInt(value: string | number): number {
    return value == null || value === ""
      ? null
      : Math.min(
          Math.max((typeof value === "number" ? value : parseFloat(value)) || 0, this.option.content.min),
          this.option.content.max
        );
  }
}
