import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* <StrictMode> */}
    {/* <div className="overflow-hidden scrollbar-none"> */}
    <Elements stripe={stripePromise}>
      <App/>
    </Elements>
    {/* </StrictMode> */}
  </Provider>
);
