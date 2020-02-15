import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { TrackQueriesStore, TrackQueryState } from "./tracks.store";
import { Track } from "./Track.model";

@Injectable({
  providedIn: "root"
})
export class TracksQuery extends QueryEntity<TrackQueryState, Track> {
  constructor(protected store: TrackQueriesStore) {
    super(store);
  }
}
