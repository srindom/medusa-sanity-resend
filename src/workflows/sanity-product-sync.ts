import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ProductDTO } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/framework/utils";
import SanityModuleService from "../modules/sanity/service";
import { SANITY_MODULE } from "../modules/sanity";

export type SyncStepInput = {
  product_ids?: string[];
}

export const syncStep = createStep(
  { name: "sync-step", async: true},
  async (input: SyncStepInput, { container }) => {
    const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE);
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    let total = 0;
    const upsertMap: {
      before: any
      after: any
    }[] = []

    const batchSize = 200;
    let hasMore = true;
    let offset = 0;
    let filters = input.product_ids ? {
      id: input.product_ids
    } : {}

    while (hasMore) {
      const {
        data: products,
        metadata: { count }
      } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          // @ts-ignore
          "sanity_product.*"
        ],
        filters,
        pagination: {
          skip: offset,
          take: batchSize,
          order: {
            id: "ASC"
          }
        }
      });

      try {
        await promiseAll(
          products.map(async (prod) => {
            const after = await sanityModule.upsertSyncDocument(
              "product", 
              prod as ProductDTO
            );
  
            upsertMap.push({
              // @ts-ignore
              before: prod.sanity_product,
              after
            })
  
            return after
          }),
        )
      } catch (e) {
        return StepResponse.permanentFailure(
          `An error occurred while syncing documents: ${e}`,
          upsertMap
        )
      }

      offset += batchSize;
      hasMore = offset < count;
      total += products.length;
    }

    return new StepResponse({ total }, upsertMap);
  },
  async (upsertMap, { container }) => {
    if (!upsertMap) {
      return
    }

    const sanityModule: SanityModuleService = container.resolve(SANITY_MODULE);

    await promiseAll(
      upsertMap.map(({ before, after }) => {
        if (!before) {
          // delete the document
          return sanityModule.delete(after._id)
        }

        const { _id: id, ...oldData } = before

        return sanityModule.update(
          id,
          oldData
        )
      })
    )
  }
);

export type SanitySyncProductsWorkflowInput = {
  product_ids?: string[];
};

export const sanitySyncProductsWorkflow = createWorkflow(
  { name: "sanity-sync-products", retentionTime: 10000 },
  function (input: SanitySyncProductsWorkflowInput) {
    const result = syncStep(input);

    return new WorkflowResponse(result);
  },
);
