import AuthRequire from "../components/AuthRequire";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Welcome from "../pages/auth/Welcome";
import LayoutAuth from "../components/LayoutAuth";
import FotgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Home from "../pages/home/Home";
import Emotional from "../pages/emotional/Emotional";
import LayoutHome from "../components/LayoutHome";
import Favorites from "../pages/favorites/Favorites";
import Cards from "../pages/card/Cards";
import CardView from "../pages/card/CardView";
import LayoutCard from "../components/LayoutCard";
import ResetPassword from "../pages/auth/ResetPassword";
import WelcomeReset from "../pages/auth/WelcomeReset";
import Deck from "../pages/deck/Deck";
import CardBody from "../pages/card/CardBody";
import Faq from "../pages/burger/Faq";
import LayoutBurger from "../components/LayoutBurger";
import About from "../pages/burger/About";
import CreativeLab from "../pages/burger/CreativeLab";
import Concept from "../pages/burger/Concept";
import StoreItem from "../pages/burger/StoreItem";

export const routes = [
  {
    path: "/login",
    layout: LayoutAuth,
    component: <Login />,
  },
  {
    path: "/signup",
    layout: LayoutAuth,
    component: <Signup />,
  },
  {
    path: "/welcome",
    layout: LayoutAuth,
    component: <Welcome />,
  },
  {
    path: "/welcome-reset",
    layout: LayoutAuth,
    component: <WelcomeReset />,
  },
  {
    path: "/forgot-password",
    layout: LayoutAuth,
    component: <FotgotPassword />,
  },
  {
    path: "/verify-email",
    layout: LayoutAuth,
    component: <VerifyEmail />,
  },
  {
    path: "/reset-password",
    layout: LayoutAuth,
    component: <ResetPassword />,
  },
  {
    path: "/",
    layout: LayoutHome,
    guard: AuthRequire,
    component: <Home />,
  },
  {
    path: "/emotional",
    guard: AuthRequire,
    component: <Emotional />,
  },
  {
    path: "/favorites",
    guard: AuthRequire,
    component: <Favorites />,
  },
  {
    path: "/cards",
    // layout: LayoutCard,
    guard: AuthRequire,
    component: <Cards />,
  },
  {
    path: "/card-view",
    layout: LayoutCard,
    guard: AuthRequire,
    component: <CardView />,
  },
  {
    path: "/deck-list",
    guard: AuthRequire,
    component: <Deck />,
  },
  {
    path: "/card-body",
    guard: AuthRequire,
    component: <CardBody />,
  },
  {
    path: "/faq",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <Faq />,
  },
  {
    path: "/about",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <About />,
  },
  {
    path: "/creative-lab",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <CreativeLab />,
  },
  {
    path: "/concept",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <Concept />,
  },
  {
    path: "/store",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <StoreItem />,
  },
];
