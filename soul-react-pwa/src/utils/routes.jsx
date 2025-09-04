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
import CardDetail from "../pages/card/Detail";
import LayoutCard from "../components/LayoutCard";
import ResetPassword from "../pages/auth/ResetPassword";
import WelcomeReset from "../pages/auth/WelcomeReset";
import Deck from "../pages/deck/Deck";
import Faq from "../pages/burger/Faq";
import LayoutBurger from "../components/LayoutBurger";
import About from "../pages/burger/About";
import CreativeLab from "../pages/burger/CreativeLab";
import Concept from "../pages/burger/Concept";
import Store from "../pages/burger/Store";
import ProductDetail from "../pages/burger/ProductDetail";
import ProductPayment from "../pages/burger/ProductPayment";
import Subscription from "../pages/burger/Subscription";
import DeckCard from "../pages/deck/DeckCard";
import CardAdj from "../pages/card/CardAdj";
import JournalHome from "../pages/journal/Home";
import JournalNew from "../pages/journal/New";
import JournalWelcome from "../pages/journal/Welcome";
import JournalEdit from "../pages/journal/Edit";
import ReadingList from "../pages/reading/List";
import LayoutReading from "../components/LayoutReading";
import ReadingFullScreen from "../pages/reading/FullScreen";
import ReadingDetail from "../pages/reading/Detail";
import ReadingClientDetail from "../pages/reading/ClientDetail";
import CardFullScreen from "../pages/card/FullScreen";
import CardClientDetail from "../pages/card/ClientDetail";
import MeditationList from "../pages/meditation/List";
import MeditationDetail from "../pages/meditation/Detail";
import MeditationAudio from "../pages/meditation/Audio";
import MeditationVideo from "../pages/meditation/Video";

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
    layout: LayoutCard,
    guard: AuthRequire,
    component: <Cards />,
  },
  {
    path: "/card/detail/:id",
    layout: LayoutCard,
    guard: AuthRequire,
    component: <CardDetail />,
  },
  {
    path: "/deck-list",
    guard: AuthRequire,
    component: <Deck />,
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
    component: <Store />,
  },
  {
    path: "/product/:id",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <ProductDetail />,
  },
  {
    path: "/product-payment/:id",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <ProductPayment />,
  },
  {
    path: "/subscription",
    layout: LayoutBurger,
    guard: AuthRequire,
    component: <Subscription />,
  },
  {
    path: "/deck/:id",
    guard: AuthRequire,
    component: <DeckCard />,
  },
  {
    path: "/cards-adjective",
    layout: LayoutCard,
    guard: AuthRequire,
    component: <CardAdj />,
  },
  {
    path: "/journal",
    guard: AuthRequire,
    component: <JournalHome />,
  },
  {
    path: "/journal/new",
    guard: AuthRequire,
    component: <JournalNew />,
  },
  {
    path: "/journal/welcome",
    guard: AuthRequire,
    component: <JournalWelcome />,
  },
  {
    path: "/journal/edit/:id",
    guard: AuthRequire,
    component: <JournalEdit />,
  },
  {
    path: "/reading",
    layout: LayoutReading,
    guard: AuthRequire,
    component: <ReadingList />,
  },
  {
    path: "/reading/fullscreen",
    layout: LayoutReading,
    guard: AuthRequire,
    component: <ReadingFullScreen />,
  },
  {
    path: "/reading/detail/:id",
    layout: LayoutReading,
    guard: AuthRequire,
    component: <ReadingDetail />,
  },
  // For page by email click
  {
    path: "/reading/client-detail/:id",
    component: <ReadingClientDetail />,
  },
  {
    path: "/card/fullscreen",
    layout: LayoutCard,
    guard: AuthRequire,
    component: <CardFullScreen />,
  },
  // For page by email click
  {
    path: "/card/client-detail/:id",
    component: <CardClientDetail />,
  },
  {
    path: "/meditation",
    guard: AuthRequire,
    component: <MeditationList />,
  },
  {
    path: "/meditation/detail/:id",
    guard: AuthRequire,
    component: <MeditationDetail />,
  },
  {
    path: "/meditation/audio/:id",
    guard: AuthRequire,
    component: <MeditationAudio />,
  },
  {
    path: "/meditation/video/:id",
    guard: AuthRequire,
    component: <MeditationVideo />,
  },
];
