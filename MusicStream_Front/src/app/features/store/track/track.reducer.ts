// src/app/store/reducers/track.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as TrackActions from './track.actions';
import { TrackState } from './track.selectors';


export const initialState: TrackState = {
  tracks: [],
  trackPage: null,
  loading: false,
  error: null
};
export const trackFeatureKey = 'track';
export const trackReducer = createReducer(
  initialState,
  on(TrackActions.searchTracks, state => ({ ...state, loading: true })),
  on(TrackActions.searchTracksSuccess, (state, { trackPage }) => ({
    ...state,
    trackPage: trackPage,
    tracks: trackPage.content,
    loading: false
  })),
  on(TrackActions.searchTracksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.loadTracksByAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TrackActions.loadTracksByAlbumSuccess, (state, { trackPage }) => ({
    ...state,
    trackPage,
    loading: false,
    error: null
  })),
  on(TrackActions.loadTracksByAlbumFailure, (state, { error }) => ({
    ...state,
    trackPage: null,
    loading: false,
    error
  })),

  on(TrackActions.createTrack, state => ({ ...state, loading: true })),
  on(TrackActions.createTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    loading: false
  })),
  on(TrackActions.createTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.updateTrack, state => ({ ...state, loading: true })),
  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t),
    loading: false
  })),
  on(TrackActions.updateTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.deleteTrack, state => ({ ...state, loading: true })),
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(track => track.id !== id),
    loading: false
  })),
  on(TrackActions.deleteTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
