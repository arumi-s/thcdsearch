import { Pipe, PipeTransform } from "@angular/core";

const escape = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

@Pipe({
  name: "highlight"
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, arg: string) {
    if (!arg.trim()) {
      return value;
    }
    try {
      //const regex = new RegExp(`(${escape(arg)})`, "i");
      return `<b>${value}</b>`; //value.replace(regex, "<b>$1</b>");
    } catch (e) {
      return value;
    }
  }
}
