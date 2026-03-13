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

function formatPrice(amountCents, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amountCents / 100);
}

const fallbackCountries = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Australia', flag: '🇦🇺' }
];

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


app.get('/api/public/countries', async (_req, res) => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag');

    if (!response.ok) {
      return res.json({
        source: 'fallback',
        countries: fallbackCountries
      });
    }

    const countries = await response.json();
    const normalized = countries
      .map((country) => ({
        name: country?.name?.common || '',
        flag: country?.flag || '🌐'
      }))
      .filter((country) => country.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 20);

    if (!normalized.length) {
      return res.json({
        source: 'fallback',
        countries: fallbackCountries
      });
    }

    return res.json({
      source: 'restcountries',
      countries: normalized
    });
  } catch (_error) {
    return res.json({
      source: 'fallback',
      countries: fallbackCountries
    });
  }
});

app.get('/api/public/plans', async (_req, res) => {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ priceCents: 'asc' }]
  });

  return res.json({ plans });
});

app.get('/api/private/purchased-plans', authMiddleware, async (req, res) => {
  const purchasedPlans = await prisma.purchasedPlan.findMany({
    where: { userId: req.user.userId },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({ purchasedPlans });
});

app.get('/api/private/payment-history', authMiddleware, async (req, res) => {
  const paymentHistory = await prisma.paymentHistory.findMany({
    where: { userId: req.user.userId },
    include: { purchasedPlan: { include: { plan: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({ paymentHistory });
});

app.get('/api/private/notifications', authMiddleware, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({ notifications });
});

app.post('/api/private/purchase', authMiddleware, async (req, res) => {
  const { planExternalId, paymentMethod } = req.body || {};

  if (!planExternalId || !paymentMethod) {
    return res.status(400).json({ error: 'planExternalId и paymentMethod обязательны' });
  }

  const plan = await prisma.plan.findUnique({ where: { externalId: planExternalId } });
  if (!plan || !plan.isActive) {
    return res.status(404).json({ error: 'Тариф не найден или недоступен' });
  }

  const startedAt = new Date();
  const expiresAt = new Date(startedAt);
  expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

  const purchaseResult = await prisma.$transaction(async (tx) => {
    const purchasedPlan = await tx.purchasedPlan.create({
      data: {
        userId: req.user.userId,
        planId: plan.id,
        externalId: `PP-${Date.now()}`,
        status: 'ACTIVE',
        startsAt: startedAt,
        expiresAt,
        autoRenew: false
      },
      include: { plan: true }
    });

    const payment = await tx.paymentHistory.create({
      data: {
        userId: req.user.userId,
        purchasedPlanId: purchasedPlan.id,
        externalId: `PAY-${Date.now()}`,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: 'PAID',
        paymentMethod,
        paidAt: startedAt
      }
    });

    await tx.notification.create({
      data: {
        userId: req.user.userId,
        externalId: `NOTIF-${Date.now()}`,
        title: 'Покупка тарифа выполнена',
        message: `Вы успешно купили тариф «${plan.name}» за ${formatPrice(plan.priceCents, plan.currency)}.`,
        type: 'info',
        isRead: false
      }
    });

    return { purchasedPlan, payment };
  });

  return res.status(201).json(purchaseResult);
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
