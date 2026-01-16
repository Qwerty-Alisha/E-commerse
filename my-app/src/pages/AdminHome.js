import AdminProductList from "../featues/admin/components/AdminProductList";
import NavBar from "../featues/navbar/navbar";

function AdminHome() {
    return ( 
        <div>
            <NavBar>
                <AdminProductList></AdminProductList>
            </NavBar>
            Foot
        </div>
     );
}

export default AdminHome;