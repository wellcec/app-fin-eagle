import { createStore } from 'redux'
import { persistStore } from 'redux-persist'

import reducer from './ducks'

const store = createStore(reducer)
const persist = persistStore(store)

export { store, persist }
