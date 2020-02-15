import { Injectable } from "@angular/core";
import { TrackQueriesStore } from "./tracks.store";
import { transaction } from "@datorama/akita";
import { Observable, timer } from "rxjs";
import { mapTo } from "rxjs/operators";

export function getTracks(params = { page: 1 }): Observable<any> {
  return timer(200).pipe(
    mapTo(() => {
      const perPage = 10;
      const offset = (params.page - 1) * perPage;
      const paginatedItems = Array.from({ length: 10 }, (v, i) => (i + params.page * 10).toString());
      const hasMore = offset + perPage !== 1000;

      return {
        currentPage: params.page,
        hasMore,
        perPage: perPage,
        total: 1000,
        lastPage: Math.ceil(1000 / perPage),
        data: paginatedItems
      };
    })
  );
}

@Injectable({ providedIn: "root" })
export class TracksService {
  constructor(private tracksStore: TrackQueriesStore) {}

  get(page: number) {
    this.tracksStore.setLoading(true);
    getTracks({ page }).subscribe(res => this.updateTracks(res));
  }

  @transaction()
  private updateTracks(res: any) {
    const nextPage = res.currentPage + 1;
    this.tracksStore.add(res.data);
    this.tracksStore.updatePage({ hasMore: res.hasMore, page: nextPage });
    this.tracksStore.setLoading(false);
  }
}
