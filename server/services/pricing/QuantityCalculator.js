class QuantityCalculator {
    constructor(order) {
        this.order = order;
    }

    calculate() {
        if(this.order.quantity > 100) {
            this.order.discount = this.order.totalCost * 0.2;
            this.order.totalCost -= this.order.discount;
        }
      }
}

export default QuantityCalculator;