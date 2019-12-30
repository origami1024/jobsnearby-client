import Vue from 'vue'

import './styles/quasar.styl'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar, 
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
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
  QRange
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
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
  },
  directives: {
  },
  plugins: {
  }
 })