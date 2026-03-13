const { createApp } = Vue;

createApp({
  data() {
    return {
      activeVariant: 'aurora',
      variants: {
        aurora: {
          label: 'Aurora Dark',
          title: 'SafeWave VPN',
          heading: 'Свободный и безопасный интернет на всех ваших устройствах',
          text: 'Защитите личные данные в публичном Wi‑Fi, обходите блокировки и сохраняйте конфиденциальность одним кликом.',
          cta: 'Попробовать бесплатно 7 дней'
        },
        glass: {
          label: 'Glass Light',
          title: 'SafeWave Cloud',
          heading: 'Лёгкий и прозрачный VPN-дизайн для современной аудитории',
          text: 'Минималистичный интерфейс в светлой палитре повышает доверие и отлично подходит для B2C-продуктов.',
          cta: 'Запустить бесплатный доступ'
        },
        neon: {
          label: 'Neon Cyber',
          title: 'SafeWave X',
          heading: 'Киберпанк-стиль для геймеров и tech-аудитории',
          text: 'Контрастные неоновые акценты подчёркивают скорость соединения и технологичность сервиса.',
          cta: 'Включить турбо-режим'
        }
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
        'Шифрование военного уровня AES-256',
        'Серверы в 45+ странах',
        'Без логов и трекеров',
        'Высокая скорость для стриминга и игр'
      ]
    };
  },
  computed: {
    currentVariant() {
      return this.variants[this.activeVariant];
    }
  },
  template: `
    <div class="page" :class="'variant--' + activeVariant">
      <header class="hero">
        <nav class="nav">
          <div class="logo">{{ currentVariant.title }}</div>
          <button class="btn btn--small">Скачать приложение</button>
        </nav>

        <section class="variant-switcher">
          <h2>3 альтернативных дизайна</h2>
          <div class="variant-switcher__controls">
            <button
              v-for="(variant, key) in variants"
              :key="key"
              class="variant-chip"
              :class="{ 'variant-chip--active': activeVariant === key }"
              @click="activeVariant = key"
            >
              {{ variant.label }}
            </button>
          </div>
        </section>

        <div class="hero__content">
          <h1>{{ currentVariant.heading }}</h1>
          <p>{{ currentVariant.text }}</p>
          <div class="hero__actions">
            <button class="btn">{{ currentVariant.cta }}</button>
            <a href="#plans" class="link">Смотреть тарифы</a>
          </div>
          <ul class="features">
            <li v-for="feature in features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
      </header>

      <main>
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
      </main>
    </div>
  `
}).mount('#app');
