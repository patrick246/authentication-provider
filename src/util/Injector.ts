import {makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {interfaces, TYPE} from 'inversify-express-utils';
import {Container} from 'inversify';

export const ApplicationContainer = new Container();
export const Provider = makeProvideDecorator(ApplicationContainer);
export const ProviderFluent = makeFluentProvideDecorator(ApplicationContainer);

export const ControllerProvider = function (identifier, name) { return ProviderFluent(identifier).whenTargetNamed(name).done();};
