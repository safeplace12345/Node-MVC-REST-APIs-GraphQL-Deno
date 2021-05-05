const deleteById = (id , readFile , writeFile) => {
    return readFile(cart => {
      let updated ;
      let existing = cart.products.find((item) => +item.id === +id);
      if(existing){
        let existingPrice = existing.price * existing.qty
        let totalPrice = cart.totalPrice - existingPrice;
        updated = { products : [...cart.products.filter(item => +item.id !== +id)], totalPrice };
       return writeFile(updated)
      }})
}
 
module.exports = deleteById;