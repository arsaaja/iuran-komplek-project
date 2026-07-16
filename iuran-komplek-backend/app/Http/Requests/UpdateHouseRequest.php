<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'house_number' => [
                'sometimes', 'required', 'string', 'max:20',
                Rule::unique('houses', 'house_number')->ignore($this->route('house')),
            ],
            'house_type' => ['sometimes', 'required', 'in:tetap,kontrak'],
            'status' => ['sometimes', 'required', 'in:dihuni,tidak_dihuni'],
            // Wajib diisi kalau status rumah diubah/ditetapkan jadi "dihuni"
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
