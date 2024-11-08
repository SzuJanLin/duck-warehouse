process.env.NODE_ENV = 'test';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Duck from '../../models/Duck';
import connectDB from '../../config/db';

// Mock data for testing
const validDuck = {
    color: 'Yellow',
    size: 'Large',
    price: 10,
    quantity: 2000,
};

const validDuck2 = {
    color: 'Red',
    size: 'Large',
    price: 10,
    quantity: 500,
};

const validOrder = {
    color: 'Yellow',
    size: 'Large',
    quantity: 100,
    destinationCountry: 'USA',
    shippingMode: 'Air',
};

const insufficientOrder = {
    color: 'Red',
    size: 'Large',
    quantity: 100,
    destinationCountry: 'USA',
    shippingMode: 'Air',
}

// // Connect to a test database before tests and clear after
beforeAll(async () => {
    await connectDB();

});

beforeEach(async () => {
    await Duck.create(validDuck);
    await Duck.create( { ...validDuck, size: 'XLarge' });
    await Duck.create( { ...validDuck, size: 'Medium' });
    await Duck.create( { ...validDuck, size: 'Small' });
    await Duck.create( { ...validDuck, size: 'XSmall' });
    await Duck.create(validDuck2);
})

afterEach(async () => {
    await mongoose.connection.dropDatabase();
})

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('POST /api/store/order', () => {

    /**
    Basic Functional Test Cases
    *  */

    //happy path
    it('should successfully create an order with valid data', async () => {
        const response = await request(app)
            .post('/api/store/order')
            .send(validOrder);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Order Successfully Placed');
        expect(response.body.details.total_pay).toBeDefined();
    });


    /**
     * Boundary Conditions
     */
    describe('boundary tests', () => {
        // Missing required fields
        it('should return 400 error for missing fields', async () => {
            const response = await request(app)
                .post('/api/store/order')
                .send({ color: 'Yellow' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('All fields are required');
        });

        // Invalid shipping mode
        it('should return 400 error for an invalid shipping mode', async () => {
            const invalidShippingModeOrder = { ...validOrder, shippingMode: 'Space' };
            const response = await request(app)
                .post('/api/store/order')
                .send(invalidShippingModeOrder);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid shipping mode');
        });

        // Insufficient duck quantity
        it('should return 400 error for insufficient quantity in stock', async () => {
            const largeOrder = { ...insufficientOrder, quantity: 1000 };
            const response = await request(app)
                .post('/api/store/order')
                .send(largeOrder);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Insufficient quantity available');
        });

        // Duck not found
        it('should return 404 error if the specified duck color and size are not found', async () => {
            const missingDuckOrder = { ...validOrder, color: 'Blue' };
            const response = await request(app)
                .post('/api/store/order')
                .send(missingDuckOrder);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Duck with specified color and size not found');
        });
    })

    /**
     * Wood: For Large and XLarge sizes.
     * Cardboard: For Medium size.
     * Plastic: For Small and XSmall sizes.
     */
    describe('Package material selection based on duck size', () => {
        const testCases = [
            {
                description: 'selects wood package for Large size',
                order: { ...validOrder, size: 'Large' },
                expectedPackage: 'Wood',
            },
            {
                description: 'selects wood package for XLarge size',
                order: { ...validOrder, size: 'XLarge' },
                expectedPackage: 'Wood',
            },
            {
                description: 'selects cardboard package for Medium size',
                order: { ...validOrder, size: 'Medium' },
                expectedPackage: 'Cardboard',
            },
            {
                description: 'selects plastic package for Small size',
                order: { ...validOrder, size: 'Small' },
                expectedPackage: 'Plastic',
            },
            {
                description: 'selects plastic package for XSmall size',
                order: { ...validOrder, size: 'XSmall' },
                expectedPackage: 'Plastic',
            },
        ];

        describe.each(testCases)(
            '$description',
            ({ order, expectedPackage }) => {
                it('should select the correct package material', async () => {
                    const response = await request(app)
                        .post('/api/store/order')
                        .send(order);

                    // Assertions to check package type
                    expect(response.status).toBe(200);
                    const details = response.body.details;
                    expect(details).toBeDefined();
                    expect(details.package_type).toBe(expectedPackage);
                });
            }
        );
    });

    /**
     * Air Shipment:
     * Wood or Cardboard → Polystyrene balls
     * Plastic → Bubble wrap bags
     * Land Shipment: Polystyrene balls for any package
     * Sea Shipment: Moisture-absorbing beads and Bubble wrap bags for any package
     * 
     */
    describe('Protective material selection based on shipping mode and package type', () => {

        const testCases = [
            {
                description: 'introduces polystyrene balls for air shipment with wood package',
                order: { ...validOrder, shippingMode: 'Air', size: 'Large' },
                expectedPackage: 'Wood',
                expectedProtection: ['Polystyrene balls'],
            },
            {
                description: 'introduces polystyrene balls for air shipment with cardboard package',
                order: { ...validOrder, shippingMode: 'Air', size: 'Medium' },
                expectedPackage: 'Cardboard',
                expectedProtection: ['Polystyrene balls'],
            },
            {
                description: 'introduces bubble wrap bags for air shipment with plastic package',
                order: { ...validOrder, shippingMode: 'Air', size: 'Small' },
                expectedPackage: 'Plastic',
                expectedProtection: ['Bubble wrap bags'],
            },
            {
                description: 'introduces polystyrene balls for land shipment with wood package',
                order: { ...validOrder, shippingMode: 'Land', size: 'Large' },
                expectedPackage: 'Wood',
                expectedProtection: ['Polystyrene balls'],
            },
            {
                description: 'introduces moisture-absorbing beads and bubble wrap bags for sea shipment with any package type',
                order: { ...validOrder, shippingMode: 'Sea', size: 'Large' },
                expectedPackage: 'Wood',
                expectedProtection: ['Moisture-absorbing beads', 'Bubble wrap bags'],
            },
        ];

        describe.each(testCases)(
            '$description',
            ({ order, expectedPackage, expectedProtection }) => {
                it('should include the correct protective material', async () => {
                    const response = await request(app)
                        .post('/api/store/order')
                        .send(order);

                    // Assertions to check package type and protection type
                    expect(response.status).toBe(200);
                    const details = response.body.details;
                    expect(details).toBeDefined();
                    expect(details.package_type).toBe(expectedPackage);
                    expect(details.protection_type).toEqual(expectedProtection);
                });
            }
        );
    });



    /**
     * Package Material Surcharge Tests
     */
    describe('Package Material Surcharge Tests', () => {
        const baseOrder = {
            color: 'Yellow',
            size: 'Large',
            quantity: 100,
            destinationCountry: 'USA',
            shippingMode: 'Air', 
        };

        it('should add 5% surcharge for wood package', async () => {
            const response = await request(app)
                .post('/api/store/order')
                .send({ ...baseOrder, size: 'Large' }); 

            const baseCost = 100 * 10; 
            const woodSurcharge = baseCost * 0.05; 
            const expectedTotal = baseCost + woodSurcharge;

            expect(response.status).toBe(200);
            expect(response.body.details.package_type).toBe("Wood");
            expect(response.body.details.total_pay).toBeCloseTo(expectedTotal, 2);
        });

        it('should add 10% surcharge for plastic package', async () => {
            const plasticDuck = await Duck.create({
                color: 'Green',
                size: 'Small',
                price: 10,
                quantity: 2000,
            });

            const response = await request(app)
                .post('/api/store/order')
                .send({ ...baseOrder, color: 'Green', size: 'Small' });

            const baseCost = 100 * 10; 
            const plasticSurcharge = baseCost * 0.1; 
            const expectedTotal = baseCost + plasticSurcharge;

            expect(response.status).toBe(200);
            expect(response.body.details.package_type).toBe("Plastic");
            expect(response.body.details.total_pay).toBeCloseTo(expectedTotal, 2);
        });

        it('should apply 1% discount for cardboard package', async () => {
            const cardboardDuck = await Duck.create({
                color: 'Blue',
                size: 'Medium', 
                price: 10,
                quantity: 2000,
            });

            const response = await request(app)
                .post('/api/store/order')
                .send({ ...baseOrder, color: 'Blue', size: 'Medium' });

            const baseCost = 100 * 10; 
            const cardboardDiscount = baseCost * 0.01;
            const expectedTotal = baseCost - cardboardDiscount;

            expect(response.status).toBe(200);
            expect(response.body.details.package_type).toBe("Cardboard");
            expect(response.body.details.total_pay).toBeCloseTo(expectedTotal, 2);
        });
    });

    /**
     *  Different destination country surcharge.
     *  */
    describe('Surcharge and total calculation for different destination countries', () => {
        const baseOrder = {
            color: 'Yellow',
            size: 'Large',
            quantity: 100,
            shippingMode: 'Air',
        };

        const testCases = [
            {
                destinationCountry: 'USA',
                countrySurchargeRate: 0.18,
                expectedPackageType: 'Wood',
                expectedProtectionType: ['Polystyrene balls'],
            },
            {
                destinationCountry: 'Bolivia',
                countrySurchargeRate: 0.13,
                expectedPackageType: 'Wood',
                expectedProtectionType: ['Polystyrene balls'],
            },
            {
                destinationCountry: 'India',
                countrySurchargeRate: 0.19,
                expectedPackageType: 'Wood',
                expectedProtectionType: ['Polystyrene balls'],
            },
            {
                destinationCountry: 'OtherCountry',
                countrySurchargeRate: 0.15,
                expectedPackageType: 'Wood',
                expectedProtectionType: ['Polystyrene balls'],
            },
        ];

        describe.each(testCases)(
            'should calculate correct surcharge and total for $destinationCountry as destination country and Air shipping with quantity = 100',
            ({ destinationCountry, countrySurchargeRate, expectedPackageType, expectedProtectionType }) => {
                it(`calculates correctly for ${destinationCountry}`, async () => {
                    const response = await request(app)
                        .post('/api/store/order')
                        .send({ ...baseOrder, destinationCountry });

                    const baseCost = 100 * 10;
                    const packageSurcharge = baseCost * 0.05;
                    const costAfterPackageSurcharge = baseCost + packageSurcharge;
                    const countrySurcharge = costAfterPackageSurcharge * countrySurchargeRate;
                    const costAfterCountrySurcharge = costAfterPackageSurcharge + countrySurcharge;
                    const airShippingSurcharge = 100 * 30;
                    const totalIncrements = packageSurcharge + countrySurcharge + airShippingSurcharge;
                    const expectedTotalPay = costAfterCountrySurcharge + airShippingSurcharge;

                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe('Order Successfully Placed');

                    const details = response.body.details;
                    expect(details).toBeDefined();
                    expect(details.package_type).toBe(expectedPackageType);
                    expect(details.protection_type).toEqual(expect.arrayContaining(expectedProtectionType));
                    expect(details.discount).toBe(0);
                    expect(details.total_pay).toBeCloseTo(expectedTotalPay, 2);
                    expect(details.increments).toBeCloseTo(totalIncrements, 2);
                });
            }
        );
    });

    /**
     * Shipping method surcharge tests.
     * 
     */
    describe('Total cost calculation based on shipping method and quantity', () => {
        const baseOrder = {
            color: 'Yellow',
            size: 'Large',
            destinationCountry: 'USA',
            price: 10,
        };

        const testCases = [
            {
                description: 'apply discount for large quantity air shipping (over 1000 units)',
                order: { ...baseOrder, quantity: 1500, shippingMode: 'Air' },
            },
            {
                description: 'calculate total_pay for Air shipping with quantity < 100',
                order: { ...baseOrder, quantity: 80, shippingMode: 'Air' },
            },
            {
                description: 'calculate total_pay for Land shipping with quantity < 100',
                order: { ...baseOrder, quantity: 80, shippingMode: 'Land' },
            },
            {
                description: 'calculate total_pay for Sea shipping with quantity < 100',
                order: { ...baseOrder, quantity: 80, shippingMode: 'Sea' },
            },
        ];

        describe.each(testCases)(
            '$description',
            ({ order }) => {
                it('should calculate the correct total pay', async () => {
                    const response = await request(app)
                        .post('/api/store/order')
                        .send(order);

                    let baseCost = order.quantity * order.price;
                    if (order.quantity > 100) {
                        baseCost *= 0.8;
                    }

                    const packageSurcharge = baseCost * 0.05;
                    baseCost += packageSurcharge;
                    const countrySurcharge = baseCost * 0.18;

                    let shippingCost;
                    if (order.shippingMode === 'Air') {
                        shippingCost = order.quantity * 30;
                        if (order.quantity > 1000) {
                            shippingCost *= 0.85;
                        }
                    } else if (order.shippingMode === 'Land') {
                        shippingCost = order.quantity * 10;
                    } else if (order.shippingMode === 'Sea') {
                        shippingCost = 400;
                    }

                    const expectedTotal = baseCost + countrySurcharge + shippingCost;

                    expect(response.status).toBe(200);
                    const details = response.body.details;
                    expect(details.total_pay).toBeCloseTo(expectedTotal, 2);
                });
            }
        );
    });



});