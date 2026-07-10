import { http, HttpResponse } from "msw";
import { listAudit } from "../fixtures/audit";

export const auditHandlers = [
  http.get("/api/audit", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const events = listAudit({
      entityType: params.get("entityType") ?? undefined,
      entityId: params.get("entityId") ?? undefined,
    });
    return HttpResponse.json(events);
  }),
];
