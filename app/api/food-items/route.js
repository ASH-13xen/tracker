import * as foodItemService from "@/lib/services/food-item.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const items = await foodItemService.getAllFoodItems();
    return ok(items);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await foodItemService.createFoodItem(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
