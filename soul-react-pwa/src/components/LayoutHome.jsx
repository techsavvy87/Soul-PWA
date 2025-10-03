import AppHeader from "./AppHeader";
const LayoutHome = ({ children }) => {
  return (
    <div className="min-h-screen layout-home px-5 pt-8 pb-5">
      <AppHeader />
      {children}
    </div>
  );
};
export default LayoutHome;
