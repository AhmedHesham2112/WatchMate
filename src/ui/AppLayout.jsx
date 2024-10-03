import Navbar from "./Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Spinner from "./Spinner";
import Footer from "./Footer";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
      <Navbar />
      {isLoading && <Spinner />}
      <div className="overflow-x-hidden">
        <main className="mx-auto max-w-[90%]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
