import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig, arrayAdd } from "@datorama/akita";
import { Track, TrackQuery } from "./track.model";

export interface TrackQueryState extends EntityState<TrackQuery> {}

export function createInitialState(): TrackQueryState {
  return {
    id: 0,
    title: "",
    tracks: [],
    count: 0
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "trackqueries" })
export class TrackQueriesStore extends EntityStore<TrackQueryState> {
  constructor() {
    super(createInitialState());
  }

  addTracks(tracks: Array<Track>) {
    this.update(state => ({
      tracks: arrayAdd(state.tracks, tracks)
    }));
  }
  updatePage(page: { hasMore: boolean; page: number }) {
    //this.updateRoot(page);
  }
}
