const { createApp } = Vue;

createApp({
  data() {
    return {
      brand: {
        title: 'Freecity',
        heading: 'Киберпанк-стиль для геймеров и tech-аудитории',
        text: 'Контрастные неоновые акценты подчёркивают скорость соединения и технологичность сервиса.',
        cta: 'Включить турбо-режим'
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
      ],
      profile: {
        name: 'Алексей Волков',
        email: 'alex.volkov@freecity.app',
        country: 'Россия',
        devices: 4,
        status: 'Premium'
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
  template: `
    <div class="page variant--neon">
      <header class="hero">
        <nav class="nav">
          <div class="logo">{{ brand.title }}</div>
          <a href="#account" class="btn btn--small">Личный кабинет</a>
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

        <section id="account" class="account">
          <div class="account__header">
            <h2>Личный кабинет</h2>
            <span class="status-pill">{{ profile.status }}</span>
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
      </main>
    </div>
  `
}).mount('#app');
