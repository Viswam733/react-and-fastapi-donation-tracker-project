import Navigation from "./Navigation";
import Footer from "./Footer";
const DashboardLayout = ({ children }) => {
  console.log(children);
  return (
    <div className='dashboard-wrapper'>
      <Navigation />
      <div style={{ marginTop: "150px" }}>{children}</div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
