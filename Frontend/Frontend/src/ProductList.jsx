function ProductList({products}) {
    console.log(products);
  return (
    <div>
        <h1>rendering data</h1>
        {
            products.map(
                (product)=>{
                      return (
                        <>
                          <div style={{backgroundColor:'red'}}>
                            <h1>{product.title}</h1>
                          <h1>{product.description}</h1>
                          <h1>{product.catagory}</h1>
                          </div>

                        </>
                      )
                }
            )
        }
    </div>
  )
}

export default ProductList