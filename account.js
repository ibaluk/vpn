const { createApp } = Vue;

const TOKEN_KEY = 'freecity_token';

createApp({
  data() {
    return {
      brand: 'Freecity',
      profile: {
        name: 'Гость',
        email: '—',
        country: 'Россия',
        devices: 0,
        status: 'Free'
      },
      auth: {
        name: '',
        email: '',
        password: '',
        mode: 'login',
        error: '',
        loading: false,
        token: localStorage.getItem(TOKEN_KEY) || ''
      },
      purchasedPlans: [
        { name: 'Freecity 12 месяцев', period: '15.01.2026 — 14.01.2027', devices: 'до 5 устройств', status: 'Активен' },
        { name: 'Streaming Pack', period: '15.01.2026 — 14.04.2026', devices: 'Smart TV + 2 устройства', status: 'Активен' }
      ],
      paymentHistory: [
        { id: 'FC-90231', date: '15.01.2026', amount: '2 988₽', method: 'Банковская карта •• 4481', status: 'Успешно' },
        { id: 'FC-87310', date: '15.10.2025', amount: '897₽', method: 'SBP', status: 'Успешно' },
        { id: 'FC-86002', date: '15.09.2025', amount: '299₽', method: 'Банковская карта •• 4481', status: 'Возврат' }
      ],
      notifications: [
        { title: 'Продление подписки', text: 'Следующее списание 15.01.2027. Мы заранее напомним за 3 дня.', type: 'info' },
        { title: 'Новый вход в аккаунт', text: 'Обнаружен вход с устройства Windows (Москва) сегодня в 18:42.', type: 'alert' },
        { title: 'Бонус 20% на семейный тариф', text: 'Доступно персональное предложение до конца недели.', type: 'promo' }
      ]
    };
  },
  computed: {
    isAuthorized() {
      return Boolean(this.auth.token);
    }
  },
  async mounted() {
    if (this.auth.token) {
      await this.loadMe();
    }
  },
  methods: {
    async submitAuth() {
      this.auth.error = '';
      this.auth.loading = true;

      const endpoint = this.auth.mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = {
        email: this.auth.email,
        password: this.auth.password,
        ...(this.auth.mode === 'register' ? { name: this.auth.name } : {})
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          this.auth.error = data.error || 'Ошибка авторизации';
          return;
        }

        this.auth.token = data.token;
        localStorage.setItem(TOKEN_KEY, data.token);
        this.profile.name = data.user.name;
        this.profile.email = data.user.email;
        this.profile.status = 'Premium';
      } catch (_error) {
        this.auth.error = 'Сервер API недоступен';
      } finally {
        this.auth.loading = false;
      }
    },
    async loadMe() {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        });

        if (!response.ok) {
          this.logout();
          return;
        }

        const data = await response.json();
        this.profile.name = data.user.name;
        this.profile.email = data.user.email;
        this.profile.status = 'Premium';
      } catch (_error) {
        this.auth.error = 'Не удалось получить профиль';
      }
    },
    logout() {
      this.auth.token = '';
      localStorage.removeItem(TOKEN_KEY);
      this.profile.name = 'Гость';
      this.profile.email = '—';
      this.profile.status = 'Free';
    }
  },
  template: `
    <div class="page">
      <header class="hero hero--compact">
        <nav class="nav">
          <div class="logo">{{ brand }}</div>
          <a href="./index.html" class="btn btn--small">На главную</a>
        </nav>
      </header>

      <main>
        <section class="account account--top">
          <article class="panel auth-panel" v-if="!isAuthorized">
            <h2>{{ auth.mode === 'register' ? 'Регистрация' : 'Авторизация' }}</h2>
            <p class="muted">Работает через Node.js API + PostgreSQL + Prisma.</p>
            <form class="auth-form" @submit.prevent="submitAuth">
              <label v-if="auth.mode === 'register'">
                Имя
                <input v-model="auth.name" type="text" required placeholder="Ваше имя" />
              </label>
              <label>
                Email
                <input v-model="auth.email" type="email" required placeholder="you@example.com" />
              </label>
              <label>
                Пароль
                <input v-model="auth.password" type="password" required minlength="6" placeholder="Минимум 6 символов" />
              </label>
              <button class="btn" type="submit" :disabled="auth.loading">
                {{ auth.loading ? 'Подождите...' : (auth.mode === 'register' ? 'Создать аккаунт' : 'Войти') }}
              </button>
              <p class="error" v-if="auth.error">{{ auth.error }}</p>
            </form>
            <button class="link-button" @click="auth.mode = auth.mode === 'register' ? 'login' : 'register'">
              {{ auth.mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
            </button>
          </article>

          <section id="account" v-else>
            <div class="account__header">
              <h1>Личный кабинет</h1>
              <div class="auth-actions">
                <span class="status-pill">{{ profile.status }}</span>
                <button class="btn btn--small" @click="logout">Выйти</button>
              </div>
            </div>

            <div class="account__grid">
              <article class="panel">
                <h3>Профиль</h3>
                <ul class="details-list">
                  <li><span>Имя</span><strong>{{ profile.name }}</strong></li>
                  <li><span>Email</span><strong>{{ profile.email }}</strong></li>
                  <li><span>Страна</span><strong>{{ profile.country }}</strong></li>
                  <li><span>Подключено устройств</span><strong>{{ profile.devices }}</strong></li>
                </ul>
              </article>

              <article class="panel">
                <h3>Купленные тарифы</h3>
                <ul class="stack-list">
                  <li v-for="tariff in purchasedPlans" :key="tariff.name" class="stack-item">
                    <div>
                      <strong>{{ tariff.name }}</strong>
                      <p>{{ tariff.period }}</p>
                      <small>{{ tariff.devices }}</small>
                    </div>
                    <span class="tag">{{ tariff.status }}</span>
                  </li>
                </ul>
              </article>

              <article class="panel panel--wide">
                <h3>История платежей</h3>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Способ оплаты</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="payment in paymentHistory" :key="payment.id">
                        <td>{{ payment.id }}</td>
                        <td>{{ payment.date }}</td>
                        <td>{{ payment.amount }}</td>
                        <td>{{ payment.method }}</td>
                        <td>
                          <span class="tag" :class="{ 'tag--warn': payment.status === 'Возврат' }">{{ payment.status }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <article class="panel panel--wide">
                <h3>Уведомления</h3>
                <ul class="stack-list">
                  <li v-for="note in notifications" :key="note.title" class="notice" :class="'notice--' + note.type">
                    <strong>{{ note.title }}</strong>
                    <p>{{ note.text }}</p>
                  </li>
                </ul>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  `
}).mount('#app');
