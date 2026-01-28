import Navbar  from '../features/navbar/navbar.js'
import ProdDetails from '../../src/product_details.js'
import Footer from "../features/common/Footer";
function Details(){
    return(
        <div>
            <Navbar>
            <ProdDetails></ProdDetails>
        </Navbar>
        <Footer></Footer>
        </div>
    )
}
export default Details;