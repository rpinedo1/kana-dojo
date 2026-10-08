import type { GrammarPack } from '../types';
import { beginnerPack } from './beginner';

/**
 * Registered grammar packs. To add a pack, create data/<pack>/index.ts
 * exporting a GrammarPack and append it here. IDs must be unique across packs.
 */
export const grammarPacks: GrammarPack[] = [beginnerPack];

/** The course shown in the Grammar dojo (currently a single pack). */
export const grammarCourse: GrammarPack = beginnerPack;
