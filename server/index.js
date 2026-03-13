const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const feedbackMessages = [];

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'http://wordpress:80';

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..')));

function createToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d'
  });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (_error) {
    res.status(500).json({ status: 'error', message: 'Database is unavailable' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'name, email и password обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });

  const token = createToken(user);
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email и password обязательны' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const token = createToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  return res.json({ user });
});

app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email и message обязательны' });
  }

  feedbackMessages.push({
    id: feedbackMessages.length + 1,
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ status: 'ok' });
});

app.get('/api/cms/layout/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const wpResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`);

    if (!wpResponse.ok) {
      return res.status(502).json({ error: 'Не удалось получить данные из WordPress' });
    }

    const pages = await wpResponse.json();
    const page = pages[0];

    if (!page) {
      return res.status(404).json({ error: `Страница со slug '${slug}' не найдена в WordPress` });
    }

    return res.json({
      slug,
      title: page.title?.rendered || '',
      content: page.content?.rendered || '',
      updatedAt: page.modified
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Ошибка при запросе к WordPress' });
  }
});

app.get('/account', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'account.html'));
});

app.get('/faq', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'faq.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Freecity server started on http://0.0.0.0:${PORT}`);
});
