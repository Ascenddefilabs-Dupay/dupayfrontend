import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import ";
import BottomNavBar from "./BottomNavBar/BottomNavBar";
import Headernavbar from "./Headernavbar/headernavbar"



export default function Bottomnavbar({ children })    {
    return(
        <div>
        {/* <header>
          {<Headernavbar /> } 
                <h1>hello </h1>
        </header>  */}
            {children}
        <footer>
            <BottomNavBar />
        </footer>
        </div>
    )
}


