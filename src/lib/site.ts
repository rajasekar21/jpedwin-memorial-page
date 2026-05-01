export const siteConfig = {
  repoName: 'webpage-design',
  githubOwner: 'rajasekar21',
  title: 'Memorial Website Platform',
  description:
    'A respectful digital memorial preserving biography, life timeline, family stories, photographs, memories, tributes, and legacy.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rajasekar21.github.io/webpage-design'
};

export function withBasePath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (path.startsWith('http')) return path;
  return `${basePath}${path}`;
}
