import {useState,useEffect} from 'react'

function App() {
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  
  useEffect(()=>{ 
    async function fetchData() {
      let responce = await fetch('http://localhost:3000/api/data')
      let data = await responce.json();
      setData(data);
      setLoading(false);
  }

  fetchData();
},[])
  return (
    <div>
      <h1>Welcome to the Frontend</h1>
      <ProductList products={products}/>
    </div>
  )
}

export default App