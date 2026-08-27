export const MOBILE_SCENE_QUERY = '(max-width: 720px)';
export const COARSE_POINTER_QUERY = '(pointer: coarse)';

/**
 * Keep the same visual language on every screen while matching the amount of
 * work to the device. This is deliberately pure so the profile can be tested
 * without WebGL or a browser.
 */
export function sceneProfileForDevice({ small = false, coarse = false } = {}) {
    const lightweight = small || coarse;

    return lightweight
        ? {
              quality: 'mobile',
              particleCount: 650,
              dpr: 1,
              antialias: false,
              powerPreference: 'low-power',
          }
        : {
              quality: 'desktop',
              particleCount: 1800,
              dpr: [1, 2],
              antialias: true,
              powerPreference: 'high-performance',
          };
}
