import { http, HttpResponse } from "msw";
import {
  createTransportType,
  getTransportTypeById,
  listTransportTypes,
  updateTransportType,
} from "../fixtures/transport-types";

export const transportTypeHandlers = [
  http.get("/api/transport-types", () => {
    return HttpResponse.json(listTransportTypes());
  }),

  http.post("/api/transport-types", async ({ request }) => {
    const body = (await request.json()) as { name?: string; code?: string };
    if (!body.name) {
      return HttpResponse.json(
        { error: "name é obrigatório" },
        { status: 400 }
      );
    }
    const transportType = createTransportType({
      name: body.name,
      code: body.code ?? "",
    });
    return HttpResponse.json(transportType, { status: 201 });
  }),

  http.put("/api/transport-types/:id", async ({ request, params }) => {
    const body = (await request.json()) as { name?: string; code?: string };
    if (!body.name) {
      return HttpResponse.json(
        { error: "name é obrigatório" },
        { status: 400 }
      );
    }
    const id = params.id as string;
    if (!getTransportTypeById(id)) {
      return HttpResponse.json(
        { error: "Tipo de transporte não encontrado" },
        { status: 404 }
      );
    }
    const updated = updateTransportType(id, {
      name: body.name,
      code: body.code ?? "",
    });
    return HttpResponse.json(updated);
  }),
];
