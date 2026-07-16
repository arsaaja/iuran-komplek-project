<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'ktp_photo' => ['nullable', 'image', 'max:2048'],
            'resident_type' => ['sometimes', 'required', 'in:tetap,kontrak'],
            'phone_number' => ['sometimes', 'required', 'string', 'max:20'],
            'marital_status' => ['sometimes', 'required', 'in:lajang,menikah,cerai'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
