const loc = {
  ru: {
    App: {
      login: 'Вход',
      logoutHint: 'Выйти',
      newJobHint: 'Создать вакансию',
      logoTooltip: 'Главная',
      myProfile: 'Мой кабинет',
      fbBtnLabel: 'Написать нам',
      jcats: [
        {label: "Не имеет значения", value: 0}, 
        {label: "Администрация", value: 1},
        {label: "Безопасность", value: 14},
        {label: "Инженер", value: 4},
        {label: "Информационные технологии", value: 12},
        {label: "Логистика", value: 10},
        {label: "Медицина", value: 13},
        {label: "Недвижимость", value: 9},
        {label: "Нефть и газ", value: 3},
        {label: "Образование", value: 5},
        {label: "Продажи", value: 6},
        {label: "Производство", value: 7},
        {label: "Строительство", value: 8},
        {label: "Туризм, гостиницы, рестораны", value: 11},
        {label: "Юристы", value: 2},
      ],
      expOpts: [
        {label: "Не имеет значения", value: -1},
        {label: "Без опыта", value: 0},
        {label: "от 1 до 3 лет", value: 2}, 
        {label: "от 3 до 5 лет", value: 4},
        {label: "от 5 лет", value: 6}
      ],
      jtypeOptions: [
        {label: "Постоянная", value: 'c'},
        {label: "Временная", value: 'v'}
      ],
      curOpts: [
        {label: 'манат', value: 'm'},      
        {label: '$', value: '$'},
      ],
      cityList: ["Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"],
      firstCVNote: 'Сначала загрузите резюме!',
      onlyRegisteredCV: 'Подавать резюме могут <span style="color: red">зарегистрированные</span> пользователи',
    },
    filters: {
      searchHint: 'Поиск по полям название, автор, город, основной текст',
      searchValSym: 'некорректная строка поиска',
      searchBtn: 'Поиск',
      city: 'Город',
      sal: 'Зарплата',
      curr: 'Валюта',
      currDefault: [
        {label: "все", value: 'idc'},
        {label: "$", value: '$'},
        {label: "манат", value: 'm'},],
      exp: 'Опыт',
      jcat: 'Профессия',
      applyBtn: 'Применить',
      expFilters: [
        {label: "Не имеет значения", value: 'idc'}, 
        {label: "Без опыта", value: '0'},
        {label: "от 1 до 3 лет", value: '1-3'}, 
        {label: "от 3 до 5 лет", value: '3-5'},
        {label: "от 5 лет", value: '5'}
      ],
      salFilters: [
        {label: "Не имеет значения", value: 'idc'}, 
        {label: "от 0 до 1000", value: '0-1'}, 
        {label: "от 1000 до 3000", value: '1-3'}, 
        {label: "от 3000", value: '3'},
      ],
      cities: ["Не имеет значения", "Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"],
    },
    jobs: {
      sortOpts: [
        {label: 'По дате ↓', value: 'new'},
        {label: 'По зп ↓', value: 'saldesc'},
        {label: 'По зп ↑', value: 'salasc'}
      ],
      dateOpts: [
        {label: 'За месяц', value: 'mon'},
        {label: 'За неделю', value: 'wee'},
        {label: 'За сутки', value: 'day'}
      ],
      perpageOpts: [
        {label: '25 на стр', value: '25'},
        {label: '50 на стр', value: '50'},
        {label: '100 на стр', value: '100'}
      ]
    },
    reg: {
      loginLabel: 'Вход',
      regLabel: 'Регистрация',
      loginEmailLabel: 'Email',
      loginPWLabel: 'Пароль',
      rmeLabel: 'Запомнить меня',
      frgtPWLabel: 'Забыл пароль?',
      enterBtn: 'Войти',
      radioSub: 'Специалист',
      radioCom: 'Компания',
      companyLabel: 'Компания',
      agencyLabel: 'Кадровое агенство',
      nameLabel: 'Имя',
      surnameLabel: 'Фамилия',
      regConfirmPWLabel: 'Повтор пароля',
      rulesStart: 'Я соглашаюсь с',
      rulesLink: 'правилами использования сервиса',
      rulesEnd: ', а также с передачей и обработкой моих данных в TEST.com. Я подтверждаю своё совершеннолетие и ответственность за размещение объявления.',
      regBtn: 'Регистрация',
      alreadyAuthedMessage: 'Авторизован',
      loginValiMail0: 'Введите email',
      loginValiMailFormat: 'Неправильный формат адреса',
      loginValiPW0: 'Введите пароль',
      loginValiPWFormat: 'Кол-во символов от 5 до 25',
      loginSuccess: 'Вход осуществлен',
      loginError1: 'Не существующий Email или не правильный пароль',
      loginError2: 'Такого пользователя не существует, либо неверный пароль',
      loginError3: 'Не удалось выполнить вход',
      regValiRules: 'Ознакомтесь с правилами',
      regValiPWC0: 'Подтвердите пароль',
      regValiPWCDiff: 'Пароли не совпадают',
      regValiPWChar: 'Минимум 1 английская буква',
      regValiPWMax: 'Максимум 25 символов',
      regValiPWMin: 'Минимум 6 символов',
      regValiPW0: 'Введите пароль',
      compValiFormat: 'Неправильный формат названия',
      compValiMax: 'Максимальная длина 60 символов',
      compValiMin: 'Минимальная длина 3 символа',
      compVali0: 'Введите название',
      surnameValiFormat: 'Неправильный формат фамилии',
      surnameValiMax: 'Максимальная длина 35 символов',
      surnameValiMin: 'Минимальная длина 3 символа',
      surnameVali0: 'Введите фамилию',
      nameValiFormat: 'Неправильный формат имени',
      nameValiMax: 'Максимальная длина 35 символов',
      nameValiMin: 'Минимальная длина 3 символа',
      nameVali0: 'Введите имя',
      regSuccess: 'Регистрация удалась',
      regAllFields: 'Заполните все поля',
      regError1: 'Email или пароль не зарегестрированы',
      regError2: 'Такой email уже существует в базе данных',
      regError3: 'Регистрация не удалась, ошибки на сервере',
    },
    addJob: {
      pTypeNewLabel: 'Создать новую вакансию',
      pTypeEditLabel: 'Редактирование вакансии',
      titleLabel: 'Название вакансии',
      xlsBtn: 'Публикация вакансий XLS',
      titleValidationRequired: '* Обязательное поле',
      titleValidationMin: 'Минимум 2 символа',
      titleValidationMax: 'Максимум 75 символов',
      titleValidationSymbols: 'Используются запрещенные символы',
      salaryLabel: 'Зарплата',
      salaryMinPH: 'От',
      salaryValidationRange: 'От 0 до 99999',
      salaryMaxPH: 'До',
      salaryValidationEnter: 'Укажите зп',
      manat: 'манат',
      dollars: '$',
      salaryCB1Hint: 'По итогам собеседования',
      contactsLabel: 'Ваши контакты',
      emailPH: 'Email',
      emailValidationLength: 'Максимум 40 символов',
      emailValidationFormat: 'Неправильный формат',
      emailValidationEnter: 'Укажите Email или Телефон',
      telPH: 'Телефон',
      telValidationLengthMax: 'Максимум 15 символов',
      telValidationLengthMin: 'Минимум 5 символов',
      telValidationFormat: 'Неправильный формат',
      jcatLabel: 'Профессия',
      cityLabel: 'Город',
      cityValidationLength: 'Максимум 70 символов',
      cityValidationFormat: 'Только буквы',
      descLabel: 'Описание',
      descValidation2000: '(2000 символов максимум)',
      moreLabel: 'Дополнительно',
      expLabel: 'Опыт',
      jobTypeLabel: 'Тип занятости',
      ageLabel: 'Возраст',
      genericFrom: 'От',
      genericTo: 'До',
      genericEnterNumber: 'Введите число',
      genericFrom18: 'От 18',
      genericTooMuch: 'Слишком много',
      labelSchedule: 'График работы',
      genericWholeNumber:'Целое число',
      genericPositiveNumber: 'Положительное',
      generic24Max: '24 макс',
      schedulePH: 'Режим',
      scheduleValidationLengthMax: 'Максимум 10 символов',
      scheduleValidationFormat: 'Неправильный формат',
      eduLabel: 'Образование',
      eduValidationLengthMax: '20 символов макс',
      eduValidationFormat: 'Только буквы',
      eduTooltip: 'Например: высшее, среднее, высшее/среднее и т.д',
      langsLabel: 'Языки',
      sendJobBtnLabelNew: 'Разместить вакансию',
      sendJobBtnLabelUpdate: 'Отправить изменения',
      sendJobSuccess1: 'Вакансия ',
      sendJobSuccess2: ' успешно добавлена',
      sendJobSuccess1x: 'Вакансия ',
      sendJobSuccess2x: ' успешно изменена',
      btnAddOneMore: 'Добавить еще одну',
      sendJobError1: 'Ошибка на сервере, вакансия не добавлена',
      unauthorized: 'Авторизируйтесь, для возможности загрузки вакансий',
      cityOptions: ["Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"],
      langOptions: ["Туркменский", "Русский", "Английский", "Китайский", "Немецкий", "Французкий"],
      scheduleList: ["5/2", "6/1", "2/2", "3/2", "3/1", "15/15"],
      currDefault: {label: 'манат', value: 'm'},
    },
    companyPage: {
      categoriesHeader: 'Сферы деятельности компании',
      descHeader: 'Описание',
      publishedJobsCountLabel: 'Размещено вакансий: ',
      registrationDate: 'Зарегистрирована: ',
    },
    entProfile: {
      navPublishedLabel: 'Вакансии',
      navResponsesLabel: 'Отклики',
      navAboutLabel: 'О компании',
      navSettingsLabel: 'Настройки',
      publishedHeader: 'Опубликованные вакансии',
    },
  },
  tm: {
    App: {
      login: 'Вход',
      logoutHint: 'Выйти',
      newJobHint: 'Создать новую вакансию'
    },
    home: {
      searchHint: 'Поиск по полям название, автор, город, основной текст',
      searchValSym: 'некорректная строка поиска',
      searchBtn: 'Поиск',
      city: 'Город',
      sal: 'Зарплата',
      curr: 'Валюта',
      currDefault: [
        {label: "все", value: 'idc'},
        {label: "$", value: '$'},
        {label: "манат", value: 'm'},],
      exp: 'Опыт',
      //jtyp: 'Занятость',
      jcat: 'Профессия',
      applyBtn: 'Применить'
    },
    companyPage: {
      categoriesHeader: 'Сферы деятельности компании',
      descHeader: 'Описание',
      publishedJobsCountLabel: 'Размещено вакансий: ',
      registrationDate: 'Зарегистрирована: ',
    },
    entProfile: {
      navPublishedLabel: 'Вакансии',
      navResponsesLabel: 'Отклики',
      navAboutLabel: 'О компании',
      navSettingsLabel: 'Настройки',
      publishedHeader: 'Опубликованные вакансии',
    },
    reg: {
      loginLabel: 'Giriş',
      regLabel: 'Registrasiýa',
      loginEmailLabel: 'Email',
      loginPWLabel: 'Parol',
      rmeLabel: 'Ýatda sakla',
      frgtPWLabel: 'Parol ýatdan çykdymy?',
      enterBtn: 'Giriş',
      radioSub: 'Işgär',
      radioCom: 'Edara',
      companyLabel: 'Edara',
      agencyLabel: 'Kadr agentligi',
      nameLabel: 'Ady',
      surnameLabel: 'Familiýasy',
      regConfirmPWLabel: 'Paroli gaýtala',
      rulesStart: 'Men razy',
      rulesLink: 'serwisyň ulanyş düzgünleri bilen',
      rulesEnd: ', hem-de öz maglumatlarymy TEST.com saýtyna ugratmaga we ulanmaga razylygymy berýärin. Men kämillik ýaşyma ýetendigimi subut edýärin we saýtda ýerleşdirjek bildirişlerim üçin jogap kärçilik çekýärin.',
      regBtn: 'Registrasiýa',
      alreadyAuthedMessage: 'Awtorizasiýa boldy',
      loginValiMail0: 'Email ýazyň',
      loginValiMailFormat: 'Adres ýalňyş formatda',
      loginValiPW0: 'Paroly ýazyň',
      loginValiPWFormat: 'Nyşanlaryň sany 5-den 25-e çenli',
      loginSuccess: 'Giriş üstünlikli geçdi',
      loginError1: 'Email ýalňyş ýa-da parol',
      loginError2: 'Olar ýaly ulanyjy ýok, ýa-da ýalňyş parol',
      loginError3: 'Giriş amala aşyrylmady',
      regValiRules: 'Düzgünler (şertler) bilen tanyşyň',
      regValiPWC0: 'Parolyňyzy gaýtalaň',
      regValiPWCDiff: 'Parollar gabat gelenok',
      regValiPWChar: 'Azyndan 1 iňlis harp',
      regValiPWMax: 'Iň käni 25 nyşan',
      regValiPWMin: 'Azyndan 6 nyşan',
      regValiPW0: 'Paroly ýazyň',
      compValiFormat: 'Adyň ýalňyş formady',
      compValiMax: 'Iň käni 60 nyşan',
      compValiMin: 'Azyndan 3 nyşan',
      compVali0: 'Ady ýazyň',
      surnameValiFormat: 'Familiýanyň ýalňyş formady',
      surnameValiMax: 'Iň käni 35 nyşan',
      surnameValiMin: 'Azyndan 3 nyşan',
      surnameVali0: 'Familiýany ýazyň',
      nameValiFormat: 'Adyň ýalňyş formady',
      nameValiMax: 'Iň käni 35 nyşan',
      nameValiMin: 'Azyndan 3 nyşan',
      nameVali0: 'Ady ýazyň',
      regSuccess: 'Registrasiýa üstünlikli geçdi',
      regAllFields: 'Hemme ýerleri doldyryň',
      regError1: 'Email ýa-da parol registrasiýa bolmadyk',
      regError2: 'Bu email öň registrasiýa edilen',
      regError3: 'Registrasiýa üstünlikli bolmady, serwerde ýalňyşlyk',
    },
    addJob: {
      pTypeNewLabel: 'Täze wezipe döretmek',
      pTypeEditLabel: 'Wezipäni üýtgetmek',
      titleLabel: 'Wezipäniň ady',
      xlsBtn: 'Birnäçe wezipäni birden goşmak',
      titleValidationRequired: '* Hökmany ýer',
      titleValidationMin: 'Azydan 2 nyşan',
      titleValidationMax: 'Iň käni 75 nyşan',
      titleValidationSymbols: 'Gadagan nyşanlar ulanylýar',
      salaryLabel: 'Aýlyk',
      salaryMinPH: 'den',
      salaryValidationRange: '0 dan 99999 çenli',
      salaryMaxPH: 'çenli',
      salaryValidationEnter: 'Aýlygy görkeziň',
      manat: 'manat',
      dollars: '$',
      salaryCB1Hint: 'Söhbetdeşlik esasynda',
      contactsLabel: 'Siziň kontaktlaryňyz',
      emailPH: 'Email',
      emailValidationLength: 'Iň käni 75 nyşan',
      emailValidationFormat: 'Ýalňyş format',
      emailValidationEnter: 'Email-ňyzy görkeziň ýa-da telefonyňyzy',
      telPH: 'Telefon',
      telValidationLengthMax: 'Iň käni 15 nyşan',
      telValidationLengthMin: 'Azydan 5 nyşan',
      telValidationFormat: 'Ýalňyş format',
      jcatLabel: 'Hünär',
      cityLabel: 'Şäher',
      cityValidationLength: 'Iň käni 70 nyşan',
      cityValidationFormat: 'Diňe harplar',
      descLabel: 'Düşündiriş',
      descValidation2000: '(Iň käni 2000 nyşan)',
      moreLabel: 'Goşmaça',
      expLabel: 'Tejribe',
      jobTypeLabel: 'Işliligiň görnüşi',
      ageLabel: 'Ýaşy',
      genericFrom: 'den',
      genericTo: 'çenli',
      genericEnterNumber: 'San ýazyň',
      genericFrom18: '18 den',
      genericTooMuch: 'Gaty kän',
      labelSchedule: 'Işiň grafigi',
      genericWholeNumber:'Bitin san',
      genericPositiveNumber: 'Oňaýly',
      generic24Max: '24 maks',
      schedulePH: 'Režim',
      scheduleValidationLengthMax: 'Iň käni 10 nyşan',
      scheduleValidationFormat: 'Ýalňyş format',
      eduLabel: 'Bilimi',
      eduValidationLengthMax: 'Iň käni 20 nyşan',
      eduValidationFormat: 'Diňe harplar',
      eduTooltip: 'Mysal üçin: ýokary, orta we ş.m.',
      langsLabel: 'Diller',
      sendJobBtnLabelNew: 'Wezipäni goşmak',
      sendJobBtnLabelUpdate: 'Üýtgetmeleri ugratmak',
      sendJobSuccess1: 'Wezipe ',
      sendJobSuccess2: ' goşuldy',
      sendJobSuccess1x: 'Wezipe ',
      sendJobSuccess2x: ' üýtgedildi',
      btnAddOneMore: 'Ýene birini goşmak',
      sendJobError1: 'Serwerda ýalňyşlyk, wezipe goşulmady',
      unauthorized: 'Wezipäni goşmak üçin saýta giriň',
      cityOptions: ["Aşgabat", "Daşoguz", "Mary", "Türkmenabat", "Türkmenbaşy"],
      jcats: [{label: "Tapawudy ýok", value: 0}, 
        {label: "Administrasiýa", value: 1},
        {label: "Ýuristler", value: 2},
        {label: "Nebit we gaz", value: 3},
        {label: "Inžener", value: 4},
        {label: "Bilim", value: 5},
        {label: "Söwda", value: 6},
        {label: "Önümçilik", value: 7},
        {label: "Gurluşyk", value: 8},
        {label: "Gozgalmaýan emläk", value: 9},
        {label: "Logistika", value: 10},
        {label: "Turizm, myhmanhanalar, restoranlar", value: 11},
        {label: "Informasion tehnologiýalar", value: 12},
        {label: "Saglyk", value: 13},
        {label: "Howpsuzlyk", value: 14}
      ],
      expOpts: [
        {label: "Tapawudy ýok", value: -1},
        {label: "Tejribe hökman däl", value: 0},
        {label: "1 den 3 ýyla", value: 2}, 
        {label: "3 den 5 ýyla", value: 4},
        {label: "5 ýyldan köp", value: 6}
      ],
      jtypeOptions: [
        {label: "Hemişelik", value: 'c'},
        {label: "Wagtlaýyn", value: 'v'}
      ],
      langOptions: ["Türkmen dili", "Rus dili", "Iňlis dili", "Hytaý dili", "Nemes dili", "Fransuz dili"],
      cityList: ["Aşgabat", "Daşoguz", "Mary", "Türkmenabat", "Türkmenbaşy"],
      scheduleList: ["5/2", "6/1", "2/2", "3/2", "3/1", "15/15"],
      currDefault: {label: 'manat', value: 'm'},
    }
  },
  en: {
    App: {
      login: 'Вход',
      logoutHint: 'Выйти',
      newJobHint: 'Создать новую вакансию'
    },
    home: {
      searchHint: 'Поиск по полям название, автор, город, основной текст',
      searchValSym: 'некорректная строка поиска',
      searchBtn: 'Поиск',
      city: 'Город',
      sal: 'Зарплата',
      curr: 'Валюта',
      currDefault: [
        {label: "все", value: 'idc'},
        {label: "$", value: '$'},
        {label: "манат", value: 'm'},],
      exp: 'Опыт',
      //jtyp: 'Занятость',
      jcat: 'Профессия',
      applyBtn: 'Применить'
    },
    companyPage: {
      categoriesHeader: 'Сферы деятельности компании',
      descHeader: 'Описание',
      publishedJobsCountLabel: 'Размещено вакансий: ',
      registrationDate: 'Зарегистрирована: ',
    },
    entProfile: {
      navPublishedLabel: 'Вакансии',
      navResponsesLabel: 'Отклики',
      navAboutLabel: 'О компании',
      navSettingsLabel: 'Настройки',
      publishedHeader: 'Опубликованные вакансии',
    },
    reg: {
      loginLabel: 'Вход',
      regLabel: 'Регистрация',
      loginEmailLabel: 'Email',
      loginPWLabel: 'Пароль',
      rmeLabel: 'Запомнить меня',
      frgtPWLabel: 'Забыл пароль?',
      enterBtn: 'Войти',
      radioSub: 'Специалист',
      radioCom: 'Компания',
      companyLabel: 'Компания',
      agencyLabel: 'Кадровое агенство',
      nameLabel: 'Имя',
      surnameLabel: 'Фамилия',
      regConfirmPWLabel: 'Повтор пароля',
      rulesStart: 'Я соглашаюсь с',
      rulesLink: 'правилами использования сервиса',
      rulesEnd: ', а также с передачей и обработкой моих данных в TEST.com. Я подтверждаю своё совершеннолетие и ответственность за размещение объявления.',
      regBtn: 'Регистрация',
      alreadyAuthedMessage: 'Авторизован',
      loginValiMail0: 'Введите email',
      loginValiMailFormat: 'Неправильный формат адреса',
      loginValiPW0: 'Введите пароль',
      loginValiPWFormat: 'Кол-во символов от 5 до 25',
      loginSuccess: 'Вход осуществлен',
      loginError1: 'Не существующий Email или не правильный пароль',
      loginError2: 'Такого пользователя не существует, либо неверный пароль',
      loginError3: 'Не удалось выполнить вход',
      regValiRules: 'Ознакомтесь с правилами',
      regValiPWC0: 'Подтвердите пароль',
      regValiPWCDiff: 'Пароли не совпадают',
      regValiPWChar: 'Минимум 1 английская буква',
      regValiPWMax: 'Максимум 25 символов',
      regValiPWMin: 'Минимум 6 символов',
      regValiPW0: 'Введите пароль',
      compValiFormat: 'Неправильный формат названия',
      compValiMax: 'Максимальная длина 60 символов',
      compValiMin: 'Минимальная длина 3 символа',
      compVali0: 'Введите название',
      surnameValiFormat: 'Неправильный формат фамилии',
      surnameValiMax: 'Максимальная длина 35 символов',
      surnameValiMin: 'Минимальная длина 3 символа',
      surnameVali0: 'Введите фамилию',
      nameValiFormat: 'Неправильный формат имени',
      nameValiMax: 'Максимальная длина 35 символов',
      nameValiMin: 'Минимальная длина 3 символа',
      nameVali0: 'Введите имя',
      regSuccess: 'Регистрация удалась',
      regAllFields: 'Заполните все поля',
      regError1: 'Email или пароль не зарегестрированы',
      regError2: 'Такой email уже существует в базе данных',
      regError3: 'Регистрация не удалась, ошибки на сервере',
    },
    addJob: {
      pTypeNewLabel: 'Создать новую вакансию',
      pTypeEditLabel: 'Редактирование вакансии',
      titleLabel: 'Название вакансии',
      xlsBtn: 'Публикация вакансий XLS',
      titleValidationRequired: '* Обязательное поле',
      titleValidationMin: 'Минимум 2 символа',
      titleValidationMax: 'Максимум 75 символов',
      titleValidationSymbols: 'Используются запрещенные символы',
      salaryLabel: 'Зарплата',
      salaryMinPH: 'От',
      salaryValidationRange: 'От 0 до 99999',
      salaryMaxPH: 'До',
      salaryValidationEnter: 'Укажите зп',
      manat: 'манат',
      dollars: '$',
      salaryCB1Hint: 'По итогам собеседования',
      contactsLabel: 'Ваши контакты',
      emailPH: 'Email',
      emailValidationLength: 'Максимум 40 символов',
      emailValidationFormat: 'Неправильный формат',
      emailValidationEnter: 'Укажите Email или Телефон',
      telPH: 'Телефон',
      telValidationLengthMax: 'Максимум 15 символов',
      telValidationLengthMin: 'Минимум 5 символов',
      telValidationFormat: 'Неправильный формат',
      jcatLabel: 'Профессия',
      cityLabel: 'Город',
      cityValidationLength: 'Максимум 70 символов',
      cityValidationFormat: 'Только буквы',
      descLabel: 'Описание',
      descValidation2000: '(2000 символов максимум)',
      moreLabel: 'Дополнительно',
      expLabel: 'Опыт',
      jobTypeLabel: 'Тип занятости',
      ageLabel: 'Возраст',
      genericFrom: 'От',
      genericTo: 'До',
      genericEnterNumber: 'Введите число',
      genericFrom18: 'От 18',
      genericTooMuch: 'Слишком много',
      labelSchedule: 'График работы',
      genericWholeNumber:'Целое число',
      genericPositiveNumber: 'Положительное',
      generic24Max: '24 макс',
      schedulePH: 'Режим',
      scheduleValidationLengthMax: 'Максимум 10 символов',
      scheduleValidationFormat: 'Неправильный формат',
      eduLabel: 'Образование',
      eduValidationLengthMax: '20 символов макс',
      eduValidationFormat: 'Только буквы',
      eduTooltip: 'Например: высшее, среднее, высшее/среднее и т.д',
      langsLabel: 'Языки',
      sendJobBtnLabelNew: 'Разместить вакансию',
      sendJobBtnLabelUpdate: 'Отправить изменения',
      sendJobSuccess1: 'Вакансия ',
      sendJobSuccess2: ' успешно добавлена',
      sendJobSuccess1x: 'Вакансия ',
      sendJobSuccess2x: ' успешно изменена',
      btnAddOneMore: 'Добавить еще одну',
      sendJobError1: 'Ошибка на сервере, вакансия не добавлена',
      unauthorized: 'Авторизируйтесь, для возможности загрузки вакансий',
      cityOptions: ["Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"],
      jcats: [{label: "Не имеет значения", value: 0}, 
        {label: "АдминистрацияXX", value: 1},
        {label: "Юристы", value: 2},
        {label: "Нефть и газ", value: 3},
        {label: "Инженер", value: 4},
        {label: "Образование", value: 5},
        {label: "Продажи", value: 6},
        {label: "Производство", value: 7},
        {label: "Строительство", value: 8},
        {label: "Недвижимость", value: 9},
        {label: "Логистика", value: 10},
        {label: "Туризм, гостиницы, рестораны", value: 11},
        {label: "Информационные технологии", value: 12},
        {label: "Медицина", value: 13},
        {label: "Безопасность", value: 14}
      ],
      expOpts: [
        {label: "Не имеет значения", value: -1},
        {label: "Без опыта", value: 0},
        {label: "от 1 до 3 лет", value: 2}, 
        {label: "от 3 до 5 лет", value: 4},
        {label: "от 5 лет", value: 6}
      ],
      jtypeOptions: [
        {label: "Постоянная", value: 'c'},
        {label: "Временная", value: 'v'}
      ],
      langOptions: ["Туркменский", "Русский", "Английский", "Китайский", "Немецкий", "Французкий"],
      cityList: ["Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"],
      scheduleList: ["5/2", "6/1", "2/2", "3/2", "3/1", "15/15"],
      currDefault: {label: 'манат', value: 'm'},
    }
  },
}

module.exports = {
  loc
}