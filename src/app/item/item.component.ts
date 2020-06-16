import { Component, OnInit, Input } from "@angular/core";
import { Item } from "../options";
import { WpgValue } from "../apis/smw/data-types";

@Component({
  selector: "item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.less"]
})
export class ItemComponent implements OnInit {
  @Input()
  item: Item;

  constructor() {}

  ngOnInit(): void {}

  printWpgValues(values: Array<WpgValue>) {
    return values.map(value => value.fulltext).join(",");
  }
}
