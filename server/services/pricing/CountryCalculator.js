
class CountryCalculator {
    constructor(order, country) {
      this.order = order;
      this.country = country;
    }
  
    calculate() {
      let surchargeRate;
  
      // Determine the surcharge based on the country
      switch (this.country) {
        case 'USA':
          surchargeRate = 0.18;
          break;
        case 'Bolivia':
          surchargeRate = 0.13;
          break;
        case 'India':
          surchargeRate = 0.19;
          break;
        default:
          surchargeRate = 0.15; // Default surcharge for other countries
      }
  
      // Apply the surcharge rate
      const surcharge = this.order.totalCost * surchargeRate;
      this.order.surcharge += surcharge;
      this.order.totalCost += surcharge;
    }
  }
  
  export default CountryCalculator;
  