import authreducer from "./slices/authSlice";

import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: {
    auth: authreducer,
  },
});

export default store;
