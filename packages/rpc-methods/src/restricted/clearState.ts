import {
  PendingJsonRpcResponse,
  JsonRpcEngineEndCallback,
} from 'json-rpc-engine';
import { AnnotatedJsonRpcEngine } from 'rpc-cap';
import { RestrictedHandlerExport } from '../../types';

/**
 * `snap_clearState` clears the persistent state of the Snap.
 */
export const clearStateHandler: RestrictedHandlerExport<
  ClearStateHooks,
  void,
  null
> = {
  methodNames: ['snap_clearState'],
  getImplementation: getClearStateHandler,
  hookNames: {
    clearSnapState: true,
  },
};

export interface ClearStateHooks {
  /**
   * A bound function that clears the state of a particular snap.
   * @param fromDomain - The string identifying the fromDomain.
   */
  clearSnapState: (fromDomain: string) => void;
}

function getClearStateHandler({ clearSnapState }: ClearStateHooks) {
  return async function clearState(
    _req: unknown,
    res: PendingJsonRpcResponse<null>,
    _next: unknown,
    end: JsonRpcEngineEndCallback,
    engine: AnnotatedJsonRpcEngine,
  ): Promise<void> {
    try {
      await clearSnapState(engine.domain as string);
      res.result = null;
      return end();
    } catch (error) {
      return end(error);
    }
  };
}
