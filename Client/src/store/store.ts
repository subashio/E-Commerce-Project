import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import addressReducer from "./addressSlice";
import productReducer from "./ProductSlice";
import orderReducer from "./orderSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

//create  presieter config
const Persistconfig = {
  key: "root",
  storage,
  whitelist: ["address", "user", "product", "order"], // Only persist the 'user' slice
};

//combining both reducers
const rootReducer = combineReducers({
  user: userReducer,
  address: addressReducer,
  product: productReducer,
  order: orderReducer,
});
//wraping userReducer  with presistReducer
const presistedReducer = persistReducer(Persistconfig, rootReducer);

export const store = configureStore({
  reducer: presistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persist = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
