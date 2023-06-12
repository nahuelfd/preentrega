const handleSubmit = async (cid, pid) => {

    const deleteProduct = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
    } ); 

    location.reload()
}