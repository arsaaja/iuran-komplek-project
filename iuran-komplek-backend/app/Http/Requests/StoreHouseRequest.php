<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'house_number' => ['required', 'string', 'max:20', 'unique:houses,house_number'],
            'house_type' => ['required', 'in:tetap,kontrak'],
            'status' => ['required', 'in:dihuni,tidak_dihuni'],
            // Wajib diisi kalau status rumah "dihuni"
            'current_resident_id' => [
                Rule::requiredIf(fn () => $this->input('status') === 'dihuni'),
                'nullable',
                'exists:residents,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'current_resident_id.required_if' => 'Penghuni wajib dipilih jika status rumah dihuni.',
        ];
    }
}
