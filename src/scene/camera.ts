import { Box3, Mesh, PerspectiveCamera, Vector3, type Object3D } from 'three';

/**
 * Corners of each visible mesh's world box. Much tighter than the corners of one box around the
 * whole object, which leave the long diagonal pipeline small in the frame.
 */
export function framePoints(object: Object3D): Vector3[] {
  const points: Vector3[] = [], box = new Box3();
  object.updateWorldMatrix(true, true);
  object.traverseVisible(item => {
    if (!(item instanceof Mesh)) return;
    box.setFromObject(item); if (box.isEmpty()) return;
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) points.push(new Vector3(x, y, z));
  });
  return points;
}

export function framing(points: Vector3[], aspect: number, direction: Vector3, fov = 38) {
  const center = new Box3().setFromPoints(points).getCenter(new Vector3());
  const forward = direction.clone().normalize();
  const right = new Vector3(0, 1, 0).cross(forward).normalize();
  const up = forward.clone().cross(right).normalize();
  const tanV = Math.tan(fov * Math.PI / 360), tanH = tanV * Math.max(.1, aspect);
  let distance = 1;
  for (const point of points) {
    const p = point.clone().sub(center), toward = p.dot(forward);
    distance = Math.max(distance, Math.abs(p.dot(right)) / tanH + toward, Math.abs(p.dot(up)) / tanV + toward);
  }
  distance *= 1.12;
  return { center, distance, position: center.clone().addScaledVector(forward, distance) };
}

export function fit(camera: PerspectiveCamera, points: Vector3[], direction: Vector3) {
  const pose = framing(points, camera.aspect, direction, camera.fov);
  camera.position.copy(pose.position); camera.lookAt(pose.center); camera.updateProjectionMatrix();
  return pose.center;
}

/** Current viewing direction, from the orbit target towards the camera. */
export const orbitDirection = (camera: PerspectiveCamera, target: Vector3) => camera.position.clone().sub(target).normalize();

/**
 * New camera position after the viewport aspect changes. Keeps the user's target and orbit
 * direction, and scales the distance by how much the fitting distance changed, so a zoom the
 * user made survives resizes and fullscreen.
 */
export function keepOrbit(position: Vector3, target: Vector3, points: Vector3[], fromAspect: number, toAspect: number, fov = 38) {
  const direction = position.clone().sub(target).normalize();
  const ratio = framing(points, toAspect, direction, fov).distance / framing(points, fromAspect, direction, fov).distance;
  return target.clone().addScaledVector(direction, position.distanceTo(target) * ratio);
}
