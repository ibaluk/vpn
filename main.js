const { createApp } = Vue;

const LANG_KEY = 'freecity_lang';

const messages = {
  ru: {
    heading: 'Лучший бесплатный ВПН',
    heroText: 'Стабильный VPN для стриминга, игр и безопасной работы в публичных сетях.',
    cta: 'Включить защиту',
    faq: 'FAQ',
    account: 'Личный кабинет',
    viewPlans: 'Смотреть тарифы',
    playStore: 'Скачать в Google Play',
    supportTg: 'Техподдержка в Telegram',
    feat1: 'Шифрование AES-256 и kill switch',
    feat2: 'Серверы в 45+ странах',
    feat3: 'Без логов и трекеров',
    feat4: 'Высокая скорость для стриминга и игр',
    aboutTitle: 'О FreeCity VPN',
    aboutFallback: 'FreeCity VPN — это быстрый и безопасный VPN-сервис для ежедневного использования: от стриминга до защиты в публичных Wi‑Fi сетях.',
    advantagesTitle: 'Почему выбирают наш бесплатный ВПН?',
    adv1: 'Бесплатный старт без сложной настройки',
    adv2: 'Стабильная скорость подключения',
    adv3: 'Прозрачная политика конфиденциальности',
    adv4: 'Поддержка в Telegram 24/7',
    plans: 'Тарифы',
    plansDesc: 'Прозрачные цены без скрытых комиссий и автоплатежей.',
    popular: 'Популярно',
    buyInCabinet: 'Купить в кабинете',
    fallbackDesc: 'Срок действия — {days} дней.',
    feedbackTitle: 'Обратная связь',
    feedbackDesc: 'Есть вопросы или предложения? Напишите нам.',
    name: 'Имя',
    email: 'Email',
    message: 'Сообщение',
    send: 'Отправить',
    sending: 'Отправка...',
    sentOk: 'Спасибо! Сообщение отправлено в поддержку.',
    sendErr: 'Не удалось отправить сообщение',
    serverUnavailable: 'Сервер недоступен. Попробуйте позже.',
    yearRights: 'Все права защищены.',
    support: 'Поддержка'
  },
  en: {
    heading: 'Best free VPN', heroText: 'Stable VPN for streaming, gaming and secure work on public networks.', cta: 'Enable protection', faq: 'FAQ', account: 'Account', viewPlans: 'View plans', playStore: 'Download on Google Play', supportTg: 'Telegram support', feat1: 'AES-256 encryption and kill switch', feat2: 'Servers in 45+ countries', feat3: 'No logs and trackers', feat4: 'High speed for streaming and gaming', aboutTitle: 'About FreeCity VPN', aboutFallback: 'FreeCity VPN is a fast and secure VPN service for everyday use.', advantagesTitle: 'Why choose our free VPN?', adv1: 'Free start with simple setup', adv2: 'Stable connection speed', adv3: 'Transparent privacy policy', adv4: '24/7 Telegram support', plans: 'Plans', plansDesc: 'Transparent pricing with no hidden fees.', popular: 'Popular', buyInCabinet: 'Buy in account', fallbackDesc: 'Duration — {days} days.', feedbackTitle: 'Feedback', feedbackDesc: 'Have questions or ideas? Write to us.', name: 'Name', email: 'Email', message: 'Message', send: 'Send', sending: 'Sending...', sentOk: 'Thanks! Message sent.', sendErr: 'Failed to send message', serverUnavailable: 'Server unavailable. Try later.', yearRights: 'All rights reserved.', support: 'Support'
  },
  de: {
    heading: 'Bestes kostenloses VPN', heroText: 'Stabiles VPN für Streaming, Gaming und sicheres Arbeiten in öffentlichen Netzwerken.', cta: 'Schutz aktivieren', faq: 'FAQ', account: 'Konto', viewPlans: 'Tarife ansehen', playStore: 'Bei Google Play herunterladen', supportTg: 'Telegram-Support', feat1: 'AES-256-Verschlüsselung und Kill Switch', feat2: 'Server in über 45 Ländern', feat3: 'Keine Logs und Tracker', feat4: 'Hohe Geschwindigkeit für Streaming und Gaming', aboutTitle: 'Über FreeCity VPN', aboutFallback: 'FreeCity VPN ist ein schneller und sicherer VPN-Dienst für den Alltag.', advantagesTitle: 'Warum unser kostenloses VPN?', adv1: 'Kostenloser Start mit einfacher Einrichtung', adv2: 'Stabile Verbindungsgeschwindigkeit', adv3: 'Transparente Datenschutzrichtlinie', adv4: '24/7 Telegram-Support', plans: 'Tarife', plansDesc: 'Transparente Preise ohne versteckte Gebühren.', popular: 'Beliebt', buyInCabinet: 'Im Konto kaufen', fallbackDesc: 'Laufzeit — {days} Tage.', feedbackTitle: 'Feedback', feedbackDesc: 'Fragen oder Vorschläge? Schreiben Sie uns.', name: 'Name', email: 'E-Mail', message: 'Nachricht', send: 'Senden', sending: 'Wird gesendet...', sentOk: 'Danke! Nachricht gesendet.', sendErr: 'Senden fehlgeschlagen', serverUnavailable: 'Server nicht verfügbar. Später versuchen.', yearRights: 'Alle Rechte vorbehalten.', support: 'Support'
  },
  zh: {
    heading: '最佳免费 VPN', heroText: '为流媒体、游戏和公共网络安全使用提供稳定 VPN。', cta: '开启保护', faq: '常见问题', account: '账户', viewPlans: '查看套餐', playStore: '在 Google Play 下载', supportTg: 'Telegram 客服', feat1: 'AES-256 加密与 Kill Switch', feat2: '45+ 国家服务器', feat3: '无日志无追踪', feat4: '流媒体和游戏高速连接', aboutTitle: '关于 FreeCity VPN', aboutFallback: 'FreeCity VPN 是适合日常使用的快速安全 VPN 服务。', advantagesTitle: '为什么选择我们的免费 VPN？', adv1: '免费开始，设置简单', adv2: '连接速度稳定', adv3: '透明隐私政策', adv4: 'Telegram 24/7 支持', plans: '套餐', plansDesc: '价格透明，无隐藏费用。', popular: '热门', buyInCabinet: '前往账户购买', fallbackDesc: '时长：{days} 天。', feedbackTitle: '反馈', feedbackDesc: '有问题或建议？欢迎联系我们。', name: '姓名', email: '邮箱', message: '留言', send: '发送', sending: '发送中...', sentOk: '感谢！消息已发送。', sendErr: '发送失败', serverUnavailable: '服务器不可用，请稍后重试。', yearRights: '版权所有。', support: '支持'
  }
};

