const { createApp } = Vue;
const LANG_KEY = 'freecity_lang';

const messages = {
  ru: { home:'На главную', rights:'Все права защищены.', main:'Главная', account:'Личный кабинет', q1:'Как подключить FreeCity VPN?', a1:'Скачайте приложение из Google Play, войдите в аккаунт и нажмите кнопку «Подключиться».', q2:'Есть ли бесплатный тариф?', a2:'Да, вы можете начать пользоваться базовым бесплатным доступом сразу после регистрации.', q3:'Куда обращаться в поддержку?', a3:'Напишите в Telegram-бот: @freecity_support_bot.' },
  en: { home:'Home', rights:'All rights reserved.', main:'Main', account:'Account', q1:'How do I connect FreeCity VPN?', a1:'Download the app from Google Play, sign in and tap Connect.', q2:'Is there a free plan?', a2:'Yes, you can start with basic free access right after registration.', q3:'How to contact support?', a3:'Message our Telegram bot: @freecity_support_bot.' },
  de: { home:'Zur Startseite', rights:'Alle Rechte vorbehalten.', main:'Startseite', account:'Konto', q1:'Wie verbinde ich FreeCity VPN?', a1:'Laden Sie die App aus Google Play herunter, melden Sie sich an und klicken Sie auf „Verbinden“.', q2:'Gibt es einen kostenlosen Tarif?', a2:'Ja, nach der Registrierung können Sie sofort den kostenlosen Basistarif nutzen.', q3:'Wie erreiche ich den Support?', a3:'Schreiben Sie an den Telegram-Bot: @freecity_support_bot.' },
  zh: { home:'返回首页', rights:'版权所有。', main:'首页', account:'账户', q1:'如何连接 FreeCity VPN？', a1:'从 Google Play 下载应用，登录后点击“连接”。', q2:'有免费套餐吗？', a2:'有，注册后即可使用基础免费服务。', q3:'如何联系支持？', a3:'请联系 Telegram 机器人：@freecity_support_bot。' }
};

createApp({
  data() { return { brand: 'FreeCity', lang: localStorage.getItem(LANG_KEY)||'ru', faq: { title:'', content:'' } }; },
  async mounted() {
    document.documentElement.lang = this.lang;
    try { const response = await fetch('/api/cms/layout/faq-page'); if (response.ok) { const payload = await response.json(); this.faq.title = payload.title; this.faq.content = payload.content; } } catch (_error) {}
  },
  methods: {
    t(key){ return (messages[this.lang]||messages.ru)[key]||messages.ru[key]||key; },
    setLang(){ localStorage.setItem(LANG_KEY,this.lang); document.documentElement.lang=this.lang; }
  },
  template: `
    <div class="page">
      <header class="hero hero--compact"><nav class="nav"><div class="logo"><img class="logo__image" src="https://b.freecityvpn.com/images/logo_header_pc.svg?v=202602241650" alt="{{ brand }}" /></div><div class="nav__actions"><select class="lang-select" v-model="lang" @change="setLang"><option value="ru">Русский</option><option value="en">English</option><option value="de">Deutsch</option><option value="zh">中文</option></select><a href="./index.html" class="btn btn--small">{{ t('home') }}</a></div></nav></header>
      <main class="faq"><section class="cms"><h1>{{ faq.title || 'FAQ' }}</h1><div class="cms__content" v-if="faq.content" v-html="faq.content"></div><div class="faq__fallback" v-else><article class="panel"><h3>{{ t('q1') }}</h3><p>{{ t('a1') }}</p></article><article class="panel"><h3>{{ t('q2') }}</h3><p>{{ t('a2') }}</p></article><article class="panel"><h3>{{ t('q3') }}</h3><p>{{ t('a3') }}</p></article></div></section></main>
      <footer class="site-footer"><div class="site-footer__inner"><img class="site-footer__logo" src="https://b.freecityvpn.com/images/logo_footer_pc.svg?v=202602241650" alt="FreeCity VPN" /><p>© {{ new Date().getFullYear() }} FreeCity VPN. {{ t('rights') }}</p><div class="site-footer__links"><a href="./index.html" class="link">{{ t('main') }}</a><a href="./account.html" class="link">{{ t('account') }}</a></div></div></footer>
    </div>
  `
}).mount('#app');
