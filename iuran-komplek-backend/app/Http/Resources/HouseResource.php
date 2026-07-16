<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HouseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'house_number' => $this->house_number,
            'house_type' => $this->house_type,
            'status' => $this->status,
            'current_resident' => new ResidentResource($this->whenLoaded('currentResident')),
            'histories' => HouseResidentHistoryResource::collection($this->whenLoaded('histories')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
