class Order {
    constructor(quantity, price) {
      this.quantity = quantity;
      this.price = price;
      this.discount = 0;
      this.surcharge = 0;
      this.totalCost = quantity * price;
    }
  }
  
  export default Order;
  