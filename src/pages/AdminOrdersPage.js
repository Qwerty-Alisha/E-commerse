import AdminOrders from "../featues/admin/components/AdminOrders";
import NavBar from "../featues/navbar/navbar";

function AdminOrdersPage() {
    return ( 
        <div>
            <NavBar>
                <AdminOrders></AdminOrders>
            </NavBar>
        </div>
     );
}

export default AdminOrdersPage;