import { Store } from "@reduxjs/toolkit";

let store: Store | null = null;

export const setStore = (reduxStore: Store) => {
  store = reduxStore;
};

export const getStore = () => {
  if (!store) {
    throw new Error("Redux store has not been initialized");
  }
  return store;
};