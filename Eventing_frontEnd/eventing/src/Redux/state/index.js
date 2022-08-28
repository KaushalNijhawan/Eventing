import {userReducer} from "../resolvers/userResolver";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({reducer : userReducer});
export default store;