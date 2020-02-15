


const loc = {
  ru: {
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
      currOpts: [
        {label: "все", value: 'idc'},
        {label: "$", value: '$'},
        {label: "манат", value: 'm'},],
      cityOpts: [
        "Не имеет значения",
        "Ашхабад",
        "Дашогуз",
        "Мары",
        "Туркменабад",
        "Туркменбаши"
      ],
      exp: 'Опыт',
      jtyp: 'Занятость',
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
    addJob: {
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
      cityLabel: 'Город',
      cityValidationLength: 'Максимум 70 символов',
      cityValidationFormat: 'Только буквы',
      descLabel: 'Описание',
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
    }
  },
  tm: {
    App: {
      login: 'ЧЧЧ',
      logoutHint: 'ФЫВФЫВ',
      newJobHint: '"№!"!№"'
    },
    home: {
      searchPH: 'ВЫАЫВА',
      searchHint: 'ФЫВФВЫЫВФФЫВ',
      searchValSym: 'ФЫВЫВФЫВФ',
      searchBtn: 'ЯЧСЧЯС',
      city: 'ЯЧССЧЯ',
      sal: 'ФЫВФЫВ',
      curr: 'ЙК№К№КЙ№К',
      currOpts: [
        {label: "все", value: 'idc'},
        {label: "$", value: '$'},
        {label: "манат", value: 'm'},],
      cityOpts: [
        "Не имеет значения",
        "Ашхабад",
        "Дашогуз",
        "Мары",
        "Туркменабад",
        "Туркменбаши"
      ],
      exp: 'КЙУЦК№ЙК',
      jtyp: 'ЙКЙК№',
      applyBtn: 'ЙЦКЙК"'
    },
    addJob: {
      titleLabel: 'ФЫВ№"№  А№ЙФАВФЫАВА',
      titleValidationRequired: '* GSIGSIGISG',
      cityOptions: ["AASDQWDQW", "SSS", "UUU", "XXX", "ЧЧЧ"],
    }
  },
  en: {},
}

module.exports = {
  loc
}