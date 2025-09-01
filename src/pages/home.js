import Navbar  from '../featues/navbar/navbar.js'
import Example from '../../../my-app/src/productlist.js'
import { Link } from "react-router-dom";
function Home(){
    return (
        <Navbar>
            <Example></Example>
        </Navbar>
    )
}
export default Home;