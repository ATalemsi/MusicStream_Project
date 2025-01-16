import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, takeUntil } from "rxjs";
import { PlayerState, Track } from "../../../../core/models/track.model";
import { Store } from "@ngrx/store";
import {
  selectFilteredTracks,
  selectTrackError,
  selectTrackLoading
} from "../../../store/track/track.selectors";
import * as TrackActions from "../../../store/track/track.actions";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from "../../../../shared/click-outside.directive";
import { AudioPlayerService } from "../../../../core/services/audio-player/audio-player.service";
import { TrackSearchPipe } from "../../../../shared/pipe/track-search.pipe";
import { FormsModule } from "@angular/forms";

import { TrackService } from "../../../../core/services/track/track.service"; // Added import for TrackService

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    ClickOutsideDirective,
    TrackSearchPipe,
    FormsModule,

  ],
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        )
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class LibraryListComponent implements OnInit, OnDestroy {
  tracks$: Observable<Track[]>;
  trackError$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  openDropdownId: string | null = null;
  playerState: PlayerState = PlayerState.STOPPED;
  searchTerm: string = '';
  private readonly playerStateSubscription: Subscription;
  private readonly destroy$ = new Subject<void>();
  protected readonly imageLoadError = new BehaviorSubject<{ [key: string]: boolean }>({});
  imageUrls: { [trackId: string]: string } = {};

  readonly defaultCoverImage = 'https://res.cloudinary.com/dz4pww2qv/image/upload/v1735915190/apbake6pbviilhdi1brd.jpg';

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly audioPlayer: AudioPlayerService,
    private readonly trackService: TrackService,
  ) {
    this.tracks$ = this.store.select(selectFilteredTracks);
    this.trackError$ = this.store.select(selectTrackError);
    this.isLoading$ = this.store.select(selectTrackLoading);
    this.playerStateSubscription = this.audioPlayer.playerState$.pipe(takeUntil(this.destroy$))
      .subscribe(state => this.playerState = state);
  }

  ngOnInit(): void {
    this.preloadDefaultImage();
    this.loadTracks();
    this.tracks$.subscribe((tracks) => {
      tracks.forEach((track) => {
        if (track.imageFileId) {
          this.trackService.getImageFileUrl(track.imageFileId).subscribe({
            next: (url) => {
              if (typeof url === "string") {
                this.imageUrls[track.id!] = url;
              }
              console.log('Image URL fetched for track:', track.title, url);
            },
            error: (err) => {
              console.error('Error fetching image file URL:', err);
            },
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.playerStateSubscription) {
      this.playerStateSubscription.unsubscribe();
    }
  }

  private preloadDefaultImage(): void {
    const img = new Image();
    img.src = this.defaultCoverImage;
  }

  private loadTracks(): void {
    this.tracks$.pipe(takeUntil(this.destroy$)).subscribe((tracks) => {
      if (!tracks || tracks.length === 0) {
        this.store.dispatch(TrackActions.loadTracks());
      }
    });
  }

  handleImageError(trackId: string, event: Event): void {
    console.error(`Image load error for track ${trackId}:`, {
      type: event.type,
      target: event.target,
      currentTarget: event.currentTarget,
      timeStamp: event.timeStamp,
    });

    this.store.dispatch(TrackActions.imageLoadError({ trackId }));
    this.imageLoadError.next({ ...this.imageLoadError.value, [trackId]: true });
  }

  getTrackImage(track: Track): string {
    if (!track.imageUrl) {
      console.log(`No imageUrl for track ${track.id}`);
      return this.defaultCoverImage;
    }


    if (this.isBlobUrl(track.imageUrl)) {
      console.log(`Using blob URL for track ${track.id}:`, track.imageUrl);
      return track.imageUrl;
    }
    const hasError = this.imageLoadError.value[track.id];
    if (hasError) {
      console.log(`Using default image for track ${track.id} due to previous error`);
      return this.defaultCoverImage;
    }
    return track.imageUrl;
  }


  private isBlobUrl(url: string | undefined): boolean {
    return <boolean>url?.startsWith('blob:');
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  toggleDropdown(trackId: string): void {
    this.openDropdownId = this.openDropdownId === trackId ? null : trackId;
  }

  closeDropdown(trackId: string): void {
    if (this.openDropdownId === trackId) {
      this.openDropdownId = null;
    }
  }

  onUpdateTrack(track: Track): void {
    console.log(`Navigating to edit track with ID: ${track.id}`);
    this.router.navigate(['/track/edit', track.id]).catch(err => {
      console.error('Navigation error:', err);
    });
    this.closeDropdown(track.id);
  }

  onDeleteTrack(trackId: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ id: trackId }));
    }
    this.closeDropdown(trackId);
  }

  navigateToTrackDetails(track: Track): void {
    this.audioPlayer.play(track).catch(error => {
      console.error('Error playing track:', error);
    });
    this.router.navigate(['/track', track.id]).then(() => {
      console.log('Navigated to track details');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}
