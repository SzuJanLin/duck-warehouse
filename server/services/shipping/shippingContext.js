
class ShippingContext {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    applyStrategy(packageMaterial) {
      this.strategy.applyFill(packageMaterial);
    }
  }

  export default ShippingContext;