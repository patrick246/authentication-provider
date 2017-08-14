import {makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {TYPE, controller} from 'inversify-express-utils';
import {Container} from 'inversify';

export const ApplicationContainer = new Container();
const InversifyProvider = makeProvideDecorator(ApplicationContainer);
export const ProviderFluent = makeFluentProvideDecorator(ApplicationContainer);

export const Controller = (path: string) => (target) => {
    return controller(path)(ProviderFluent(TYPE.Controller).whenTargetNamed(target.name).done()(target));
};

export const Provider = (target) => ProviderFluent(target).done()(target);