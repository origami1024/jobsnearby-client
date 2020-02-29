import Vue from 'vue'

import './styles/quasar.styl'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar, 
  QToolbar,
  QToolbarTitle,
  QBtnGroup,
  QBtn,
  QBtnToggle,
  QSelect,
  QToggle,
  QInput,
  QAjaxBar,
  QCheckbox,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QRange,
  QAvatar,
  QTabs,
  QTab,
  QTabPanel,
  QTabPanels,
  QStepper,
  QStep,
  QStepperNavigation,
  QBadge,
  QSeparator,
  QTooltip,
  QMenu,
  ClosePopup,
  QExpansionItem,
  Notify,
  QRadio,
  QUploader,
} from 'quasar'

Vue.use(Quasar, {
  config: {
    notify: { timeout: 2000 }
  },
  extras: [
    'material-icons'
  ],
  components: {
    QRadio,
    QToolbar,
    QToolbarTitle,
    QIcon,
    QList,
    QItem,
    QToggle,
    QBtnToggle,
    QBtnGroup,
    QBtn,
    QRange,
    QAjaxBar,
    QSelect,
    QInput,
    QCheckbox,
    QItemSection,
    QItemLabel,
    QAvatar,
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QStepper,
    QStep,
    QStepperNavigation,
    QBadge,
    QSeparator,
    QTooltip,
    QMenu,
    QExpansionItem,
    QUploader
  },
  directives: {
    ClosePopup
  },
  plugins: {
    Notify
  }
 })