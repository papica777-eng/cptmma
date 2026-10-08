# CPT MMA · Combat & Performance Training
### Официален уебсайт на Сотир Кичуков (Melbourne, Victoria)

Пълен, независим, олекотен и оптимизиран сорс код на **cptmma.com**, извлечен с 100% точност и освободен от агенционни абонаменти и месечни такси.

---

## ⚡ Оптимизации и подобрения

1. **0 лв. / 0$ месечни разходи (100% Free Forever):**
   - Премахнат е агенционният бекенд на Scalus (`concept.scalus.app/api/lead`), за който са искани скъпи месечни такси.
   - Премахнати са скритите тракери и пиксели (`sa.js`, `scalus.app/px/3f19468840b8b6ebaf.gif`), които бавеха сайта.
   - Формите за регистрация (`#heroForm`, `#applyForm`, `#canineForm`, `#intakeForm`) работят независимо чрез безплатната услуга **FormSubmit.co** (директно изпращане до имейла на Сотир `sotirkichukov@cptmma.com`) или алтернативно Web3Forms.
   - Добавен е директен **WhatsApp бутон** (`+61 423 269 586`), осигуряващ незабавна комуникация с клиенти в Мелбърн.

2. **Максимална скорост и супер леко зареждане:**
   - Всички снимки под видимата част на екрана (below-the-fold) използват нативно `loading="lazy"` и `decoding="async"`.
   - Видео клиповете се зареждат с `IntersectionObserver` само при поява на екрана, за да не хабят мобилни данни и батерия на телефона.
   - Автономен, лек компонент за потвърждение (`assets/success.js`) с анимирана зелена отметка при изпращане.

3. **Перфектен за мобилни телефони (Mobile First):**
   - Пълна поддръжка на тъч меню (Burger Drawer), лепкав бутон за записване (*Register Your Interest*), плавен скрол и адаптивни решетки за всички размери екрани (iPhone, Samsung Galaxy, таблети и десктоп).

4. **1-минутна конфигурация (`assets/config.js`):**
   - Можете лесно да промените имейла за запитвания, телефонния номер, WhatsApp линка или текста без да пипате сложен код.

---

## 📁 Структура на проекта

```
cptmma/
├── index.html                           # Главна страница (MMA, K1, Coach, Reviews, Record)
├── canine.html (canine/index.html)      # Canine Personal Training
├── intake.html (intake/index.html)      # Подробен Intake въпросник за спортисти
├── magnesium.html (magnesium/index.html)# Anchialo Magnesium страница
├── blog.html (blog/index.html)          # Блог журнал
├── blog/                                # 5 пълни статии от блога
│   ├── anatomy-of-a-complete-fighter.html
│   ├── pomorie-to-the-cage.html
│   ├── recovery-and-minerals.html
│   ├── start-mma-melbourne.html
│   └── the-cpt-method.html
├── assets/
│   ├── config.js                        # Конфигурация за имейл, телефон и WhatsApp
│   ├── sk.css                           # Основен стилов файл (Ultra-fast Vanilla CSS)
│   ├── sk.js                            # Интерактивни анимации и логика на сайта
│   ├── success.js                       # Нативно съобщение за успешно изпратена форма
│   ├── hero-fight.mp4                   # Hero видео клип
│   ├── fight/                           # 5 кратки оптимирани бойни видео клипа (.mp4 + .jpg)
│   └── img/                             # Всички оригинални снимки с висока резолюция и лога
├── manifest.json & manifest.webmanifest # PWA мобилен манифест (Install to Phone)
├── sitemap.xml & robots.txt             # SEO файлове за Google индексация
└── favicon.ico                          # Икона на сайта
```

---

## 🚀 Безплатен хостинг (0$ на месец за винаги)

Можете да качите този код за 2 минути на всяка от следните платформи без да плащате нито стотинка:

### Вариант 1: GitHub Pages (Препоръчително)
1. Направете ново репо в GitHub (напр. `cptmma` или `sotir-cptmma`).
2. Пушнете сорс кода:
   ```bash
   git add .
   git commit -m "Initial commit of CPT MMA website"
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. Отидете в GitHub -> **Settings** -> **Pages** -> Изберете клон `main` и запазете.
4. В секцията **Custom domain** напишете `cptmma.com`.

### Вариант 2: Cloudflare Pages
1. Свържете GitHub репозиторито към Cloudflare Pages.
2. Build command оставете празно, Build output directory задайте `/`.
3. Cloudflare предоставя най-бързия CDN в Австралия (сървъри в Melbourne и Sydney), безплатен SSL сертификат и защита.

### Вариант 3: Vercel (Hobby Tier - Безплатен)
1. Влезте във [vercel.com](https://vercel.com).
2. Натиснете **Add New Project** -> изберете вашето GitHub репо -> Deploy.
3. Добавете домейна `cptmma.com`.

---

## 🌐 Настройка на домейна cptmma.com

В контролния панел на домейна (Namecheap, GoDaddy, Cloudflare или където е регистриран):

**За GitHub Pages:**
- **A Records** за `@`:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME Record** за `www`: `<username>.github.io`

**За Cloudflare Pages:**
- CNAME за `cptmma.com` към `<project-name>.pages.dev`
