import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { v4 as uuid } from "uuid";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      uuid(),
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order(uuid(), customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    });

    const product2 = new Product(uuid(), "Product 2", 20);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      uuid(),
      product2.name,
      product2.price,
      product2.id,
      10
    );

    order.addOrderItem(orderItem2);

    await orderRepository.update(order);

    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order.id,
          product_id: product2.id,
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      uuid(),
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order(uuid(), customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);

    expect(orderFound).toStrictEqual(order);
  });


  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    const product2 = new Product(uuid(), "Product 2", 15);
    const product3 = new Product(uuid(), "Product 3", 50);
    await productRepository.create(product);
    await productRepository.create(product2);
    await productRepository.create(product3);

    const orderItem = new OrderItem(
      uuid(),
      product.name,
      product.price,
      product.id,
      2
    );


    const orderItem2 = new OrderItem(
      uuid(),
      product2.name,
      product2.price,
      product2.id,
      3
    );
    const orderItem3 = new OrderItem(
      uuid(),
      product3.name,
      product3.price,
      product3.id,
      3
    );

    const order1 = new Order(uuid(), customer.id, [orderItem]);
    const order2 = new Order(uuid(), customer.id, [orderItem2, orderItem3]);

    
    const orderRepository = new OrderRepository();

    await orderRepository.create(order1);
    await orderRepository.create(order2);
    
    const ordersFound = await orderRepository.findAll();

    expect(ordersFound).toEqual([order1, order2]);
  });

});