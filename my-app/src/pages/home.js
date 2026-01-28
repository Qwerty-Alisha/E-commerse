import Navbar  from '../features/navbar/navbar.js'
import Example from '../../../my-app/src/productlist.js'
import Footer from "../features/common/Footer";
import { Link } from "react-router-dom";
function Home(){
    return (
        <div>
            <Navbar>
            <Example></Example>
        </Navbar>
        <Footer></Footer>
        </div>
    )
}
export default Home;