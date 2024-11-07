import { WoodPackage, CardboardPackage, PlasticPackage } from "../packaging/Package.js";
import FillMaterials from "../packaging/FillMaterials.js";

class AirShippingStrategy {
    applyFill(packageMaterial) {
        let fill = [];
        if (packageMaterial instanceof WoodPackage || packageMaterial instanceof CardboardPackage) {
            fill.push(FillMaterials.POLYSTYRENE_BALLS);
        } else if (packageMaterial instanceof PlasticPackage) {
            fill.push(FillMaterials.BUBBLE_WRAP_BAGS);
        }
        packageMaterial.setFill(fill);
    }
}

class LandShippingStrategy {
    applyFill(packageMaterial) {
        packageMaterial.setFill(FillMaterials.POLYSTYRENE_BALLS);
    }
}

class SeaShippingStrategy {
    applyFill(packageMaterial) {
        packageMaterial.setFill([FillMaterials.MOISTURE_ABSORBING_BEADS, FillMaterials.BUBBLE_WRAP_BAGS]);
    }
}

export { AirShippingStrategy, LandShippingStrategy, SeaShippingStrategy };