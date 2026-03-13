const fs = require('fs/promises');
const path = require('path');

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'http://localhost:8081';
const WP_ADMIN_USER = process.env.WP_ADMIN_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function requireAuth() {
  if (!WP_ADMIN_USER || !WP_APP_PASSWORD) {
    throw new Error('Set WP_ADMIN_USER and WP_APP_PASSWORD to seed WordPress templates.');
  }
}

function authHeaders() {
  const credentials = Buffer.from(`${WP_ADMIN_USER}:${WP_APP_PASSWORD}`).toString('base64');
  return {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json'
  };
}

async function fetchPageBySlug(slug) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&context=edit`, {
    headers: authHeaders()
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cannot read page ${slug}: ${response.status} ${body}`);
  }

  const pages = await response.json();
  return pages[0] || null;
}

async function upsertPage(template) {
  const existing = await fetchPageBySlug(template.slug);
  const payload = {
    title: template.title,
    slug: template.slug,
    status: 'publish',
    excerpt: template.excerpt || '',
    content: template.content
  };

  if (!existing) {
    const createResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });

    if (!createResponse.ok) {
      const body = await createResponse.text();
      throw new Error(`Cannot create page ${template.slug}: ${createResponse.status} ${body}`);
    }

    return 'created';
  }

  const updateResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages/${existing.id}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!updateResponse.ok) {
    const body = await updateResponse.text();
    throw new Error(`Cannot update page ${template.slug}: ${updateResponse.status} ${body}`);
  }

  return 'updated';
}

async function main() {
  requireAuth();

  const templatesPath = path.resolve(__dirname, '..', 'cms', 'homepage-blocks.json');
  const templates = JSON.parse(await fs.readFile(templatesPath, 'utf8'));

  for (const template of templates) {
    const state = await upsertPage(template);
    console.log(`${template.slug}: ${state}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
