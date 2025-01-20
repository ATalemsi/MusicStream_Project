import {Track} from "./track.model";

export interface Album {
  id: string;
  titre: string;
  artiste: string;
  annee: number;
  songs?: Track[];
}


export interface AlbumRequest {
  titre: string;
  artist: string;
  year: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
