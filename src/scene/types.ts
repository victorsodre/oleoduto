import type { Group, Vector3 } from 'three';
import type { RouteEvent, Seal } from '../simulation/flow.ts';

export type Part = {
  id: string; label: string; detail: string; note: string;
  group: Group; offset: Vector3;
};
export type Assembly = {
  root: Group; parts: Part[];
  update: (progress: number, cutaway: boolean, routes: RouteEvent[], seal: Seal) => void;
  /** Redraws the canvas labels once the web font is available. */
  refreshLabels: () => void;
  /** Keeps the 3D labels at a fixed on-screen size for a viewport of `width` × `height` px. */
  sizeLabels: (width: number, height: number, projectionY: number) => void;
  dispose: () => void;
};
export type ViewState = {
  progress: number; cutaway: boolean; explosion: number; routes: RouteEvent[]; seal: Seal;
  selected: string | null; isolated: boolean; wireframe: boolean;
};
export type SceneHandle = {
  update: (state: ViewState) => void;
  home: () => void; focus: (id: string) => void;
  /** Horizontal center of a part on the canvas, from 0 (left) to 1 (right). */
  screenX: (id: string) => number | null;
  zoom: (factor: number) => void; capture: (portrait?: boolean) => void;
  preset: (view: 'perspective' | 'side' | 'rear') => void;
  dispose: () => void;
};
