const { createApp } = Vue;

createApp({
  data() {
    return {
      brand: {
        title: 'FreeCity',
        heading: 'Лучший бесплатный ВПН',
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
      countries: [
        { name: 'США', flag: '🇺🇸' },
        { name: 'Канада', flag: '🇨🇦' },
        { name: 'Бразилия', flag: '🇧🇷' },
        { name: 'Мексика', flag: '🇲🇽' },
        { name: 'Великобритания', flag: '🇬🇧' },
        { name: 'Германия', flag: '🇩🇪' },
        { name: 'Франция', flag: '🇫🇷' },
        { name: 'Испания', flag: '🇪🇸' },
        { name: 'Италия', flag: '🇮🇹' },
        { name: 'Нидерланды', flag: '🇳🇱' },
        { name: 'Швеция', flag: '🇸🇪' },
        { name: 'Норвегия', flag: '🇳🇴' },
        { name: 'Швейцария', flag: '🇨🇭' },
        { name: 'Турция', flag: '🇹🇷' },
        { name: 'ОАЭ', flag: '🇦🇪' },
        { name: 'Индия', flag: '🇮🇳' },
        { name: 'Япония', flag: '🇯🇵' },
        { name: 'Южная Корея', flag: '🇰🇷' },
        { name: 'Сингапур', flag: '🇸🇬' },
        { name: 'Австралия', flag: '🇦🇺' }
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
    await Promise.all([
      this.loadCmsBlock('about', 'about-freecity-vpn'),
      this.loadCmsBlock('advantages', 'why-choose-free-vpn'),
      this.loadCountries()
    ]);
  },
  computed: {
    tickerCountries() {
      return [...this.countries, ...this.countries];
    }
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
    async loadCountries() {
      try {
        const response = await fetch('/api/public/countries');
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (Array.isArray(payload.countries) && payload.countries.length > 0) {
          this.countries = payload.countries.slice(0, 20);
        }
      } catch (_error) {
        // fallback list is used when API is unavailable
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
          <div class="logo"><img class="logo__image" src="https://b.freecityvpn.com/images/logo_header_pc.svg?v=202602241650" alt="{{ brand.title }}" /></div>
          <div class="nav__actions">
            <a href="./faq.html" class="btn btn--small btn--ghost">FAQ</a>
            <a href="./account.html" class="btn btn--small">Личный кабинет</a>
          </div>
        </nav>

        <div class="hero__body">
          <div class="hero__content">
            <h1>{{ brand.heading }}</h1>
            <p>{{ brand.text }}</p>
            <div class="hero__actions">
              <button class="btn">{{ brand.cta }}</button>
              <a href="#plans" class="link">Смотреть тарифы</a>
            </div>
            <div class="hero__store-actions">
              <a class="btn btn--playstore pulse" href="https://play.google.com/store/apps/details?id=com.freecity.vpn" target="_blank" rel="noopener noreferrer">
                <img class="btn__icon" src="https://cdn.simpleicons.org/googleplay/FFFFFF" alt="" aria-hidden="true" />
                Скачать в Google Play
              </a>
              <a class="btn btn--support pulse-soft" href="https://t.me/freecity_support_bot" target="_blank" rel="noopener noreferrer">
                <img class="btn__icon" src="https://cdn.simpleicons.org/telegram/FFFFFF" alt="" aria-hidden="true" />
                Техподдержка в Telegram
              </a>
            </div>
            <ul class="features">
              <li v-for="feature in features" :key="feature">{{ feature }}</li>
            </ul>
          </div>

          <div class="hero__visual" aria-hidden="true">
            <img src="./assets/hero-vpn-illustration.svg" alt="" />
          </div>
        </div>
        <section class="countries-ticker" aria-label="Страны доступных подключений">
          <div class="countries-ticker__track">
            <div class="countries-ticker__item" v-for="(country, index) in tickerCountries" :key="country.name + '-' + index">
              <span class="countries-ticker__flag">{{ country.flag }}</span>
              <span>{{ country.name }}</span>
            </div>
          </div>
        </section>
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

      <footer class="site-footer">
        <div class="site-footer__inner">
          <img class="site-footer__logo" src="https://b.freecityvpn.com/images/logo_footer_pc.svg?v=202602241650" alt="FreeCity VPN" />
          <p>© {{ new Date().getFullYear() }} FreeCity VPN. Все права защищены.</p>
          <div class="site-footer__links">
            <a href="./faq.html" class="link">FAQ</a>
            <a href="https://t.me/freecity_support_bot" class="link" target="_blank" rel="noopener noreferrer">Поддержка</a>
          </div>
        </div>
      </footer>
    </div>
  `
}).mount('#app');
