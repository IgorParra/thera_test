import { http, HttpResponse } from "msw";
import { clientHandlers } from "./handlers/clients";
import { transportTypeHandlers } from "./handlers/transport-types";
import { itemHandlers } from "./handlers/items";
import { orderHandlers } from "./handlers/orders";

export const handlers = [
  http.get("/api/ping", () => {
    return HttpResponse.json({ message: "pong" });
  }),
  ...clientHandlers,
  ...transportTypeHandlers,
  ...itemHandlers,
  ...orderHandlers,
];
