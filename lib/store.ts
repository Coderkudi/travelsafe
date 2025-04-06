import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./user";
import { setupListeners } from "@reduxjs/toolkit/query";
import locationInformationReducer from "./userSlice";

export const Store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        locationInformation: locationInformationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([userApi.middleware]),
    // getDefaultMiddleware().concat([userApi.middleware, abc]),

    devTools: true,
});
setupListeners(Store.dispatch);
// (getDefaultMiddleware) =>getDefaultMiddleware().concat(userApi.middleware),
