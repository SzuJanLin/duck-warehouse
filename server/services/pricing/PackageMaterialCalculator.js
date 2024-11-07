class PackageMaterialCalculator {
    constructor(order, packageType) {
        this.order = order;
        this.packageType = packageType;
    }

    calculate() {
        let surcharge = 0;
        let discount = 0;
        switch (this.packageType) {
            case 'Wood':
                surcharge = this.order.totalCost * 0.05;
                this.order.totalCost += surcharge;
                break;
            case 'Plastic':
                surcharge = this.order.totalCost * 0.10;
                this.order.totalCost += surcharge;
                break;
            case 'Cardboard':
                discount = this.order.totalCost * 0.01;
                this.order.totalCost -= discount;
                break;
        }
        this.order.surcharge += surcharge;
        this.order.discount += discount;
    }
}

export default PackageMaterialCalculator;