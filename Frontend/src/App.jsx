import { useEffect, useState } from 'react'
import ProductList from './ProductList';

function App() {

const [products,setProducts]=useState([]);



useEffect(()=>{
    async  function FetchData(){
      console.log("aman happy birthday..🎂");
         let responce= await fetch("https://divyansh-gupta.onrender.com/api/products");
           let data= await responce.json();
           console.log(data);
           setProducts(data);  //pay attention , data formate change
     }


   FetchData();
},[]);

  return (
    <div>

       <ProductList products={products}/>

    </div>
  )
}

export default App