class Package {
    constructor(type) {
      this.type = type;
      this.fill = [];
    }
  
    setFill(fill) {
      this.fill = fill;
    }
  
  }
  
  class WoodPackage extends Package {
    constructor() {
      super('Wood');
    }
  }
  
  class CardboardPackage extends Package {
    constructor() {
      super('Cardboard');
    }
  }
  
  class PlasticPackage extends Package {
    constructor() {
      super('Plastic');
    }
  }

  export { Package, WoodPackage, CardboardPackage, PlasticPackage };
  