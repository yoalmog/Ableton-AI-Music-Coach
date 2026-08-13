export function getAssetPath(relativePath: string): string {
  const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  const metaEnv = (import.meta as any)?.env;
  let base: string = metaEnv?.BASE_URL || './';
  
  if (base === './' || base === '') {
    return clean;
  }
  
  if (!base.endsWith('/')) {
    base += '/';
  }
  
  return `${base}${clean}`;
}
