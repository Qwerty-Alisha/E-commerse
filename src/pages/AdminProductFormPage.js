import ProductForm from "../featues/admin/components/ProductForm";
import NavBar from "../featues/navbar/navbar";
function AdminProductFormPage() {
    return ( 
        <div>
            <NavBar>
                <ProductForm></ProductForm>
            </NavBar>
        </div>
     );
}

export default AdminProductFormPage;