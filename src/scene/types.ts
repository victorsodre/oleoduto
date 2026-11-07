import type { Group, Vector3 } from 'three';
import type { RouteEvent } from '../simulation/flow.ts';

export type Part = {
  id: string; label: string; detail: string; note: string;
  group: Group; offset: Vector3;
};
export type Assembly = {
  root: Group; parts: Part[];
  update: (progress: number, cutaway: boolean, routes: RouteEvent[]) => void;
  dispose: () => void;
};
export type ViewState = {
  progress: number; cutaway: boolean; explosion: number; routes: RouteEvent[];
  selected: string | null; isolated: boolean; wireframe: boolean;
};
export type SceneHandle = {
  update: (state: ViewState) => void;
  home: () => void; focus: (id: string) => void;
  zoom: (factor: number) => void; capture: (portrait?: boolean) => void;
  preset: (view: 'perspective' | 'side' | 'rear') => void;
  dispose: () => void;
};
