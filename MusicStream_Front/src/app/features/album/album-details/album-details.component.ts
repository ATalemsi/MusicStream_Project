import { Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject, takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { selectAlbumDetails, selectError, selectLoading } from "../../store/album/album.selectors";
import * as AlbumActions from "../../store/album/album.actions";
import * as TrackActions from "../../store/track/track.actions";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {selectAlbumTracks, selectTrackPage} from "../../store/track/track.selectors";
import { Album } from "../../../core/models/album.model";
import {Track, TrackPage} from "../../../core/models/track.model";// Import AuthState
import { selectIsAdmin } from "../../store/auth/auth.selectors";
import {AuthState} from "../../store/auth/auth.reducer"; // Selector for isAdmin

@Component({
  selector: "app-album-details",
  standalone: true,
  imports: [NgIf, AsyncPipe, NgForOf, NgClass],
  templateUrl: "./album-details.component.html",
  styleUrl: "./album-details.component.scss",
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  albumDetails$: Observable<Album | null> = this.store.select(selectAlbumDetails);
  albumTracks$: Observable<Track[]> = this.store.select(selectAlbumTracks);
  loading$: Observable<boolean> = this.store.select(selectLoading);
  error$: Observable<string | null> = this.store.select(selectError);
  isAdmin$: Observable<boolean> = this.storeAuth.select(selectIsAdmin); // Observable for isAdmin
  private readonly destroy$ = new Subject<void>();
  trackPage$: Observable<TrackPage | null> = this.store.select(selectTrackPage);
  currentPage = 0;
  pageSize = 10;

  constructor(
    private readonly store: Store,
    private readonly storeAuth: Store<{ auth: AuthState }>,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {

    this.albumDetails$.pipe(takeUntil(this.destroy$)).subscribe((album) => {
      console.log("Album Details:", album);
    });

    this.albumTracks$.pipe(takeUntil(this.destroy$)).subscribe((tracks) => {
      console.log("Album Tracks:", tracks);
    });

    combineLatest([this.albumDetails$, this.albumTracks$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([album, tracks]) => {
        console.log("Combined State:", { album, tracks });
      });
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId: string = params["id"];
      if (albumId) {
        this.store.dispatch(AlbumActions.loadAlbumById({ id: albumId }));
        this.store.dispatch(
          TrackActions.loadTracksByAlbum({
            albumId,
            page: 0,
            size: 10,
            sortBy: "title",
          })
        );
      }
    });
  }

  getPageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEditAlbum(id: string) {
    this.router.navigate(["/albums/edit", id]);
  }

  onAddTrack(albumId: string) {
    this.router.navigate(["/albums", albumId, "add-track"]);
  }

  onPlayTrack(track: Track) {
    // Implement your audio playing logic here
    console.log('Playing track:', track.title);
  }

  onDeleteTrack(trackId: string) {
    if (confirm("Are you sure you want to delete this track?")) {
      this.store.dispatch(TrackActions.deleteTrack({ id: trackId }));
    }
  }

  onEditTrack(trackId: string) {

  }

  onBackToList() {
    this.router.navigate(["/albums"]);
  }

  loadMoreTracks(page: number) {
    this.currentPage = page;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId = params["id"];
      this.store.dispatch(
        TrackActions.loadTracksByAlbum({
          albumId,
          page,
          size: this.pageSize,
          sortBy: "title",
        })
      );
    });
  }

  changeSorting(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId = params["id"];
      console.log("Changing sort:", { albumId, sortBy: target.value });
      this.store.dispatch(
        TrackActions.loadTracksByAlbum({
          albumId,
          page: 0,
          size: 10,
          sortBy: target.value,
        })
      );
    });
  }
}
