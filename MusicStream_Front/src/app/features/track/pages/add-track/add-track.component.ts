import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { createTrack} from "../../../store/track/track.actions";
import { selectTrackError, selectTrackLoading } from "../../../store/track/track.selectors";
import { Track, MusicCategory } from 'src/app/core/models/track.model';
import {TrackService} from "../../../../core/services/track/track.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit, OnDestroy {
  trackForm: FormGroup;
  categories: string[] = Object.values(MusicCategory);
  selectedFile: File | null = null;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  albumId: string | undefined;
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly trackService: TrackService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {

    this.trackForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(100)],
      duree: [null, [Validators.required, Validators.min(1)]],
      trackNumber: [null, [Validators.required, Validators.min(1)]],
      category: [null],
      albumId: ['']
    });

    this.error$ = this.store.select(selectTrackError);
    this.loading$ = this.store.select(selectTrackLoading);
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get("id") ?? ""
    this.trackForm.patchValue({
      albumId: this.albumId
    });
  }

  onSubmit(): void {
    if (this.trackForm.valid && this.selectedFile) {
      const trackData: Track = this.trackForm.value;
      console.log('Submitting Track Data:', trackData);
      console.log('Selected File:', this.selectedFile);

      this.trackService.createTrack(trackData, this.selectedFile).subscribe(
        (response) => {
          console.log('Track created successfully', response);
          this.router.navigate(["/albums", this.albumId]);
        },
        (error) => {
          console.error('Error creating track', error);
        }
      );
    } else {
      Object.keys(this.trackForm.controls).forEach(key => {
        const control = this.trackForm.get(key);
        control?.markAsTouched();
      });
    }
  }


  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const allowedFormats = ['audio/mpeg', 'audio/wav'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (!allowedFormats.includes(file.type)) {
        alert('Invalid file format. Only MP3 and WAV files are allowed.');
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSize) {
        alert('File size exceeds 10 MB.');
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  onCancel(): void {
    // Implement cancel logic (e.g., navigate back or reset form)
    this.trackForm.reset();
    this.selectedFile = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
