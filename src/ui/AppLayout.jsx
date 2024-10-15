import Navbar from "./Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Spinner from "./Spinner";
import Footer from "./Footer";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <div className="grid h-screen w-full grid-rows-[auto_1fr_auto] bg-gradient-to-b from-black via-red-950 to-black text-white">
        <Navbar />

        {isLoading && <Spinner />}
        <div className="overflow-x-hidden scrollbar">
          <main className="mx-auto max-w-[90%]">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
