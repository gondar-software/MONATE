import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import { reducer } from '@app/global';
import { MSG_ERROR_0001 } from '@app/constants';

const encryptor = encryptTransform({
    secretKey: import.meta.env.VITE_ENCRYPTION_KEY,
    onError: (error: any) => {
        console.error(MSG_ERROR_0001, error);
    },
});

const persistConfig = {
    key: 'root',
    storage,
    transform: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
export default store;