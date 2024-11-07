
class ShipmentCalculator {
    constructor(order, shipment) {
      this.order = order;
      this.shipment = shipment;
    }
  
    calculate() {
      let surcharge = 0;
      switch (this.shipment) {
        case 'Sea':
            surcharge = 400; 
            break;
          case 'Land':
            surcharge = 10 * this.order.quantity; 
            break;
          case 'Air':
            surcharge = 30 * this.order.quantity; 
            if (this.order.quantity > 1000) {
              surcharge *= 0.85; 
            }
            break;
          default:
            throw new Error('Unknown shipping mode');
      }
  
      // Apply the surcharge rate
      this.order.surcharge += surcharge;
      this.order.totalCost += surcharge;
    }
  }
  
  export default ShipmentCalculator;
  