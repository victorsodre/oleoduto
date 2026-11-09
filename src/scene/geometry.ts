import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const materials = () => ({
  yellow: new T.MeshStandardMaterial({ color: '#f4bf24', roughness: .36, metalness: .18 }),
  ivory: new T.MeshStandardMaterial({ color: '#dce0de', roughness: .42, metalness: .28 }),
  steel: new T.MeshStandardMaterial({ color: '#526273', roughness: .38, metalness: .65 }),
  silver: new T.MeshStandardMaterial({ color: '#b0bdc5', roughness: .27, metalness: .8 }),
  dark: new T.MeshStandardMaterial({ color: '#18212c', roughness: .62, metalness: .38 }),
});

export function mesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, x = 0, y = 0, z = 0) {
  const item = new T.Mesh(geometry, material);
  item.position.set(x, y, z); item.castShadow = true; item.receiveShadow = true;
  parent.add(item); return item;
}

export function box(parent: T.Object3D, dimensions: [number, number, number], position: [number, number, number], material: T.Material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...dimensions, 2, radius) : new T.BoxGeometry(...dimensions);
  return mesh(parent, geometry, material, ...position);
}

export function rod(parent: T.Object3D, radius: number, material: T.Material) {
  return mesh(parent, new T.CylinderGeometry(radius, radius, 1, 12), material);
}

const up = new T.Vector3(0, 1, 0);
export function connect(item: T.Mesh, a: T.Vector3, b: T.Vector3) {
  const direction = b.clone().sub(a);
  item.position.copy(a).add(b).multiplyScalar(.5);
  item.scale.y = Math.max(.001, direction.length());
  item.quaternion.setFromUnitVectors(up, direction.normalize());
}

export function disposeTree(root: T.Object3D) {
  const geometries = new Set<T.BufferGeometry>(), mats = new Set<T.Material>();
  root.traverse(object => { if (object instanceof T.Mesh) {
    geometries.add(object.geometry);
    for (const m of Array.isArray(object.material) ? object.material : [object.material]) mats.add(m);
  }});
  for (const g of geometries) g.dispose();
  for (const m of mats) {
    for (const v of Object.values(m)) if (v instanceof T.Texture) v.dispose();
    m.dispose();
  }
}
