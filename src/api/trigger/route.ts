import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const eventBus = req.scope.resolve("event_bus")

  await eventBus.emit({
    name: "order.placed",
    data: { id: "order_01JDSSRHAYZQZ1H4A8JV00HG7S" }
  })

  res.json({ status: "ok" })
}
