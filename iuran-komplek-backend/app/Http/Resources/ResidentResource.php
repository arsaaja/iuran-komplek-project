<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ktp_photo_url' => $this->ktp_photo_path ? asset('storage/'.$this->ktp_photo_path) : null,
            'resident_type' => $this->resident_type,
            'phone_number' => $this->phone_number,
            'marital_status' => $this->marital_status,
            'is_active' => $this->is_active,
            'current_house' => new HouseResource($this->whenLoaded('currentHouse')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
