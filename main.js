const { createApp } = Vue;

createApp({
  data() {
    return {
      brand: {
        title: 'FreeCity',
        heading: 'Киберпанк-защита для геймеров и tech-аудитории',
        text: 'Стабильный VPN для стриминга, игр и безопасной работы в публичных сетях.',
        cta: 'Включить защиту'
      },
      plans: [
        {
          title: '1 месяц',
          price: '299₽',
          description: 'Идеально для знакомства с сервисом.',
          badge: ''
        },
        {
          title: '12 месяцев',
          price: '249₽ / мес',
          description: 'Лучший выбор для постоянной защиты.',
          badge: 'Популярно'
        },
        {
          title: 'Для команды',
          price: 'от 990₽',
          description: 'До 10 устройств и централизованное управление.',
          badge: ''
        }
      ],
      features: [
        'Шифрование AES-256 и kill switch',
        'Серверы в 45+ странах',
        'Без логов и трекеров',
        'Высокая скорость для стриминга и игр'
      ],
      cms: {
        about: { title: '', content: '' },
        advantages: { title: '', content: '' }
      },
      feedback: {
        name: '',
        email: '',
        message: '',
        sending: false,
        success: '',
        error: ''
      }
    };
  },
  async mounted() {
    await Promise.all([this.loadCmsBlock('about', 'about-freecity-vpn'), this.loadCmsBlock('advantages', 'why-choose-free-vpn')]);
  },
  methods: {
    async loadCmsBlock(targetKey, slug) {
      try {
        const response = await fetch(`/api/cms/layout/${slug}`);
        if (response.ok) {
          const payload = await response.json();
          this.cms[targetKey].title = payload.title;
          this.cms[targetKey].content = payload.content;
        }
      } catch (_error) {
        // fallback content is rendered when CMS is unavailable
      }
    },
    async submitFeedback() {
      this.feedback.success = '';
      this.feedback.error = '';
      this.feedback.sending = true;

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.feedback.name,
            email: this.feedback.email,
            message: this.feedback.message
          })
        });

        const payload = await response.json();
        if (!response.ok) {
          this.feedback.error = payload.error || 'Не удалось отправить сообщение';
          return;
        }

        this.feedback.success = 'Спасибо! Сообщение отправлено в поддержку.';
        this.feedback.name = '';
        this.feedback.email = '';
        this.feedback.message = '';
      } catch (_error) {
        this.feedback.error = 'Сервер недоступен. Попробуйте позже.';
      } finally {
        this.feedback.sending = false;
      }
    }
  },
  template: `
    <div class="page">
      <header class="hero">
        <nav class="nav">
          <div class="logo">{{ brand.title }}</div>
          <div class="nav__actions">
            <a href="./faq.html" class="btn btn--small btn--ghost">FAQ</a>
            <a href="./account.html" class="btn btn--small">Личный кабинет</a>
          </div>
        </nav>

        <div class="hero__content">
          <h1>{{ brand.heading }}</h1>
          <p>{{ brand.text }}</p>
          <div class="hero__actions">
            <button class="btn">{{ brand.cta }}</button>
            <a href="#plans" class="link">Смотреть тарифы</a>
          </div>
          <div class="hero__store-actions">
            <a class="btn btn--playstore pulse" href="https://play.google.com/store/apps/details?id=com.freecity.vpn" target="_blank" rel="noopener noreferrer">
              Скачать в Google Play
            </a>
            <a class="btn btn--support pulse-soft" href="https://t.me/freecity_support_bot" target="_blank" rel="noopener noreferrer">
              Техподдержка в Telegram
            </a>
          </div>
          <ul class="features">
            <li v-for="feature in features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
      </header>

      <main>
        <section class="cms">
          <h2>{{ cms.about.title || 'О FreeCity VPN' }}</h2>
          <div class="cms__content" v-if="cms.about.content" v-html="cms.about.content"></div>
          <p class="cms__fallback" v-else>
            FreeCity VPN — это быстрый и безопасный VPN-сервис для ежедневного использования: от стриминга до защиты в публичных Wi‑Fi сетях.
          </p>
        </section>

        <section class="cms">
          <h2>{{ cms.advantages.title || 'Почему выбирают наш бесплатный ВПН?' }}</h2>
          <div class="cms__content" v-if="cms.advantages.content" v-html="cms.advantages.content"></div>
          <ul class="features" v-else>
            <li>Бесплатный старт без сложной настройки</li>
            <li>Стабильная скорость подключения</li>
            <li>Прозрачная политика конфиденциальности</li>
            <li>Поддержка в Telegram 24/7</li>
          </ul>
        </section>

        <section id="plans" class="plans">
          <h2>Тарифы</h2>
          <p>Прозрачные цены без скрытых комиссий и автоплатежей.</p>
          <div class="plans__grid">
            <article class="plan" v-for="plan in plans" :key="plan.title">
              <span v-if="plan.badge" class="badge">{{ plan.badge }}</span>
              <h3>{{ plan.title }}</h3>
              <strong>{{ plan.price }}</strong>
              <p>{{ plan.description }}</p>
              <button class="btn btn--outline">Выбрать</button>
            </article>
          </div>
        </section>

        <section class="feedback">
          <h2>Обратная связь</h2>
          <p>Есть вопросы или предложения? Напишите нам.</p>
          <form class="feedback-form" @submit.prevent="submitFeedback">
            <label>
              Имя
              <input type="text" v-model="feedback.name" required placeholder="Ваше имя" />
            </label>
            <label>
              Email
              <input type="email" v-model="feedback.email" required placeholder="you@example.com" />
            </label>
            <label>
              Сообщение
              <textarea v-model="feedback.message" required rows="4" placeholder="Опишите ваш вопрос"></textarea>
            </label>
            <button class="btn" type="submit" :disabled="feedback.sending">
              {{ feedback.sending ? 'Отправка...' : 'Отправить' }}
            </button>
            <p class="success" v-if="feedback.success">{{ feedback.success }}</p>
            <p class="error" v-if="feedback.error">{{ feedback.error }}</p>
          </form>
        </section>
      </main>
    </div>
  `
}).mount('#app');
