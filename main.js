const { createApp } = Vue;

createApp({
  data() {
    return {
      brand: {
        title: 'Freecity',
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
      ]
    };
  },
  template: `
    <div class="page">
      <header class="hero">
        <nav class="nav">
          <div class="logo">{{ brand.title }}</div>
          <a href="./account.html" class="btn btn--small">Личный кабинет</a>
        </nav>

        <div class="hero__content">
          <h1>{{ brand.heading }}</h1>
          <p>{{ brand.text }}</p>
          <div class="hero__actions">
            <button class="btn">{{ brand.cta }}</button>
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
