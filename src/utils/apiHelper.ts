import { request, APIRequestContext } from '@playwright/test';

/**
 * Sends a track event to Rudderstack HTTP Source.
 * @param dataPlaneUrl - The Data Plane URL from Rudderstack UI
 * @param writeKey - The Write Key from your HTTP Source
 * @param eventName - The name of the event (required)
 * @param userId - The userId for identified users (either userId or anonymousId required)
 * @param extraData - Optional object with properties, traits, context, timestamp
 */
export async function sendEvent(
  dataPlaneUrl: string,
  writeKey: string,
  eventName: string,
  userId?: string,
  anonymousId?: string,
  extraData: Partial<{
    properties: object;
    traits: object;
    context: object;
    timestamp: string;
  }> = {}
) {
  if (!userId && !anonymousId) {
    throw new Error("You must provide either userId or anonymousId");
  }

  const payload: any = {
    writeKey: writeKey,
    event: eventName,
    ...(userId ? { userId } : { anonymousId }),
    ...extraData
  };

  const requestContext: APIRequestContext = await request.newContext();

  const response = await requestContext.post(`${dataPlaneUrl}/v1/track`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload
  });

  console.log(`Send Event Payload: ${JSON.stringify(payload, null, 2)}`);
  console.log(`API Status Code: ${response.status()}`);

  return response.status();
}
