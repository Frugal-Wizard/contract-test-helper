import { TestSetupContext } from './scenario';

export interface SetupAction<Context> {
    description: string;
    execute(ctx: Context): void | Promise<void>;
}

export function describeSetupActions<Context>(setupActions: SetupAction<Context>[]) {
    return `${setupActions.length ? ` after ${setupActions.map(({ description }) => description).join(' and ')}` : ''}`;
}

export async function executeSetupActions<Context>(setupActions: SetupAction<Context>[], ctx: Context & TestSetupContext) {
    for (const setupAction of setupActions) {
        await setupAction.execute(ctx);
    }
    if (setupActions.length) ctx.addContext('setup', setupActions.map(action => action.description).join('\n'));
}
