export interface Track {
  id: number;
  title: string;
  arrange?: Array<string>;
}

export interface TrackQuery {
  id: number;
  title: string;
  tracks: Array<Track>;
  count: number;
}
