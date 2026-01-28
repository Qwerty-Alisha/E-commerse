import AdminProductDetail from "../features/admin/components/AdminProductDetail";
import NavBar from "../features/navbar/navbar";
function AdminProductDetailPage() {
    return ( 
        <div>
            <NavBar>
                <AdminProductDetail></AdminProductDetail>
            </NavBar>
        </div>
     );
}

export default AdminProductDetailPage;