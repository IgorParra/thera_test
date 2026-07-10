import { http, HttpResponse } from "msw";
import {
  createClient,
  getClientById,
  listClients,
  updateClient,
} from "../fixtures/clients";

export const clientHandlers = [
  http.get("/api/clients", () => {
    return HttpResponse.json(listClients());
  }),

  http.post("/api/clients", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      document?: string;
      authorizedTransportTypeIds?: string[];
    };
    if (!body.name) {
      return HttpResponse.json(
        { error: "name é obrigatório" },
        { status: 400 }
      );
    }
    const client = createClient({
      name: body.name,
      document: body.document ?? "",
      authorizedTransportTypeIds: body.authorizedTransportTypeIds,
    });
    return HttpResponse.json(client, { status: 201 });
  }),

  http.put("/api/clients/:id", async ({ request, params }) => {
    const body = (await request.json()) as {
      name?: string;
      document?: string;
      authorizedTransportTypeIds?: string[];
    };
    if (!body.name) {
      return HttpResponse.json(
        { error: "name é obrigatório" },
        { status: 400 }
      );
    }
    const id = params.id as string;
    if (!getClientById(id)) {
      return HttpResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }
    const updated = updateClient(id, {
      name: body.name,
      document: body.document ?? "",
      authorizedTransportTypeIds: body.authorizedTransportTypeIds,
    });
    return HttpResponse.json(updated);
  }),
];
