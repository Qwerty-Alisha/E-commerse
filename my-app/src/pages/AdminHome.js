import AdminProductList from "../features/admin/components/AdminProductList";
import NavBar from "../features/navbar/navbar";

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