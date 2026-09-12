import { ReferenceImageItem } from '../types/workspaceReference';
import {
  referenceImageLibrary,
  ReferenceImageLibrary,
  ReferenceImageLibraryService
} from '../services/referenceImageLibraryService';

/**
 * Official Ableton Live Reference Library
 * Centralized registry of all Ableton Live 12 workspace reference items
 * fed by the ReferenceImageLibrary service.
 */
export const REFERENCE_IMAGE_LIBRARY: Record<string, ReferenceImageItem> =
  referenceImageLibrary.asRecord();

export { referenceImageLibrary, ReferenceImageLibrary, ReferenceImageLibraryService };
