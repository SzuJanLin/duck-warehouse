import { WoodPackage, CardboardPackage, PlasticPackage } from './Package.js';

class PackageFactory {
    static createPackage(size) {
      switch (size) {
        case 'XLarge':
        case 'Large':
          return new WoodPackage();
        case 'Medium':
          return new CardboardPackage();
        case 'Small':
        case 'XSmall':
          return new PlasticPackage();
        default:
          throw new Error('Unknown size');
      }
    }
  }

export default PackageFactory;