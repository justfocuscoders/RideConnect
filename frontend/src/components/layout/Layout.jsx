import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

function Layout(){
    return(
        <>
            <Header />
            <main style={{ minHeight: "80vh" }}>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;