createApp({
  data() {
    return {
      brand: { title: 'FreeCity' },
      lang: localStorage.getItem(LANG_KEY) || 'ru',
      plans: [],
      countries: [],
      cms: { about: { title: '', content: '' }, advantages: { title: '', content: '' } },
      feedback: { name: '', email: '', message: '', sending: false, success: '', error: '' }
    };
  },
  async mounted() {
    document.documentElement.lang = this.lang;
    await Promise.all([this.loadCmsBlock('about', 'about-freecity-vpn'), this.loadCmsBlock('advantages', 'why-choose-free-vpn'), this.loadCountries(), this.loadPlans()]);
  },
  computed: {
    tickerCountries() { return [...this.countries, ...this.countries]; },
    features() { return [this.t('feat1'), this.t('feat2'), this.t('feat3'), this.t('feat4')]; }
  },
  methods: {
    t(key, params = {}) {
      const text = (messages[this.lang] || messages.ru)[key] || messages.ru[key] || key;
      return Object.entries(params).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), text);
    },
    setLang() { localStorage.setItem(LANG_KEY, this.lang); document.documentElement.lang = this.lang; },
    formatMoney(amountCents, currency = 'RUB') { return new Intl.NumberFormat(this.lang === 'zh' ? 'zh-CN' : this.lang === 'de' ? 'de-DE' : this.lang === 'en' ? 'en-US' : 'ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amountCents / 100); },
    async loadCmsBlock(targetKey, slug) { try { const r = await fetch(`/api/cms/layout/${slug}`); if (r.ok) { const p = await r.json(); this.cms[targetKey] = { title: p.title, content: p.content }; } } catch (_e) {} },
    async loadCountries() { try { const r = await fetch('/api/public/countries'); if (!r.ok) return; const p = await r.json(); if (Array.isArray(p.countries)) this.countries = p.countries.slice(0,20);} catch(_e){} },
    async loadPlans() { try { const r = await fetch('/api/public/plans'); if(!r.ok) return; const p = await r.json(); this.plans = (p.plans||[]).map((plan, i)=>({ ...plan, priceLabel: this.formatMoney(plan.priceCents, plan.currency), descriptionLabel: plan.description || this.t('fallbackDesc', { days: plan.durationDays }), badge: i===1 ? this.t('popular') : '' })); } catch(_e){} },
    async submitFeedback() {
      this.feedback.success=''; this.feedback.error=''; this.feedback.sending=true;
      try { const r = await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:this.feedback.name,email:this.feedback.email,message:this.feedback.message})}); const p=await r.json(); if(!r.ok){this.feedback.error=p.error||this.t('sendErr');return;} this.feedback.success=this.t('sentOk'); this.feedback.name=''; this.feedback.email=''; this.feedback.message=''; }
      catch(_e){ this.feedback.error=this.t('serverUnavailable'); }
      finally { this.feedback.sending=false; }
    }
  },
  template: `
    <div class="page">
      <header class="hero">
        <nav class="nav">
          <div class="logo"><img class="logo__image" src="https://b.freecityvpn.com/images/logo_header_pc.svg?v=202602241650" alt="{{ brand.title }}" /></div>
          <div class="nav__actions">
            <select class="lang-select" v-model="lang" @change="setLang">
              <option value="ru">Русский</option><option value="en">English</option><option value="de">Deutsch</option><option value="zh">中文</option>
            </select>
            <a href="./faq.html" class="btn btn--small btn--ghost">{{ t('faq') }}</a>
            <a href="./account.html" class="btn btn--small">{{ t('account') }}</a>
          </div>
        </nav>
        <div class="hero__body"><div class="hero__content"><h1>{{ t('heading') }}</h1><p>{{ t('heroText') }}</p><div class="hero__actions"><button class="btn">{{ t('cta') }}</button><a href="#plans" class="link">{{ t('viewPlans') }}</a></div><div class="hero__store-actions"><a class="btn btn--playstore pulse" href="https://play.google.com/store/apps/details?id=com.freecity.vpn" target="_blank" rel="noopener noreferrer">{{ t('playStore') }}</a><a class="btn btn--support pulse-soft" href="https://t.me/freecity_support_bot" target="_blank" rel="noopener noreferrer">{{ t('supportTg') }}</a></div><ul class="features"><li v-for="feature in features" :key="feature">{{ feature }}</li></ul></div><div class="hero__visual" aria-hidden="true"><img src="./assets/hero-vpn-illustration.svg" alt="" /></div></div>
        <section class="countries-ticker"><div class="countries-ticker__track"><div class="countries-ticker__item" v-for="(country, index) in tickerCountries" :key="country.name + '-' + index"><span class="countries-ticker__flag">{{ country.flag }}</span><span>{{ country.name }}</span></div></div></section>
      </header>
      <main>
        <section class="cms"><h2>{{ cms.about.title || t('aboutTitle') }}</h2><div class="cms__content" v-if="cms.about.content" v-html="cms.about.content"></div><p class="cms__fallback" v-else>{{ t('aboutFallback') }}</p></section>
        <section class="cms"><h2>{{ cms.advantages.title || t('advantagesTitle') }}</h2><div class="cms__content" v-if="cms.advantages.content" v-html="cms.advantages.content"></div><ul class="features" v-else><li>{{ t('adv1') }}</li><li>{{ t('adv2') }}</li><li>{{ t('adv3') }}</li><li>{{ t('adv4') }}</li></ul></section>
        <section id="plans" class="plans"><h2>{{ t('plans') }}</h2><p>{{ t('plansDesc') }}</p><div class="plans__grid"><article class="plan" v-for="plan in plans" :key="plan.externalId"><span v-if="plan.badge" class="badge">{{ plan.badge }}</span><h3>{{ plan.name }}</h3><strong>{{ plan.priceLabel }}</strong><p>{{ plan.descriptionLabel }}</p><a class="btn btn--outline" href="./account.html">{{ t('buyInCabinet') }}</a></article></div></section>
        <section class="feedback"><h2>{{ t('feedbackTitle') }}</h2><p>{{ t('feedbackDesc') }}</p><form class="feedback-form" @submit.prevent="submitFeedback"><label>{{ t('name') }}<input type="text" v-model="feedback.name" required /></label><label>{{ t('email') }}<input type="email" v-model="feedback.email" required /></label><label>{{ t('message') }}<textarea v-model="feedback.message" required rows="4"></textarea></label><button class="btn" type="submit" :disabled="feedback.sending">{{ feedback.sending ? t('sending') : t('send') }}</button><p class="success" v-if="feedback.success">{{ feedback.success }}</p><p class="error" v-if="feedback.error">{{ feedback.error }}</p></form></section>
      </main>
      <footer class="site-footer"><div class="site-footer__inner"><img class="site-footer__logo" src="https://b.freecityvpn.com/images/logo_footer_pc.svg?v=202602241650" alt="FreeCity VPN" /><p>© {{ new Date().getFullYear() }} FreeCity VPN. {{ t('yearRights') }}</p><div class="site-footer__links"><a href="./faq.html" class="link">{{ t('faq') }}</a><a href="https://t.me/freecity_support_bot" class="link" target="_blank" rel="noopener noreferrer">{{ t('support') }}</a></div></div></footer>
    </div>
  `
}).mount('#app');
