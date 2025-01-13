import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MusicCategory, Track } from '../../../../core/models/track.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as TrackActions from '../../../store/track.actions';
import { selectTrackById } from '../../../store/track.selectors';
import { NavbarComponent } from '../../../navbar/navbar.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-update-track',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './update-track.component.html',
  styleUrls: ['./update-track.component.scss']
})
export class UpdateTrackComponent implements OnInit {
  trackForm!: FormGroup;
  imagePreview: string | null = null;
  track$!: Observable<Track | undefined>;
  trackId!: string | null;
  categories: MusicCategory[] = Object.values(MusicCategory);
  selectedAudioFile!: File | null;
  successMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.trackId = this.route.snapshot.paramMap.get('id');
    if (this.trackId) {
      this.store.dispatch(TrackActions.loadTrack({ id: this.trackId }));
      this.track$ = this.store.select(selectTrackById(this.trackId));

      this.track$.subscribe(track => {
        if (track) {
          this.initializeForm(track);
        }
      });
    }
  }

  initializeForm(track: Track): void {
    this.trackForm = this.fb.group({
      title: [track.title, [Validators.required]],
      artist: [track.artist, [Validators.required]],
      description: [track.description],
      category: [track.category, [Validators.required]],
      audioFile: [null], // Set to null initially
      imageFile: [null], // Set to null initially
    });

    if (track.imageUrl) {
      this.imagePreview = track.imageUrl;
    }

    if (track.fileUrl) {
      this.selectedAudioFile = null;
    }
  }

  validateUpdateImageFile(file: File): boolean {
    const MAX_IMAGE_SIZE_MB = 5;
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB. Please upload a smaller image.`);
      return false;
    }

    if (!allowedImageTypes.includes(file.type)) {
      alert("Invalid image type. Only JPEG, PNG, and WebP images are allowed.");
      return false;
    }

    return true;
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (this.validateUpdateImageFile(file)) {
        this.trackForm.patchValue({ imageFile: file });

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.trackForm.patchValue({ imageFile: null });
        this.imagePreview = null;
      }
    }
  }

  removeImage(): void {
    this.trackForm.patchValue({ imageFile: null });
    this.imagePreview = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
      this.trackForm.patchValue({ audioFile: this.selectedAudioFile.name });
    }
  }

  onSubmit(): void {
    if (this.trackForm.valid) {
      const updatedTrack = {
        id: this.trackId,
        ...this.trackForm.value,
        audioFile: this.selectedAudioFile || null
      };
      this.store.dispatch(
        TrackActions.updateTrack({ updatedTrack: updatedTrack, audioFile: this.selectedAudioFile })
      );
      this.successMessage = 'Track updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/library']).catch(err => {
          console.error('Navigation error:', err);
        });
      }, 2000);
    } else {
      console.error('Form is invalid');
    }
  }
}
