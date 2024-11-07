import Duck from '../models/Duck.js';
import {
    Order,
    CountryCalculator,
    PackageMaterialCalculator,
    QuantityCalculator,
    ShipmentCalculator
  } from '../services/pricing/OrderCalculator.js';
  
import PackageFactory from '../services/packaging/PackageFactory.js';
import { AirShippingStrategy, LandShippingStrategy, SeaShippingStrategy } from '../services/shipping/shippingStrategies.js';
import ShippingContext from '../services/shipping/ShippingContext.js';

export const createOrder = async (req, res) => {
    const { color, size, quantity, destinationCountry, shippingMode } = req.body;

    if (!color || !size || !quantity || !destinationCountry || !shippingMode) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const validShippingModes = ['Land', 'Air', 'Sea'];
    if (!validShippingModes.includes(shippingMode)) {
        return res.status(400).json({ error: 'Invalid shipping mode' });
    }
    let id = 0;
    let price = 0;
    try {
        // Check if the requested ducks are available
        const duck = await Duck.findOne({ color, size });
        if (!duck) {
            return res.status(404).json({ error: 'Duck with specified color and size not found' });
        }
        if (duck.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity available' });
        }
        price = duck.price;
        id = duck.id;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventroy' });
    }
    const currentPackage = PackageFactory.createPackage(size);
  

    let shippingStrategy;
    switch (shippingMode) {
        case 'Air':
            shippingStrategy = new AirShippingStrategy();
            break;
        case 'Land':
            shippingStrategy = new LandShippingStrategy();
            break;
        case 'Sea':
            shippingStrategy = new SeaShippingStrategy();
            break;
    }


    const context = new ShippingContext(shippingStrategy);
    context.applyStrategy(currentPackage);

    let order = new Order(quantity, price);

    new QuantityCalculator(order).calculate();
    new PackageMaterialCalculator(order, currentPackage.type).calculate();
    new CountryCalculator(order, destinationCountry).calculate();
    new ShipmentCalculator(order, shippingMode).calculate();
    const response = {
        package_type: currentPackage.type,
        protection_type: currentPackage.fill,
        discount: order.discount,
        total_pay: order.totalCost,
        increments: order.surcharge
    }

    try {
        let currentInventory = await Duck.findOne({ id });

        if (currentInventory) {
            currentInventory.quantity -= quantity;
            await currentInventory.save();

            res.status(200).json({ message: 'Order Successfully Placed', details: response });
        } else {
            res.status(404).json({ error: 'Inventory not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};
