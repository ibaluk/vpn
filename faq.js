const { createApp } = Vue;

createApp({
  data() {
    return {
      brand: 'FreeCity',
      faq: {
        title: '',
        content: ''
      }
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/cms/layout/faq-page');
      if (response.ok) {
        const payload = await response.json();
        this.faq.title = payload.title;
        this.faq.content = payload.content;
      }
    } catch (_error) {
      // CMS might be unavailable
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

      <main class="faq">
        <section class="cms">
          <h1>{{ faq.title || 'FAQ' }}</h1>
          <div class="cms__content" v-if="faq.content" v-html="faq.content"></div>
          <div class="faq__fallback" v-else>
            <article class="panel">
              <h3>Как подключить FreeCity VPN?</h3>
              <p>Скачайте приложение из Google Play, войдите в аккаунт и нажмите кнопку «Подключиться».</p>
            </article>
            <article class="panel">
              <h3>Есть ли бесплатный тариф?</h3>
              <p>Да, вы можете начать пользоваться базовым бесплатным доступом сразу после регистрации.</p>
            </article>
            <article class="panel">
              <h3>Куда обращаться в поддержку?</h3>
              <p>Напишите в Telegram-бот: @freecity_support_bot.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  `
}).mount('#app');
