import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/send-console-log-when-address-is-changed.handler";
import SendConsoleLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-console-log-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all event handlers 2", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
        _name: 'Customer 1',
        _active: true,
        _rewardPoints: 0,
        _id: '1',
        _address: {
          _street: 'Street 1',
          _number: 123,
          _zip: '13330-250',
          _city: 'São Paulo'
        }
      });

    // Quando o notify for executado o SendConsoleLogWhenCustomerIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all event handlers 3", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
        _name: 'Customer 1',
        _active: true,
        _rewardPoints: 0,
        _id: '1',
        _address: {
          _street: 'Street 1',
          _number: 123,
          _zip: '13330-250',
          _city: 'São Paulo'
        }
      });

    // Quando o notify for executado o SendConsoleLogWhenCustomerAddressIsChangedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});