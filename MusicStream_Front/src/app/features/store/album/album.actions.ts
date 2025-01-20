import {createAction, props} from "@ngrx/store";
import {Album, AlbumRequest, PageResponse} from "../../../core/models/album.model";

export const loadAlbums = createAction(
  '[Album] Load Albums',
  props<{ page: number; size: number; sortBy: string }>()
);

export const loadAlbumsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ albums: PageResponse<Album> }>()
);

export const loadAlbumsFailure = createAction(
  '[Album] Load Albums Failure',
  props<{ error: string }>()
);


export const searchAlbumsByTitle = createAction(
  '[Album] Search Albums By Title',
  props<{ title: string; page: number; size: number; sortBy: string }>()
);

export const searchAlbumsByTitleSuccess = createAction(
  '[Album] Search Albums By Title Success',
  props<{ albums: PageResponse<Album> }>()
);

export const searchAlbumsByTitleFailure = createAction(
  '[Album] Search Albums By Title Failure',
  props<{ error: string }>()
);

export const searchAlbumsByArtist = createAction(
  '[Album] Search Albums By Artist',
  props<{ artist: string; page: number; size: number; sortBy: string }>()
);

export const searchAlbumsByArtistSuccess = createAction(
  '[Album] Search Albums By Artist Success',
  props<{ albums: PageResponse<Album> }>()
);

export const searchAlbumsByArtistFailure = createAction(
  '[Album] Search Albums By Artist Failure',
  props<{ error: string }>()
);

// Filter Albums by Year
export const filterAlbumsByYear = createAction(
  '[Album] Filter Albums By Year',
  props<{ year: number; page: number; size: number; sortBy: string }>()
);

export const filterAlbumsByYearSuccess = createAction(
  '[Album] Filter Albums By Year Success',
  props<{ albums: PageResponse<Album> }>()
);

export const filterAlbumsByYearFailure = createAction(
  '[Album] Filter Albums By Year Failure',
  props<{ error: string }>()
);

// Create Album
export const createAlbum = createAction(
  '[Album] Create Album',
  props<{ album: AlbumRequest }>()
);

export const createAlbumSuccess = createAction(
  '[Album] Create Album Success',
  props<{ album: Album }>()
);

export const createAlbumFailure = createAction(
  '[Album] Create Album Failure',
  props<{ error: string }>()
);

// Update Album
export const updateAlbum = createAction(
  '[Album] Update Album',
  props<{ id: string; album: AlbumRequest }>()
);

export const updateAlbumSuccess = createAction(
  '[Album] Update Album Success',
  props<{ album: Album }>()
);

export const updateAlbumFailure = createAction(
  '[Album] Update Album Failure',
  props<{ error: string }>()
);

// Delete Album
export const deleteAlbum = createAction(
  '[Album] Delete Album',
  props<{ id: string }>()
);

export const deleteAlbumSuccess = createAction(
  '[Album] Delete Album Success',
  props<{ id: string }>()
);

export const deleteAlbumFailure = createAction(
  '[Album] Delete Album Failure',
  props<{ error: string }>()
);
