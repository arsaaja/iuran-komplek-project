<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'resident' => new ResidentResource($this->whenLoaded('resident')),
            'house' => new HouseResource($this->whenLoaded('house')),
            'payment_date' => $this->payment_date?->toDateTimeString(),
            'total_amount' => (float) $this->total_amount,
            'note' => $this->note,
            'items' => $this->whenLoaded('items', function () {
                return $this->items->map(fn($item) => [
                    'id' => $item->id,
                    'due_type' => $item->dueType->name ?? null,
                    'period_month' => $item->period_month,
                    'period_year' => $item->period_year,
                    'amount' => (float) $item->amount,
                    'status' => $item->status,
                ]);
            }),
            'created_at' => $this->created_at,
        ];
    }
}
