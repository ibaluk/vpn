const { createApp } = Vue;

createApp({
  data() {
    return {
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
  template: `
    <div class="page">
      <header class="hero">
        <nav class="nav">
          <div class="logo">SafeWave VPN</div>
          <button class="btn btn--small">Скачать приложение</button>
        </nav>

        <div class="hero__content">
          <h1>Свободный и безопасный интернет<br />на всех ваших устройствах</h1>
          <p>
            Защитите личные данные в публичном Wi‑Fi, обходите блокировки и
            сохраняйте конфиденциальность одним кликом.
          </p>
          <div class="hero__actions">
            <button class="btn">Попробовать бесплатно 7 дней</button>
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
